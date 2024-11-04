# --- Stage: Build ---
FROM node:22 AS build
WORKDIR /site
COPY . .
RUN npm install && npm run build-site

# --- Stage: Production ---
FROM nginx:latest AS prod
EXPOSE 80
COPY nginx-zyt.alexi.ch/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /site/zyt.alexi.ch-site /usr/share/nginx/html