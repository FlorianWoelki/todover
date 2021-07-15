FROM node:14.17-alpine AS builder

WORKDIR /usr/src/app

RUN \
  apk-get update && \
  apt-get install -y git && \
  npm install -g typescript --loglevel notice && \
  npm install -g prisma --loglevel notice && \
  rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --loglevel notice

COPY . .

RUN npm run prisma:generate

RUN npm run build

CMD ["npm", "run", "start"]

EXPOSE 4000
