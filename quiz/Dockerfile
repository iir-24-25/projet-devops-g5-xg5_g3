FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && \
    npm install --legacy-peer-deps
COPY . .
RUN npm run build