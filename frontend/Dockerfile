FROM node:latest
EXPOSE 8000

COPY . /home/app/frontend

WORKDIR /home/app/frontend
RUN npm install
CMD npm run serve
