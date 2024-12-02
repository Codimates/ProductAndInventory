FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm i aws-sdk

COPY . .

EXPOSE 4002

CMD ["npm", "start"]
