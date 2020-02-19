// Default values
var mongo = '127.0.0.1:27017' // FIXME? usar env port
var rdf4j = 'localhost:8080' // FIXME? usar env port

// Docker default value
// var mongo = 'mongo:27017' // Docker
// var rdf4j = 'rdf4j:8080' // Docker

module.exports.mongo = mongo
module.exports.rdf4j = rdf4j
