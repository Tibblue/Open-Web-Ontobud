FROM yyz1989/rdf4j:latest
# default port is 8080, change as needed
EXPOSE 8080
# set savefiles location folder path
ENV RDF4J_DATA=/root/.RDF4J

# copy saves, useful during developement
COPY ./rdf_save_state /root/.RDF4J
# copy the server configurations
COPY ./programs/apache-tomcat-9.0.22/conf/web.xml /usr/local/tomcat/conf/

WORKDIR /usr/local/tomcat/bin/
CMD ./catalina.sh run
# CMD ./startup.sh; tail -f startup.sh
