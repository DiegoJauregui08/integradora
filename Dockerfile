FROM node:22-bullseye-slim

# Copia del backend
WORKDIR /node/backend
COPY /backend/package.json .
RUN npm install

# Copiar el proyecto completo
WORKDIR /node
COPY . .

# Ejecución
WORKDIR /node/backend
EXPOSE 3000
CMD ["npm", "run", "dev"]