# Imagen base
FROM node:22-slim

# Carpeta base dentro del contenedor
WORKDIR /node

# Copia los package.json del backend
COPY BACKEND/package*.json ./BACKEND/

# Instala dependencias del backend
WORKDIR /node/BACKEND
RUN npm install

# Copia el resto del proyecto
WORKDIR /node
COPY . .

# Vuelve al backend para ejecutar
WORKDIR /node/BACKEND

EXPOSE 3000
CMD ["npm", "run", "dev"]
