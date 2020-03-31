var express = require('express');
var bodyParser = require("body-parser")
var axios = require('axios');
var qs = require('querystring')
var router = express.Router();

// Middleware Parsers
var rawTextParser = bodyParser.raw({type: '*/*', limit: '200mb'}) //TODO check limit cap
var rawFileParser = bodyParser.raw({type: '*/*', limit: '200mb'}) //TODO check limit cap

// RDF4J endpoint
var urls = require('../../../urls');
var rdf4j = urls.rdf4j
var rdf4jServer = 'http://'+rdf4j+'/rdf4j-server/'


router.get('/help', function (req, res) {
  res.send("hello")
});

//// List Repos ////
// get repo list
router.get('/listRepos', function (req, res) {
  const url = rdf4jServer + 'repositories'
  // const accept = 'text/csv' // HARDCODE rdf4j default
  // const accept = 'application/json' // HARDCODE my default
  var accept = req.headers['accept'] // use req accept value
  if (accept === "*/*") accept = 'application/json' // if no accept is given use JSON
  const config = { headers: { Accept: accept }}
  axios.get(url, config)
    .then(response => {
      try { res.jsonp(response.data.results.bindings) }
      catch { res.send(response.data) }
    })
    .catch(error => {
      try { res.status(error.response.status).send(error.response.data) }
      catch {
        try { res.status(400).send(error) }
        catch { res.status(400).send() }
      }
    });
});


//// Repo Info ////
// get repo info
router.get('/repoInfo/:repo', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/config'
  // const accept = 'text/plain' // HARDCODE rdf4j default
  // const accept = 'text/turtle' // HARDCODE option
  const accept = req.headers['accept'] // use req accept value
  const config = { headers: { Accept: accept } }
  axios.get(url, config)
    .then(response => res.send(response.data))
    .catch(error => res.status(error.response.status).send(error.response.data))
    .catch(error => res.status(400).send("unknown error :( ..."));
});


//// Create ////
// create repository
// params received inside a form in x-www-form-urlencoded
router.put('/create', function (req, res) {
  const reqBody = req.body
  const repoID = reqBody["Repository ID"] || "nonamerepo"
  const repoTitle = reqBody["Repository Title"] || "nonamerepo"
  var type = "NativeStore" // default value
  var repInference = "" // default disabled
  const persist = reqBody["Persist"] || "true" // hardcode
  // const syncDelay = reqBody["Sync Delay"] // FIXME: consider enable
  var middleNodes = 0 // aux value

  // repo type detection
  switch (reqBody["type"]) {
    case "memory":
    case "memory-rdfs-dt":
      type = "MemoryStore"
      break;
    case "native":
    case "native-rdfs-dt":
      type = "NativeStore"
      break;
    default:
      break;
  }

  // inference type detection
  switch (reqBody["type"]) {
    case "memory":
    case "native":
      // do nothing. use default "NativeStore"
      break;
    case "memory-rdfs-dt":
    case "native-rdfs-dt":
      middleNodes += 2
      repInference = `
_:node2 sail:delegate _:node3.
_:node3 sail:delegate _:node4.

_:node3 sail:sailType "rdf4j:SchemaCachingRDFSInferencer".
_:node2 sail:sailType "openrdf:DirectTypeHierarchyInferencer".
`
      break;
    default:
      break;
  }

  var prefix = `@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix rep: <http://www.openrdf.org/config/repository#>.
@prefix sr: <http://www.openrdf.org/config/repository/sail#>.
@prefix sail: <http://www.openrdf.org/config/sail#>.
@prefix sb: <http://www.openrdf.org/config/sail/base#>.
@prefix ms: <http://www.openrdf.org/config/sail/memory#>.
`
  var repConfig = `
<http://localhost:8080/rdf4j-server/repositories/`+ repoID + `/config#` + repoID + `> a rep:Repository;
  rep:repositoryID "`+ repoID + `";
  rdfs:label "`+ repoTitle + `";
  rep:repositoryImpl _:node1.

_:node1 rep:repositoryType "openrdf:SailRepository";
  sr:sailImpl _:node2.

_:node`+ (2 + middleNodes) + ` sail:sailType "openrdf:` + type + `";
  sb:evaluationStrategyFactory "org.eclipse.rdf4j.query.algebra.evaluation.impl.StrictEvaluationStrategyFactory";
  ms:persist `+ persist + `.
`
  // FIXME: aparentemente repositorios COM inferencia, nao guardam o valor de persistencia. simplesmente desaparece
  const url = rdf4jServer + 'repositories/' + repoID
  const body = prefix + repConfig + repInference
  // console.log(body)
  const config = { headers: { "Content-Type": 'text/turtle' } }
  axios.put(url, body, config)
    .then(response => res.send())
    .catch(error => {
      // console.log(error.response.data)
      res.status(error.response.status).send(error.response.data)
    });
});

//// Update/Change ////
// update/change repository configuration
// params received inside a form in x-www-form-urlencoded
router.post('/update', function (req, res) {
  // TODO
  res.send("TODO")
});


//// Delete ////
// delete repository
router.delete('/delete/:repo', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo
  axios.delete(url)
    .then(response => res.status(200).send())
    .catch(error => res.status(error.response.status).send(error.response.data));
});

// delete all statements from repository
router.delete('/delete/:repo/statements', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo + '/statements'
  axios.delete(url)
    .then(response => res.status(200).send())
    .catch(error => res.status(error.response.status).send(error.response.data));
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