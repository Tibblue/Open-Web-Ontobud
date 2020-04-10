var express = require('express');
var router = express.Router();
var Feedbacks = require("../../../controllers/feedback")

// Aux File
var aux = require("./mongo_help")

router.get('/', function (req, res) {
  Feedbacks.list()
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});

router.post('/', function (req, res) {
  // console.log(">> API/USERS inserting feedback: " + JSON.stringify(req.body))
  Feedbacks.create(req.body)
    .then(data => res.jsonp(data))
    .catch(error => {
      try {
        var errorAux = aux.processError(error)
        res.status(errorAux.status).send(errorAux.data) }
      catch { res.status(500).send("MONGO unknown error :(") }
    });
});


module.exports = router;