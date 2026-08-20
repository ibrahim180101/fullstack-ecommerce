pipeline {

    agent any

    environment {

        AWS_REGION = "us-east-1"
        AWS_ACCOUNT_ID = "154426737549"

        BACKEND_ECR =
            "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ecommerce-backend"

        FRONTEND_ECR =
            "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ecommerce-frontend"

        BACKEND_IMAGE =
            "${BACKEND_ECR}:latest"

        FRONTEND_IMAGE =
            "${FRONTEND_ECR}:latest"
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
                    echo "=========================================="
                    echo "BUILDING SPRING BOOT BACKEND"
                    echo "=========================================="

                    cd backend

                    chmod +x mvnw || true

                    if [ -f mvnw ]; then
                        ./mvnw clean package -DskipTests
                    else
                        mvn clean package -DskipTests
                    fi
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                    echo "=========================================="
                    echo "BUILDING REACT FRONTEND"
                    echo "=========================================="

                    cd frontend

                    npm install

                    npm run build
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                    echo "=========================================="
                    echo "LOGIN TO AMAZON ECR"
                    echo "=========================================="

                    aws ecr get-login-password \
                        --region ${AWS_REGION} \
                    | docker login \
                        --username AWS \
                        --password-stdin \
                        ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh '''
                    echo "=========================================="
                    echo "BUILDING BACKEND DOCKER IMAGE"
                    echo "=========================================="

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
                    echo "=========================================="
                    echo "BUILDING FRONTEND DOCKER IMAGE"
                    echo "=========================================="

                    docker build \
                        --no-cache \
                        -t ${FRONTEND_IMAGE} \
                        ./frontend
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                    echo "=========================================="
                    echo "PUSHING BACKEND IMAGE"
                    echo "=========================================="

                    docker push ${BACKEND_IMAGE}
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                    echo "=========================================="
                    echo "PUSHING FRONTEND IMAGE"
                    echo "=========================================="

                    docker push ${FRONTEND_IMAGE}
                '''
            }
        }

        stage('Deploy Backend to ECS') {
            steps {
                sh '''
                    echo "=========================================="
                    echo "DEPLOYING BACKEND TO ECS"
                    echo "=========================================="

                    aws ecs update-service \
                        --cluster fullstack-ecommerce-cluster \
                        --service fullstack-ecommerce-backend \
                        --force-new-deployment \
                        --region ${AWS_REGION}
                '''
            }
        }

        stage('Deploy Frontend to ECS') {
            steps {
                sh '''
                    echo "=========================================="
                    echo "DEPLOYING FRONTEND TO ECS"
                    echo "=========================================="

                    aws ecs update-service \
                        --cluster fullstack-ecommerce-cluster \
                        --service fullstack-ecommerce-frontend \
                        --force-new-deployment \
                        --region ${AWS_REGION}
                '''
            }
        }

        stage('Wait for Backend') {
            steps {
                sh '''
                    echo "Waiting for backend..."

                    aws ecs wait services-stable \
                        --cluster fullstack-ecommerce-cluster \
                        --services fullstack-ecommerce-backend \
                        --region ${AWS_REGION}
                '''
            }
        }

        stage('Wait for Frontend') {
            steps {
                sh '''
                    echo "Waiting for frontend..."

                    aws ecs wait services-stable \
                        --cluster fullstack-ecommerce-cluster \
                        --services fullstack-ecommerce-frontend \
                        --region ${AWS_REGION}
                '''
            }
        }
    }

    post {

        success {
            echo '''
==========================================
       DEPLOYMENT SUCCESSFUL
==========================================

Backend:
ecommerce-backend:latest

Frontend:
ecommerce-frontend:latest

ML backend:
NOT DEPLOYED

==========================================
'''
        }

        failure {
            echo '''
==========================================
         DEPLOYMENT FAILED
==========================================

Check the failed Jenkins stage.

==========================================
'''
        }

        always {
            sh '''
                echo "Cleaning unused Docker resources..."

                docker system prune -af || true
            '''
        }
    }
}
