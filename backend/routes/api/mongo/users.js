var express = require('express');
var router = express.Router();
var Users = require("../../../controllers/user")

// Aux File
var aux = require("./mongo_help")

router.get('/', function (req, res) {
  Users.list()
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.get('/:email', function (req, res) {
  Users.getUser(req.params.email)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.post('/', function (req, res) {
  // console.log(">> API/USERS inserting user: " + JSON.stringify(req.body))
  Users.createUser(req.body)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.put('/:email/password', function (req, res) {
  // console.log(">> API/USERS altering password: " + JSON.stringify(req.body))
  Users.updateUserPassword(req.params.email, req.body)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.delete('/:email', function (req, res) {
  Users.deleteUser(req.params.email)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
})


module.exports = router;