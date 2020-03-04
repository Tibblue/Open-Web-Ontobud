var express = require('express');
var bodyParser = require("body-parser")
var axios = require('axios');
var qs = require('querystring')
var router = express.Router();

// Middleware Parsers
var rawTextParser = bodyParser.raw({type: '*/*', limit: '20mb'}) //TODO check limit cap
var rawFileParser = bodyParser.raw({type: '*/*', limit: '20mb'}) //TODO check limit cap

// RDF4J endpoint
var urls = require('../../../urls');
var rdf4j = urls.rdf4j
var rdf4jServer = 'http://'+rdf4j+'/rdf4j-server/'
var rdf4jWorkbench = 'http://'+rdf4j+'/rdf4j-workbench/'


router.get('/help', function (req, res) {
  // res.send("hello")
  // res.send(urls.mongo + urls.rdf4j)
  res.send(rdf4j)
});

//// List Repos ////
// get repo list
router.get('/listRepos', function (req, res) {
  const url = rdf4jServer + 'repositories'
  const accept = 'application/json' // HARDCODE
  // const accept = 'text/csv' // HARDCODE option2
  // const accept = req.headers['accept'] // keep original accept value
  const config = {headers: {Accept: accept}}
  axios.get(url, config)
    .then(response => res.jsonp(response.data.results.bindings))
    .catch( () => res.status(400).send());
});


//// Create ////
// create repository (params inside a form in x-www-form-urlencoded)
router.post('/create', function (req, res) {
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
    .catch( () => res.status(400).send());
});


//// Delete ////
// delete repository
router.delete('/delete/:repo', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo
  axios.delete(url)
    .then( () => res.status(200).send())
    .catch( () => res.status(400).send());
});

// delete all statements from repository
router.delete('/delete/:repo/statements', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  axios.delete(url)
    .then( () => res.status(200).send())
    .catch( () => res.status(400).send());
});


//// Import ////
// import file (replace)
router.put('/importFile/:repo', rawFileParser, function (req, res) {
  const repo = req.params.repo
  const contentType = req.headers['content-type'] // keep original content type
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const body = req.body
  const config = { headers: { "Content-Type": contentType } }
  axios.put(url, body, config)
    .then( () => res.status(200).send())
    .catch( () => res.status(400).send());
});

// import file (add)
router.post('/importFile/:repo', rawFileParser, function (req, res) {
  const repo = req.params.repo
  const contentType = req.headers['content-type'] // keep original content type
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const body = req.body
  const config = { headers: { "Content-Type": contentType } }
  axios.post(url, body, config)
    .then( () => res.status(200).send())
    .catch( () => res.status(400).send());
});

// app.post('/upload/:image', bodyparser.raw({
//     limit: '10mb',
//     type: 'image/*'
// }), (req, res) => {
//     const image = req.params.image;
//     const fd = fs.createWriteStream(`[SERVER_UPLOAD_PATH]/${image}`, {
//         flags: "w+",
//         encoding: "binary"
//     });
//     fd.end(req.body);
//     fd.on('close', () => res.send({status: 'OK'});
// });


// import text (replace)
router.put('/importText/:repo', rawTextParser, function (req, res) {
  const repo = req.params.repo
  const contentType = req.headers['content-type'] // keep original content type
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const body = req.body
  const config = { headers: { "Content-Type": contentType } }
  axios.put(url, body, config)
    .then( () => res.status(200).send())
    .catch( () => res.status(400).send());
});

// import text (add)
router.post('/importText/:repo', rawTextParser, function (req, res) {
  const repo = req.params.repo
  const contentType = req.headers['content-type'] // keep original content type
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const body = req.body
  const config = { headers: { "Content-Type": contentType } }
  axios.post(url, body, config)
    .then( () => res.status(200).send())
    .catch( () => res.status(400).send());
});


//// Export ////
// export repository
router.get('/export/:repo', function (req, res) {
  const repo = req.params.repo
  const accept = req.headers['accept'] // keep original accept value
  const params = req.query
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const config = { params: params, headers: { "Accept": accept }}
  axios.get(url, config)
    .then(response => res.status(200).send(response.data))
    .catch( () => res.status(400).send());
});


module.exports = router;