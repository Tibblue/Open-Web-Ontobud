FROM vuejs/ci:latest
# default port is 8000, change as needed
EXPOSE 8000

# set FRONTEND port, default 8000
ARG VUE_APP_FRONTEND_PORT=8000
ENV VUE_APP_FRONTEND_PORT=$VUE_APP_FRONTEND_PORT
# set BACKEND port, default 8001
ARG VUE_APP_BACKEND_PORT=8001
ENV VUE_APP_BACKEND_PORT=$VUE_APP_BACKEND_PORT
# set HOST_URL port, default 'localhost'
ARG VUE_APP_BACKEND_HOST=localhost
ENV VUE_APP_BACKEND_HOST=$VUE_APP_BACKEND_HOST

COPY . /home/app/frontend

WORKDIR /home/app/frontend
RUN npm install
RUN npm audit fix
CMD npm run serve
