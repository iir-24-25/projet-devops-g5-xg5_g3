# Étape 1 : Build de l'application Vite (React)
FROM node:18 as build
WORKDIR /app

# Copier package.json et package-lock.json en premier pour optimiser le cache Docker
COPY package*.json ./

RUN npm install

# Copier le reste des fichiers
COPY . .

RUN npm run build

# Étape 2 : Servir avec Nginx
FROM nginx:alpine

# Copier le build dans le dossier nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
