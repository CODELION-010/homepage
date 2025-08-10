FROM nginx:alpine

# Crear directorio de trabajo
WORKDIR /usr/share/nginx/html

# Limpiar el directorio por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos del proyecto
COPY . /usr/share/nginx/html/

# Asegurar permisos correctos
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Crear configuración personalizada de Nginx
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    error_page 404 /index.html; \
}' > /etc/nginx/conf.d/default.conf

# Verificar configuración de Nginx
RUN nginx -t

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
