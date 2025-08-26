# Offzielles Java-Image als Basis verwenden
# Java wird benötigt, um Spring Boot App zu starten
FROM eclipse-temurin:17-jdk-jammy

# Arbeitsverzeichnis wird im Container gesetzt
# Alles was kopiert wird, landet in "/app"
WORKDIR /app

# Das gebaute JAR in Container setzen
COPY target/Furko-0.0.1-SNAPSHOT.jar app.jar

# Port freigeben, auf dem die App läuft
EXPOSE 8080

# App muss gestartet werden, wenn der Container läuft
ENTRYPOINT ["java", "-jar", "app.jar"]