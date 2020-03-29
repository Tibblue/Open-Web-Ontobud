var express = require('express');
var axios = require('axios');
var qs = require('querystring')
var router = express.Router();

// RDF4J endpoint
var urls = require('../../../urls');
var rdf4j = urls.rdf4j
var rdf4jServer = 'http://'+rdf4j+'/rdf4j-server/'


//// Queries ////
// query (GET) (params in queryParams)
router.get('/:repo', function (req, res) {
  const repo = req.params.repo
  const params = req.query
  // const accept = "text/csv" // HARDCODE text/csv (rdf4j default)
  // const accept = "application/json" // HARDCODE application/json
  var accept = req.headers['accept'] // use req accept value
  if (accept === "*/*") accept = 'application/json' // if no accept is given use JSON
  const url = rdf4jServer + 'repositories/' + repo
  const config = {
    params: params,
    headers: {
      'Accept': accept,
    }
  }
  axios.get(url, config)
    .then(response => {
      if (accept === "application/json")
        res.jsonp(response.data)
      else
        res.send(response.data)
    })
    .catch(error => res.status(error.response.status).send(error.response.data))
    .catch(error => res.status(400).send("unknown error :( ..."));
});


// query (POST) (params in x-www-form-urlencoded)
// query (POST) (accepts text/csv)
router.post('/:repo', function (req, res) {
  const repo = req.params.repo
  // const accept = "text/csv" // HARDCODE text/csv (rdf4j default)
  // const accept = "application/json" // HARDCODE application/json
  var accept = req.headers['accept'] // use req accept value
  if (accept === "*/*") accept = 'application/json' // if no accept is given use JSON
  const url = rdf4jServer + 'repositories/' + repo
  const body = qs.stringify(req.body)
  const config = {
    headers: {
      'Accept': accept,
      "Content-Type": 'application/x-www-form-urlencoded',
    }
  }
  axios.post(url, body, config)
    .then(response => {
      if(accept==="application/json")
        res.jsonp(response.data)
      else
        res.send(response.data)
    })
    .catch(error => res.status(error.response.status).send(error.response.data))
    .catch(error => res.status(400).send("unknown error :( ..."));
});

module.exports = router;