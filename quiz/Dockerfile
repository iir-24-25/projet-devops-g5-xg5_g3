FROM node:18-alpine

# 1. Installer les dépendances système requises
RUN apk add --no-cache --virtual .gyp python3 make g++

# 2. Configurer le répertoire de travail
WORKDIR /app

# 3. Copier uniquement les fichiers nécessaires pour l'installation
COPY package.json package-lock.json* ./

# 4. Installation propre des dépendances
RUN npm config set update-notifier false \
    && npm config set fund false \
    && npm ci --omit=dev --prefer-offline --no-audit --progress=false

# 5. Nettoyer les dépendances de build inutiles
RUN apk del .gyp

# 6. Copier le reste de l'application
COPY . .

# 7. Build de l'application
RUN npm run build

# 8. Configuration du runtime
EXPOSE 3000
CMD ["npm", "start"]