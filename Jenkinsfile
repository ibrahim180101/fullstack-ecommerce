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
                    echo "BUILDING BACKEND"
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
                    echo "BUILDING FRONTEND"
                    echo "=========================================="

                    docker run --rm \
                        -v "$WORKSPACE/frontend:/app" \
                        -w /app \
                        node:18-alpine \
                        sh -c "npm install && npm run build"
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                    echo "=========================================="
                    echo "LOGIN TO ECR"
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
                    echo "BUILDING BACKEND IMAGE"
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
                    echo "BUILDING FRONTEND IMAGE"
                    echo "=========================================="

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
                    echo "=========================================="
                    echo "PUSHING BACKEND TO ECR"
                    echo "=========================================="

                    docker push ${BACKEND_IMAGE}
                '''
            }
        }

        stage('Push Frontend to ECR') {
            steps {
                sh '''
                    echo "=========================================="
                    echo "PUSHING FRONTEND TO ECR"
                    echo "=========================================="

                    docker push ${FRONTEND_IMAGE}
                '''
            }
        }
    }

    post {

        success {
            echo '''
==========================================
       ECR PUSH SUCCESSFUL
==========================================

Backend:
ecommerce-backend:latest

Frontend:
ecommerce-frontend:latest

Images successfully pushed to Amazon ECR.

==========================================
'''
        }

        failure {
            echo '''
==========================================
          BUILD FAILED
==========================================

Check the failed Jenkins stage.

==========================================
'''
        }

        always {
            sh '''
                echo "Cleaning Docker resources..."
                docker system prune -af || true
            '''
        }
    }
}
