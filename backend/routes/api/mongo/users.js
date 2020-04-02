var express = require('express');
var router = express.Router();
var Users = require("../../../controllers/user")

router.get('/', function (req, res) {
  Users.list()
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.get('/:email', function (req, res) {
  Users.getUser(req.params.email)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = processError(error)
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
        var errorAux = processError(error)
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
        var errorAux = processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.delete('/:email', function (req, res) {
  Users.deleteUser(req.params.email)
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