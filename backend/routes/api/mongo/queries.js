var express = require('express');
var router = express.Router();
var Queries = require("../../../controllers/query")

router.get('/', function (req, res) {
  Queries.list()
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.get('/user/:email', function (req, res) {
  Queries.listByUserEmail(req.params.email)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.get('/user/:email/global', function (req, res) {
  Queries.listByUserEmailGlobal(req.params.email)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.get('/user/:email/:repo', function (req, res) {
  Queries.listByUserEmailRepo(req.params.email, req.params.repo)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.get('/:name', function (req, res) {
  Queries.getQuery(req.params.name)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.post('/', function (req, res) {
  // console.dir(req.body)
  // console.log(">log-router API/QUERIES inserting into database: " + JSON.stringify(req.body))
  Queries.createQuery(req.body)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.put('/:user/:name', function (req, res) {
  // console.dir(req.body)
  // console.log(">log-router API/USERS altering query: " + JSON.stringify(req.body))
  Queries.updateQueryValue(req.params.user, req.params.name, req.body)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.delete('/:user/:name', function (req, res) {
  Queries.deleteQuery(req.params.user, req.params.name)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
})

//// Auxiliar function ////
// process errors and return a more standard error response
function processError(error) {
  var status = 500
  var data = error // "MONGO unknown error :("
  // Duplicate Keys (Duplicate Query name and UserID)
  if (error.name === 'MongoError' && error.code === 11000) {
    status = 409
    data = error.errmsg // FIXME: prepare a more readable response
  }
  // Bad Request (missing required variable, bad syntax, etc)
  else if (error.name === 'ValidationError') {
    status = 400
    data = error.message
  }
  return {status: status, data: data}
}

module.exports = router;