# use node version 14.17.0
FROM node:14.17-alpine AS builder
LABEL maintainer="florianwoelki@gmx.de"

ARG PORT=4000

# set working directory to /app
WORKDIR /usr/src/app

# update env, typescript and prisma cli
RUN \
  apk update && \
  npm install -g typescript --loglevel notice && \
  npm install -g prisma --loglevel notice && \
  rm -rf /var/lib/apt/lists/*

# copy package.json file to working directory
COPY ./package.json ./
COPY ./package-lock.json ./

# install dependencies
RUN npm install --loglevel notice

# copy all files to working directory
COPY . .

# run prisma generate to generate files for prisma
RUN npm run prisma:generate

# build the project
RUN npm run build

# run the built project with start script
CMD ["node", "./dist/index.js"]

# expose 4000 port
EXPOSE ${PORT}
