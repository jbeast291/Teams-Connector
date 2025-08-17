FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install mariadb

COPY . .

#RUN mkdir -p /usr/src/app/Config/Logs && \ 
#    chown -R node:node /usr/src/app/Config/Logs && \ 
#    chmod -R 775 /usr/src/app/Config/Logs

#USER node

CMD [ "node", "main.js" ]