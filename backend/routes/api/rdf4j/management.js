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


//// List Repos ////
// get repo list
router.get('/listRepos', function (req, res) {
  const url = rdf4jServer + 'repositories'
  const config = {headers: {Accept: 'application/json'}}
  // const config = {headers: {Accept: 'text/csv'}} // other accept option
  axios.get(url, config)
    .then(response => res.jsonp(response.data.results.bindings))
    .catch(err => console.log('ERRO: ' + err));
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
    .catch(err => console.log('ERRO: ' + err));
});


//// Delete ////
// delete repository
router.delete('/delete/:repo', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo
  axios.delete(url)
    .then( () => res.status(200).send())
    .catch( () => res.status(404).send());
});

// delete all statements from repository
router.delete('/delete/:repo/statements', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  axios.delete(url)
    .then( () => res.status(200).send())
    .catch( () => res.status(404).send());
});


//// Import ////
// import file (replace)
router.put('/importFile/:repo', rawParser, function (req, res) {
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
router.post('/importFile/:repo', rawParser, function (req, res) {
  const repo = req.params.repo
  const contentType = req.headers['content-type'] // keep original content type
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const body = req.body
  const config = { headers: { "Content-Type": contentType } }
  axios.post(url, body, config)
    .then( () => res.status(200).send())
    .catch( () => res.status(404).send("error"));
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
router.put('/importText/:repo', rawParser, function (req, res) {
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
router.post('/importText/:repo', rawParser, function (req, res) {
  const repo = req.params.repo
  const contentType = req.headers['content-type'] // keep original content type
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  const body = req.body
  const config = { headers: { "Content-Type": contentType } }
  axios.post(url, body, config)
    .then( () => res.status(200).send())
    .catch( () => res.status(404).send("error"));
});


//// Export ////
// export repository
router.get('/export/:repo', function (req, res) {
  const repo = req.params.repo
  const accept = req.headers['accept'] // keep original content type
  const params = req.query
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  axios.get(url, { params: params, headers: { "Accept": accept } } )
    .then(response => {res.status(200).send(response.data)})
    .catch(() => res.status(404).send());
});


module.exports = router;