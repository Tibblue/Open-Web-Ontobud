FROM node:10.15.3
# FROM node:latest
# default port is 5000, change as needed
EXPOSE 5000

# set RDF4J port, default 8080
# ARG VUE_APP_RDF4J_PORT=8080
# ENV change if needed
# ENV VUE_APP_RDF4J_PORT=$VUE_APP_RDF4J_PORT
# set Vue(Frontend) port, default 8000
# ARG VUE_APP_VUE_PORT=8000
# ENV change if needed
# ENV VUE_APP_VUE_PORT=$VUE_APP_VUE_PORT

# ENV MONGO_HOST "host.docker.internal"

COPY . /home/app/backend

WORKDIR /home/app/backend
# RUN npm uninstall bcrypt
# RUN npm install bcrypt
RUN npm install
# RUN npm audit fix
CMD npm run start
