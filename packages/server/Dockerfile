FROM node:14.17-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g typescript
RUN npm install -g prisma

COPY . .

RUN npm run prisma:generate

RUN npm run build

CMD ["npm", "run", "start"]

EXPOSE 4000
