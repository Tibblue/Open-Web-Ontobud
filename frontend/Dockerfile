FROM vuejs/ci:latest

# default port is 8737, change as needed
EXPOSE 8737

### Set Enviroment Variables
# set FRONTEND port, default 8737
ARG VUE_APP_FRONTEND_PORT=8737
ENV VUE_APP_FRONTEND_PORT=$VUE_APP_FRONTEND_PORT
# set BACKEND port, default 8738
ARG VUE_APP_BACKEND_PORT=8738
ENV VUE_APP_BACKEND_PORT=$VUE_APP_BACKEND_PORT
# set HOST_URL port, default 'localhost'
ARG VUE_APP_BACKEND_HOST=localhost
ENV VUE_APP_BACKEND_HOST=$VUE_APP_BACKEND_HOST

### Set WorkDir
WORKDIR /home/app/frontend

### Copy package.json
COPY package*.json /home/app/frontend/
### NPM Install
RUN npm install
RUN npm audit fix

### Copy APP
COPY . /home/app/frontend

### Run Node Server
CMD npm run serve
