FROM yyz1989/rdf4j:latest
EXPOSE 8080

COPY ./rdf_save_state /root/.RDF4J

WORKDIR /usr/local/tomcat/bin/
CMD ./catalina.sh run
# CMD ./startup.sh; tail -f startup.sh
