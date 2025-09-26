FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install -g nodemon

EXPOSE 8080

CMD ["nodemon", "server.js"]

