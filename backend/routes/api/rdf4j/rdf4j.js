var express = require('express');
var bodyParser = require("body-parser")
var axios = require('axios');
var qs = require('querystring')
var router = express.Router();

// Middleware Parsers
var rawParser = bodyParser.raw({type: '*/*'}) //TODO change limit cap


// RDF4J endpoint
var rdf4jServer = 'http://localhost:8080/rdf4j-server/'
var rdf4jWorkbench = 'http://localhost:8080/rdf4j-workbench/'


//// Management ////
// create repository (params inside a form in x-www-form-urlencoded)
router.post('/management/create', function (req, res) {
  const url = rdf4jWorkbench + 'repositories/NONE/create'
  const body = qs.stringify(req.body)
  const config = {
    headers: {
      "Accept": "application/json",
      "Content-Type": 'application/x-www-form-urlencoded'
    }
  }
  axios.post(url, body, config)
    .then(response => res.jsonp(response.data.results.bindings))
    .catch(err => console.log('ERRO: ' + err));
});

// delete repository
router.delete('/management/delete/:repo', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo
  axios.delete(url)
    .then( () => res.status(200).send())
    .catch( () => res.status(404).send());
});

// delete all statements from repository
router.delete('/management/delete/:repo/statements', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  axios.delete(url)
    .then( () => res.status(200).send())
    .catch( () => res.status(404).send());
});

// import file (replace)
router.put('/management/importFile/:repo', rawParser, function (req, res) {
  const repo = req.params.repo
  const contentType = req.headers['content-type'] // keep original content type
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const body = req.body
  const config = { headers: { "Content-Type": contentType } }
  axios.put(url, body, config)
    .then( () => res.status(200).send())
    .catch( () => res.status(404).send("error"));
});

// import file (add)
router.post('/management/importFile/:repo', rawParser, function (req, res) {
  const repo = req.params.repo
  const contentType = req.headers['content-type'] // keep original content type
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const body = req.body
  const config = { headers: { "Content-Type": contentType } }
  axios.post(url, body, config)
    .then( () => res.status(200).send())
    .catch( () => res.status(404).send("error"));
});

// import text (replace)
router.put('/management/importText/:repo', rawParser, function (req, res) {
  const repo = req.params.repo
  const contentType = req.headers['content-type'] // keep original content type
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const body = req.body
  const config = { headers: { "Content-Type": contentType } }
  axios.put(url, body, config)
    .then( () => res.status(200).send())
    .catch( () => res.status(404).send("error"));
});

// import text (add)
router.post('/management/importText/:repo', rawParser, function (req, res) {
  const repo = req.params.repo
  const contentType = req.headers['content-type'] // keep original content type
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const body = req.body
  const config = { headers: { "Content-Type": contentType } }
  axios.post(url, body, config)
    .then( () => res.status(200).send())
    .catch( () => res.status(404).send("error"));
});





//// Get Info ////
// get repo list
router.get('/repositories', function (req, res) {
  const url = rdf4jServer + 'repositories'
  const config = {headers: {Accept: 'application/json'}}
  // const config = {headers: {Accept: 'text/csv'}}
  axios.get(url, config)
    .then(response => res.jsonp(response.data.results.bindings))
    .catch(err => console.log('ERRO: ' + err));
});

// get statement number (implicit only)
router.get('/repositories/:repo/size', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/size'
  axios.get(url)
    .then(response => res.jsonp(response.data))
    .catch(err => console.log('ERRO: ' + err));
});

// get statement number (implicit & explicit)
router.get('/repositories/:repo/infer', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo
  const query = "SELECT (COUNT(?s) AS ?triples) WHERE { ?s ?p ?o }"
  const body = qs.stringify({'query': query, 'infer': true})
  const config = {headers: {"Content-Type": 'application/x-www-form-urlencoded'}}
  axios.post(url, body, config)
    .then(response => {
      res.jsonp(parseInt(response.data.results.bindings[0].triples.value))
    })
    .catch(err => console.log('ERRO: ' + err));
});

// get repository namespaces
router.get('/repositories/:repo/namespaces', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/namespaces'
  const config = {headers: {Accept: 'application/json'}}
  // const config = {headers: {Accept: 'text/csv'}}
  axios.get(url, config)
    .then(response => res.jsonp(response.data.results.bindings))
    .catch(err => console.log('ERRO: ' + err));
});

// get repository contexts
router.get('/repositories/:repo/contexts', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/contexts'
  const config = {headers: {Accept: 'application/json'}}
  // const config = {headers: {Accept: 'text/csv'}}
  axios.get(url, config)
    .then(response => res.jsonp(response.data.results.bindings))
    .catch(err => console.log('ERRO: ' + err));
});


//// Queries ////



module.exports = router;