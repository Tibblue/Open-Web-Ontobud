var express = require('express');
var router = express.Router();
var Queries = require("../../../controllers/query")

// Aux File
var aux = require("./mongo_help")

router.get('/', function (req, res) {
  Queries.list()
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.get('/user/:email', function (req, res) {
  Queries.listByUserEmail(req.params.email)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.get('/user/:email/global', function (req, res) {
  Queries.listByUserEmailGlobal(req.params.email)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.get('/user/:email/:repo', function (req, res) {
  Queries.listByUserEmailRepo(req.params.email, req.params.repo)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.get('/:name', function (req, res) {
  Queries.getQuery(req.params.name)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
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
        var errorAux = aux.processError(error)
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
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.delete('/:user/:name', function (req, res) {
  Queries.deleteQuery(req.params.user, req.params.name)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
})


module.exports = router;