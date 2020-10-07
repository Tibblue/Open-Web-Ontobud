build:
	docker build -t tibblue/tese-frontend:dev ./frontend
	docker build -t tibblue/tese-backend:dev ./backend
	# docker build -t tibblue/tese-rdf4j:dev ./rdf4j
	# docker build --build-arg VUE_APP_RDF4J_PORT=8080 -t tibblue/tese-frontend:dev ./frontend

# make tagpush v=[version]
tagpush:
	docker tag tibblue/tese-frontend:dev tibblue/tese-frontend:$(v)
	docker tag tibblue/tese-backend:dev tibblue/tese-backend:$(v)
	# docker tag tibblue/tese-rdf4j:dev tibblue/tese-rdf4j:$(v)
	docker push tibblue/tese-frontend:$(v)
	docker push tibblue/tese-backend:$(v)
	# docker push tibblue/tese-rdf4j:$(v)



runCompose:
	docker-compose up

restart:
	docker container stop ontoworks_frontend_1 ontoworks_backend_1 ontoworks_rdf4j_1 ontoworks_mongo_1
	docker-compose up -d

stop:
	docker container stop ontoworks_frontend_1 ontoworks_backend_1 ontoworks_rdf4j_1 ontoworks_mongo_1
start:
	docker-compose up -d

pull:
	docker pull tibblue/tese-frontend:latest
	docker pull tibblue/tese-backend:latest
	#docker pull tibblue/tese-rdf4j:latest



debugRunMongo:
	docker run -it --rm --name mongo -p 27017:27017 mongo:latest
debugRunRDF:
	docker run -it --rm --name rdf4j -p 8080:8080 tibblue/tese-rdf4j:dev
debugRunBackend:
	docker run -it --rm --name backend -p 5000:5000 tibblue/tese-backend:dev
	# docker run -it --rm --name backend -e VUE_APP_RDF4J_PORT=8080 -p 5000:5000 tibblue/tese-backend:dev
debugRunFrontend:
	docker run -it --rm --name frontend -p 8000:8000 tibblue/tese-frontend:dev
	# docker run -it --rm --name frontend -e VUE_APP_RDF4J_PORT=8080 -p 8000:8000 tibblue/tese-frontend:dev
