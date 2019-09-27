FROM ubuntu:latest
USER root
WORKDIR /home/app

RUN apt-get update
#RUN apt-get -y install build-essential
RUN apt-get -y install openjdk-8-jre

COPY ./rdf_save_state /root/.RDF4J
COPY ./programs/apache-tomcat-9.0.22 /home/app

# grant execution permissions
RUN chmod +x /home/app/bin/startup.sh
RUN chmod +x /home/app/bin/shutdown.sh
RUN chmod +x /home/app/bin/catalina.sh

EXPOSE 8080

WORKDIR /home/app/bin/
CMD ./startup.sh; tail -f startup.sh