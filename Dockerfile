FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install mariadb

COPY . .

CMD [ "node", "main.js" ]