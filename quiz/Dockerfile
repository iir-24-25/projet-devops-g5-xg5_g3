# Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy only POM first to leverage Docker cache
COPY pom.xml .
# Download all dependencies (cached unless POM changes)
RUN mvn dependency:go-offline -B

# Copy source files
COPY src ./src

# Build application (skip tests)
RUN mvn package -DskipTests -Dmaven.test.skip=true

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy built jar from builder stage
COPY --from=builder /app/target/quiz-*.jar app.jar

# Health check (for Spring Boot Actuator)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]