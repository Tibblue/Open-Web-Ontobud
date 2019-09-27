FROM yyz1989/rdf4j:latest
EXPOSE 8080

COPY ./rdf_save_state /root/.RDF4J
COPY ./programs/apache-tomcat-9.0.22/conf/web.xml /usr/local/tomcat/conf/

WORKDIR /usr/local/tomcat/bin/
CMD ./catalina.sh run
# CMD ./startup.sh; tail -f startup.sh
