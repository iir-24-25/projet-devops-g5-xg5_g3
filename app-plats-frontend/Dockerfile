# Étape 1 : Build de l'application Vite (React)
FROM node:18 AS build
WORKDIR /app

# 1. Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# 2. Installer les dépendances
RUN npm ci

# 3. Copier le reste des fichiers
COPY . .

# 4. Build de l'application (Vite utilise 'dist' par défaut)
RUN npm run build

# Étape 2 : Servir avec Nginx
FROM nginx:alpine

# 1. Copier la configuration Nginx personnalisée (optionnel)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 2. Copier le build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# 3. Exposer le port et démarrer Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]