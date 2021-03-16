# NOTE: remove .exe if needed on your OS

exportLocal:
	mongoexport.exe --db=rdf4jFrontend -c=query -o=query.out
	mongoexport.exe --db=rdf4jFrontend -c=user -o=user.out
	# mongoexport.exe --db=rdf4jFrontend -c=repo -o=repo.out

# Change HOST and PORT if needed
exportServer:
	mongoexport.exe --uri="mongodb://epl.di.uminho.pt:8740/rdf4jFrontend" -c=query -o=query.out
	mongoexport.exe --uri="mongodb://epl.di.uminho.pt:8740/rdf4jFrontend" -c=user -o=user.out
	# mongoexport.exe --uri="mongodb://epl.di.uminho.pt:8740/rdf4jFrontend" -c=repo -o=repo.out

importLocal:
	mongoimport.exe --db=rdf4jFrontend -c=query --file=query.out
	mongoimport.exe --db=rdf4jFrontend -c=user --file=user.out
	# mongoimport.exe --db=rdf4jFrontend -c=repo --file=repo.out

# Change HOST and PORT if needed
importServer:
	mongoimport.exe --uri="mongodb://epl.di.uminho.pt:8740/rdf4jFrontend" -c=query --file=query.out
	mongoimport.exe --uri="mongodb://epl.di.uminho.pt:8740/rdf4jFrontend" -c=user --file=user.out
	# mongoimport.exe --uri="mongodb://epl.di.uminho.pt:8740/rdf4jFrontend" -c=repo --file=repo.out


