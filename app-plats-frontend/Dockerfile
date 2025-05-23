# Étape 1 : Build de l'application Vite (React)
FROM node:18 AS builder
WORKDIR /app

# 1. Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./

# 2. Installation propre des dépendances
RUN npm ci --silent

# 3. Copier le reste des fichiers
COPY . .

# 4. Build de l'application (avec vérification)
RUN npm run build && \
    ls -la /app/dist  # Vérification que le dossier dist existe

# Étape 2 : Servir avec Nginx
FROM nginx:1.23-alpine

# 1. Supprimer la configuration par défaut
RUN rm -rf /etc/nginx/conf.d/default.conf

# 2. Copier notre configuration Nginx (optionnel)
# COPY nginx.conf /etc/nginx/conf.d

# 3. Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# 4. Exposer le port et démarrer Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]