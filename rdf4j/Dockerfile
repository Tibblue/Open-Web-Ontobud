FROM ubuntu:latest
USER root
WORKDIR /home/app

RUN apt-get update
#RUN apt-get -y install build-essential
RUN apt-get -y install openjdk-8-jre

COPY rdf_save_state/server /root/.RDF4J/server
COPY ./programs/apache-tomcat-9.0.22 /home/app

EXPOSE 8080

#RUN export JAVA_OPTS='-Dorg.eclipse.rdf4j.appdata.basedir=../../../rdf_save_state'
WORKDIR /home/app/bin/
CMD ./startup.sh; tail -f startup.sh
#RUN export JAVA_OPTS='-Dorg.eclipse.rdf4j.appdata.basedir=rdf_save_state'
#WORKDIR /home/app/
#CMD make startup; tail -f makefile