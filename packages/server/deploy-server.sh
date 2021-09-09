#! /bin/bash
docker build -t florianwoelki/todover-server:1 .
docker push florianwoelki/todover-server:1
ssh root@68.183.71.58 "docker pull florianwoelki/todover-server:1 && docker tag florianwoelki/todover-server:1 dokku/backend:latest && dokku deploy backend latest"
