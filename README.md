# Master-s-Dissertation

Master's Dissertation - FrontEnd for RDF4J


## Description

(TODO)


## Requirements

Requirements to run this project:
  * Docker and Docker-Compose
Or:
  * Mongo
  * RDF4J
  * Apache Tomcat (or similar)
  * Node.JS
  * Vue

Look below at the [Install subsection](#install) on how to set everything properly.

### Install

#### Docker-compose and Docker (TODO)

Google is your best friend :)

#### Vue-cli (TODO)

Google is your best friend :)

#### Node.js (TODO)

Google is your best friend :)

#### Mongo (TODO)

Google is your best friend :)

#### RDF4J (TODO)

Download RDF4J server (TODO add link)
Install Apache Tomcat Server.

Before any execution, a few programs need to be installed.
For the programs needed use the Download Guide:
  * [GitHub Link](https://github.com/Tibblue/Master-s-Dissertation/blob/master/rdf4j/programs/download_guide.md)
  * [File Link](rdf4j/programs/download_guide.md)


### Running with...

The project can be deployed with:
* Docker-compose
* Docker
* Local applications (Vue, NodeJS, RDF4J, MongoDB)

#### Docker-compose

With Docker-Compose installed, you only need to run `$ docker-compose up` at the git root folder.

In case you dont want to download the entire repository, the minimal required files are the `docker-compose.yml` and `.env` files and run `$ docker-compose up`.

There is a additional file `docker-compose_build.yml` use to run with build available. (Not tested recently, may not work correctly)

If you need to change ports, simply change the `.env` file variables before running.

#### Docker

Docker can run all containers individually using:
* docker run -d --rm -p 8000:8000 tibblue/tese-frontend:latest
* docker run -d --rm -p 8001:5000 tibblue/tese-backend:latest
* docker run -d --rm -p 8002:8080 tibblue/tese-rdf4j:latest
* docker run -d --rm -p 8003:27017 mongo:latest

NOTE: This is not the intended run method, and there can be some errors with connections between containers.

#### Not Docker

Running without Docker requires all 4 servers to be iniciated using the following 4 commands from the git root folder:
  * cd rdf4j && make startup
  * cd mongo && ./mongod.sh
    * NOTE: Can be skipped if you have Mongo running as a Daemon locally
  * cd backend && npm run start
  * cd frontend && npm run serve

