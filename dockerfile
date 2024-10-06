# Stage 1: Build Frontend
FROM node:16-alpine AS build-front
WORKDIR /app/front
COPY Front/package*.json ./
RUN npm install
COPY Front/ ./
RUN npm run build

# Stage 2: Set up Backend
FROM node:16-alpine AS build-server
WORKDIR /app/server
COPY Server/package*.json ./
RUN npm install
COPY Server/ ./

# Copy the built frontend from Stage 1 to the backend's static directory
COPY --from=build-front /app/front/build ./public

# Expose port and start server
EXPOSE 3000
CMD ["npm", "run", "start"]