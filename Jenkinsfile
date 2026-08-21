pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1"
        AWS_ACCOUNT_ID = "154426737549"

        BACKEND_ECR = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ecommerce-backend"
        FRONTEND_ECR = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ecommerce-frontend"

        BACKEND_IMAGE = "${BACKEND_ECR}:latest"
        FRONTEND_IMAGE = "${FRONTEND_ECR}:latest"

        BACKEND_TASK_DEFINITION = "backend-task"
        FRONTEND_TASK_DEFINITION = "frontend-task"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                sh '''
                    set -e

                    cd backend

                    chmod +x mvnw

                    ./mvnw clean package -Dmaven.test.skip=true
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                    set -e

                    docker run --rm \
                        -v "$WORKSPACE/frontend:/app" \
                        -w /app \
                        node:20-alpine \
                        sh -c "npm install && npm run build"
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                    set -e

                    aws ecr get-login-password \
                        --region ${AWS_REGION} | \
                    docker login \
                        --username AWS \
                        --password-stdin \
                        ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh '''
                    set -e

                    docker build \
                        --no-cache \
                        -t ${BACKEND_IMAGE} \
                        ./backend
                '''
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh '''
                    set -e

                    docker build \
                        --no-cache \
                        -t ${FRONTEND_IMAGE} \
                        ./frontend
                '''
            }
        }

        stage('Push Backend to ECR') {
            steps {
                sh '''
                    set -e

                    docker push ${BACKEND_IMAGE}
                '''
            }
        }

        stage('Push Frontend to ECR') {
            steps {
                sh '''
                    set -e

                    docker push ${FRONTEND_IMAGE}
                '''
            }
        }

        stage('Update Backend Task Definition') {
            steps {
                sh '''
                    set -e

                    echo "Getting current backend task definition..."

                    aws ecs describe-task-definition \
                        --task-definition ${BACKEND_TASK_DEFINITION} \
                        --region ${AWS_REGION} \
                        --query taskDefinition \
                        > backend-task.json

                    echo "Updating backend image to:"
                    echo "${BACKEND_IMAGE}"

                    jq --arg IMAGE "${BACKEND_IMAGE}" \
                        '
                        .containerDefinitions[0].image = $IMAGE
                        |
                        del(
                            .taskDefinitionArn,
                            .revision,
                            .status,
                            .requiresAttributes,
                            .compatibilities,
                            .registeredAt,
                            .registeredBy
                        )
                        ' \
                        backend-task.json \
                        > backend-task-new.json

                    echo "Registering new backend task definition..."

                    aws ecs register-task-definition \
                        --cli-input-json file://backend-task-new.json \
                        --region ${AWS_REGION}

                    echo "Backend task definition updated successfully."
                '''
            }
        }

        stage('Update Frontend Task Definition') {
            steps {
                sh '''
                    set -e

                    echo "Getting current frontend task definition..."

                    aws ecs describe-task-definition \
                        --task-definition ${FRONTEND_TASK_DEFINITION} \
                        --region ${AWS_REGION} \
                        --query taskDefinition \
                        > frontend-task.json

                    echo "Updating frontend image to:"
                    echo "${FRONTEND_IMAGE}"

                    jq --arg IMAGE "${FRONTEND_IMAGE}" \
                        '
                        .containerDefinitions[0].image = $IMAGE
                        |
                        del(
                            .taskDefinitionArn,
                            .revision,
                            .status,
                            .requiresAttributes,
                            .compatibilities,
                            .registeredAt,
                            .registeredBy
                        )
                        ' \
                        frontend-task.json \
                        > frontend-task-new.json

                    echo "Registering new frontend task definition..."

                    aws ecs register-task-definition \
                        --cli-input-json file://frontend-task-new.json \
                        --region ${AWS_REGION}

                    echo "Frontend task definition updated successfully."
                '''
            }
        }
    }

    post {

        success {
            echo '''
            ==========================================
            DEPLOYMENT PREPARATION SUCCESSFUL
            ==========================================

            Backend image:
            ecommerce-backend:latest

            Frontend image:
            ecommerce-frontend:latest

            Backend task definition:
            backend-task

            Frontend task definition:
            frontend-task

            New task-definition revisions created.

            ECS SERVICES WERE NOT UPDATED.
            Cluster was NOT changed.

            You can manually update the ECS services.
            ==========================================
            '''
        }

        failure {
            echo '''
            ==========================================
            BUILD / ECR / TASK DEFINITION UPDATE FAILED
            ==========================================

            Check the failed Jenkins stage.
            ==========================================
            '''
        }

        always {
            sh 'docker system prune -af || true'
        }
    }
}
