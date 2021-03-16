FROM node:10.15.3
# FROM node:latest

# default port is 5000, change as needed
EXPOSE 5000

### Set Enviroment Variables
# set Node(Backend) port, default 8738
# ARG VUE_APP_BACKEND_PORT=8738
# ENV VUE_APP_BACKEND_PORT=$VUE_APP_BACKEND_PORT
# set RDF4J port, default 8739
# ARG RDF4J_PORT=8739
# ENV RDF4J_PORT=$RDF4J_PORT
# set MONGO port, default 8740
# ARG MONGO_PORT=8740
# ENV MONGO_PORT=$MONGO_PORT

### Set WorkDir
WORKDIR /home/app/backend

### Copy package.json
COPY package*.json /home/app/backend/
### NPM Install
# RUN npm uninstall bcrypt
# RUN npm install bcrypt
RUN npm install
# RUN npm ci --only=production
# RUN npm audit fix

### Copy APP
COPY . /home/app/backend

### Run Node Server
# CMD npm run start
CMD npm start rdf4j:8080 mongo:27017
