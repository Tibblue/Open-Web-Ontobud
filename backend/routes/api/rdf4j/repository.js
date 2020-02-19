var express = require('express');
var axios = require('axios');
var qs = require('querystring')
var router = express.Router();

// RDF4J endpoint
var urls = require('../../../urls');
var rdf4j = urls.rdf4j
var rdf4jServer = 'http://'+rdf4j+'/rdf4j-server/'


//// Repository Info ////
// get statement number (implicit only)
router.get('/:repo/explicit', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/size'
  axios.get(url)
    .then(response => res.jsonp(response.data))
    .catch( () => res.status(400).send());
});

// get statement number (implicit & explicit)
router.get('/:repo/total', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo
  const query = "SELECT (COUNT(?s) AS ?triples) WHERE { ?s ?p ?o }"
  const body = qs.stringify({'query': query, 'infer': true})
  const config = {headers: {"Content-Type": 'application/x-www-form-urlencoded'}}
  axios.post(url, body, config)
    .then(response => {
      res.jsonp(parseInt(response.data.results.bindings[0].triples.value))
    })
    .catch( () => res.status(400).send());
});

// get number explicit and implicit statements and expansion ratio
router.get('/:repo/triples', function (req, res) {
  var requests = [];
  requests.push(getExplicitTriplesCount(req))
  requests.push(getAllTriplesCount(req))
  Promise.all(requests).then(response => {
    const explicit = response[0]
    const total = response[1]
    const implicit = total - explicit
    const expansion = total / explicit
    res.send({explicit, implicit, expansion})
  })
});

// get repository namespaces
router.get('/:repo/namespaces', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/namespaces'
  const config = {headers: {Accept: 'application/json'}}
  // const config = {headers: {Accept: 'text/csv'}}
  axios.get(url, config)
    .then(response => res.jsonp(response.data.results.bindings))
    .catch( () => res.status(400).send());
});

// get repository contexts
router.get('/:repo/contexts', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/contexts'
  const config = {headers: {Accept: 'application/json'}}
  // const config = {headers: {Accept: 'text/csv'}}
  axios.get(url, config)
    .then(response => res.jsonp(response.data.results.bindings))
    .catch( () => res.status(400).send());
});


//// Auxiliar requests ////
// get number of triples (explicit)
function getExplicitTriplesCount(req) {
  return new Promise(resolve => {
    const repo = req.params.repo
    const url = rdf4jServer + 'repositories/' + repo + '/size'
    axios.get(url)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        resolve(false)
      })
  })
}

// get number of triples (explicit + implicit)
function getAllTriplesCount(req) {
  return new Promise(resolve => {
    const repo = req.params.repo
    const url = rdf4jServer + 'repositories/' + repo
    const query = "SELECT (COUNT(?s) AS ?triples) WHERE { ?s ?p ?o }"
    const body = qs.stringify({'query': query, 'infer': true})
    const config = {headers: {"Content-Type": 'application/x-www-form-urlencoded'}}
    axios.post(url, body, config)
      .then(response => {
        resolve(parseInt(response.data.results.bindings[0].triples.value))
      })
      .catch(err => {
        resolve(false)
      })
  })
}

module.exports = router;