# Étape de build
FROM maven:3.8.6-openjdk-18 AS builder
WORKDIR /app
COPY pom.xml .
# Cette étape télécharge toutes les dépendances (utilise le cache Docker si pom.xml n'a pas changé)
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn package -DskipTests

# Étape d'exécution
FROM openjdk:18-jdk-alpine
WORKDIR /app
# Copie le JAR depuis l'étape de build
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]