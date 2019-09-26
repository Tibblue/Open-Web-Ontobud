FROM ubuntu:latest
USER root
WORKDIR /home/app

RUN apt-get update
RUN apt-get -y install build-essential
RUN apt-get -y install curl
RUN apt-get -y install nodejs
RUN curl -L https://www.npmjs.com/install.sh | sh

COPY . /home/app

EXPOSE 8000

WORKDIR /home/app
RUN npm install
CMD npm run serve
