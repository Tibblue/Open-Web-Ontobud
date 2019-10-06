FROM node:latest
# default port is 8000, change as needed
EXPOSE 8000
# set RDF4J port, default 8080
ARG VUE_APP_RDF4J_PORT=8080
ENV VUE_APP_RDF4J_PORT=$VUE_APP_RDF4J_PORT

COPY . /home/app/frontend

WORKDIR /home/app/frontend
RUN npm install
CMD npm run serve
