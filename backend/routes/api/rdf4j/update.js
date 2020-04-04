var express = require('express');
var axios = require('axios');
var qs = require('querystring')
var router = express.Router();

// Aux File
var aux = require("./help")
// RDF4J endpoint
var urls = require('../../../urls');
var rdf4j = urls.rdf4j
var rdf4jServer = 'http://'+rdf4j+'/rdf4j-server/'


// SPARQL 1.1 Update (params in x-www-form-urlencoded)
// Accepts Insert and Delete
router.post('/:repo', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const body = aux.convertUTF8toJAVA(decodeURIComponent(qs.stringify(req.body)))
  const config = {
    headers: {
      "Content-Type": 'application/x-www-form-urlencoded',
    }
  }
  axios.post(url, body, config)
    .then(response => res.send(response.data))
    .catch(error => {
      try { res.status(error.response.status).send(error.response.data) }
      catch {
        try { res.status(400).send(error) }
        catch { res.status(500).send("unknown error :(") }
      }
    });
});


module.exports = router;