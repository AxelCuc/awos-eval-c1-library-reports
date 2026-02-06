# Usa Node 20 en lugar de 18
FROM node:20-alpine

# Crea directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json primero para aprovechar la cache
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Construye la aplicación Next.js
RUN npm run build

# Expone el puerto de la app
EXPOSE 3000

# Arranca la aplicación en modo producción
CMD ["npm", "run", "start"]