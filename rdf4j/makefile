runCatalina:
	export JAVA_OPTS='-Dorg.eclipse.rdf4j.appdata.basedir=/mnt/c/Users/KIKO/Desktop/GIT/TESE/rdf4j/rdf_save_state' && \
  # export JAVA_OPTS='-Dorg.eclipse.rdf4j.appdata.basedir=/home/kiko/Desktop/git/Master-s-Dissertation/rdf4j/rdf_save_state' && \
	# echo $$JAVA_OPTS && \
	cd programs/apache-tomcat-9.0.22/bin/ && \
	./catalina.sh run


startup:
	export JAVA_OPTS='-Dorg.eclipse.rdf4j.appdata.basedir=/mnt/c/Users/KIKO/Desktop/GIT/TESE/rdf4j/rdf_save_state' && \
	# echo $$JAVA_OPTS && \
	# export CATALINA_OPTS="$$CATALINA_OPTS -Xms512m -Xmx4096m -XX:PermSize=256m -XX:MaxPermSize=1024m" && \
	# echo $$CATALINA_OPTS && \
	cd programs/apache-tomcat-9.0.22/bin/ && \
	./startup.sh

shutdown:
	cd programs/apache-tomcat-9.0.22/bin/ && \
	./shutdown.sh

startupbackup:
	export JAVA_OPTS='-Dorg.eclipse.rdf4j.appdata.basedir=/mnt/c/Users/KIKO/Desktop/GIT/TESE/rdf4j/rdf_save_state' && \
# 	echo $$JAVA_OPTS && \
	cd programs/apache-tomcat-9.0.22-backup/bin/ && \
	./startup.sh

shutdownbackup:
	cd programs/apache-tomcat-9.0.22-backup/bin/ && \
	./shutdown.sh
