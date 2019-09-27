FROM node:latest
EXPOSE 8000

COPY . /home/app

WORKDIR /home/app
RUN npm install
CMD npm run serve
