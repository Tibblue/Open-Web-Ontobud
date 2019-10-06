build:
	docker build -t tibblue/tese-rdf4j:latest ./rdf4j
	docker build -t tibblue/tese-frontend:latest ./frontend
	# docker build --build-arg VUE_APP_RDF4J_PORT=8080 -t tibblue/tese-frontend:latest ./frontend

upload:
	docker push tibblue/tese-rdf4j:latest
	docker push tibblue/tese-frontend:latest

runCompose:
	docker-compose --project-directory ./frontend up

debugRunRDF: #just a note
	docker run -it --rm -p 8080:8080 tibblue/tese-rdf4j:latest

debugRunFrontend: #just a note
	docker run -it --rm -p 8000:8000 tibblue/tese-frontend:latest
	# docker run -it --rm -e VUE_APP_RDF4J_PORT=8080 -p 8000:8000 tibblue/tese-frontend:latest
