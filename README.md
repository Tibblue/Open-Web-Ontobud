# Master-s-Dissertation

Master's Dissertation - FrontEnd for RDF4J



## Description

(TODO)


## Requirements

Requirements to run this project:
  * Docker and Docker-Compose
Or:
  * RDF4J
  * Mongo
  * Apache Tomcat (or similar)
  * Vue

Look below at the [Install subsection](#install) for a easy how to set everything properly.

### Install

#### Docker

Having Docker and Docker-Compose installed, you only need to run `$ docker-compose up` at the git root folder.
Optionally you can run both containers individually using Docker, by running both:
* docker run -it --rm -p 8080:8080 tibblue/tese-rdf4j:latest
* docker run -it --rm -p 8080:8080 tibblue/tese-mongo:latest (TODO)
* docker run -it --rm -p 8080:8080 tibblue/tese-backend:latest (TODO)
* docker run -it --rm -p 8080:8080 tibblue/tese-frontend:latest

#### Not Docker

Before any execution, a few programs need to be installed.
For the programs needed use the Download Guide:
  * [GitHub Link](https://github.com/Tibblue/Master-s-Dissertation/blob/master/rdf4j/programs/download_guide.md)
  * [File Link](rdf4j/programs/download_guide.md)

##### Run

Running without Docker requires all 4 servers to be iniciated using these commands:
  * cd rdf4j && make startup
  * cd mongo && ./mongod.sh
    * Can be skipped if you have Mongo running as a Daemon
  * cd backend && npm run start
  * cd frontend && npm run serve

