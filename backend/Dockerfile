# Use lightweight Java 17 base image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy the built JAR
COPY target/*.jar app.jar

# Spring Boot application port
EXPOSE 8082

# Production profile
ENV SPRING_PROFILES_ACTIVE=prod

# Start application
ENTRYPOINT ["java", "-jar", "app.jar"]
