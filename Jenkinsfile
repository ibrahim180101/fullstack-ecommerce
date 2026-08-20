pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1"
        AWS_ACCOUNT_ID = "154426737549"
        BACKEND_ECR = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ecommerce-backend"
        FRONTEND_ECR = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ecommerce-frontend"
        BACKEND_IMAGE = "${BACKEND_ECR}:latest"
        FRONTEND_IMAGE = "${FRONTEND_ECR}:latest"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
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
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build --no-cache -t ${BACKEND_IMAGE} ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build --no-cache -t ${FRONTEND_IMAGE} ./frontend'
            }
        }

        stage('Push Backend to ECR') {
            steps {
                sh 'docker push ${BACKEND_IMAGE}'
            }
        }

        stage('Push Frontend to ECR') {
            steps {
                sh 'docker push ${FRONTEND_IMAGE}'
            }
        }
    }

    post {
        success {
            echo 'ECR PUSH SUCCESSFUL - backend and frontend images are available.'
        }
        failure {
            echo 'BUILD FAILED - check the failed Jenkins stage.'
        }
        always {
            sh 'docker system prune -af || true'
        }
    }
}
