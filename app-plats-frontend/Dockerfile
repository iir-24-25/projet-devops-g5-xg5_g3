# Étape 1 : Build de l'application Vite (React)
FROM node:18 as build
WORKDIR /app
COPY ..
RUN npm install
RUN npm run build

# Étape 2 : Servir avec Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]