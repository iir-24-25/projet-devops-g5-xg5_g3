# Étape de build
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# 2. Installation robuste des dépendances
RUN npm install --legacy-peer-deps --force

# 3. Copier le reste
COPY . .

# 4. Build avec vérification
RUN npm run build || (echo "Build failed! Contenu du dossier :" && ls -la && exit 1)
RUN [ -d "/app/build" ] || (echo "ERREUR: Dossier build manquant!" && exit 1)

# Étape de production
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]