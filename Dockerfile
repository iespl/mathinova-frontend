# Build Stage
FROM node:20-slim AS build-stage

WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Pass build args to Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production Stage (Serve pre-built assets)
FROM nginx:alpine

# Copy built assets from build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
