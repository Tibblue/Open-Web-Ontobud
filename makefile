build:
	docker build -t tibblue/tese-rdf4j:latest ./rdf4j
	docker build -t tibblue/tese-frontend:latest ./frontend

upload:
	docker push tibblue/tese-rdf4j:latest
	docker push tibblue/tese-frontend:latest

runCompose:
	docker-compose up

debugRunDocker: #just a note
	docker run -it --rm -p 8080:8080 -e RDF4J_DATA=/root/.RDF4J tibblue/tese-rdf4j:latest
	docker run -it --rm -p 8000:8000 tibblue/tese-frontend:latest
