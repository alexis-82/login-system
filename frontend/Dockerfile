FROM node:alpine
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run build  # Costruisce l'app per la produzione
CMD ["npm", "run", "dev"]
EXPOSE 5173