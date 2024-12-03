FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm install -g nodemon
COPY package*.json ./

RUN npm install
RUN npm i aws-sdk

COPY . .

EXPOSE 4002

ENV NAME inventory-management

CMD ["npm", "start"]
