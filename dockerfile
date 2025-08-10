FROM nginx:alpine

# Copiar el HTML, CSS y JS a la carpeta pública de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80
