# Étape de build
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Copier les fichiers essentiels d'abord
COPY package.json package-lock.json ./

# 2. Installation FORCÉE des dépendances (méthode infaillible)
RUN npm install --force --legacy-peer-deps

# 3. Copier le reste
COPY . .

# 4. Build avec vérification
RUN npm run build && ls -la /app/dist

# Étape de production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]