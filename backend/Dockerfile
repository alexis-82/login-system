FROM node:alpine
WORKDIR /app/backend
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 3000