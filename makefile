build:
	docker build -t tibblue/tese-rdf4j:latest ./rdf4j
	docker build -t tibblue/tese-backend:latest ./backend
	docker build -t tibblue/tese-frontend:latest ./frontend
	# docker build --build-arg VUE_APP_RDF4J_PORT=8080 -t tibblue/tese-frontend:latest ./frontend

upload:
	docker push tibblue/tese-rdf4j:latest
	docker push tibblue/tese-backend:latest
	docker push tibblue/tese-frontend:latest

# tag:
# 	docker tag tibblue/tese-rdf4j:latest tibblue/tese-rdf4j:v0.2
# 	docker tag tibblue/tese-backend:latest tibblue/tese-backend:v0.2
# 	docker tag tibblue/tese-frontend:latest tibblue/tese-frontend:v0.2

runCompose:
	docker-compose up

debugRunMongo:
	docker run -it --rm --name mongo -p 27017:27017 mongo:latest
debugRunRDF:
	docker run -it --rm --name rdf4j -p 8080:8080 tibblue/tese-rdf4j:latest
debugRunBackend:
	docker run -it --rm --name backend -p 5000:5000 tibblue/tese-backend:latest
	# docker run -it --rm --name backend -e VUE_APP_RDF4J_PORT=8080 -p 5000:5000 tibblue/tese-backend:latest
debugRunFrontend:
	docker run -it --rm --name frontend -p 8000:8000 tibblue/tese-frontend:latest
	# docker run -it --rm --name frontend -e VUE_APP_RDF4J_PORT=8080 -p 8000:8000 tibblue/tese-frontend:latest
