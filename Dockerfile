# Production Stage (Serve pre-built assets)
FROM nginx:alpine

# Copy local built assets
COPY dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
