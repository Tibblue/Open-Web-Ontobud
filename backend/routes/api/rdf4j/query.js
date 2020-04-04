var express = require('express');
var axios = require('axios');
var qs = require('querystring')
var router = express.Router();

// RDF4J endpoint
var urls = require('../../../urls');
var rdf4j = urls.rdf4j
var rdf4jServer = 'http://'+rdf4j+'/rdf4j-server/'


//// Any Query ////
//// Accept anything, returns something
// SPARQL 1.1 Query (GET) (params in queryParams)
// Caution advised when choosing "Accept" value as it changes depending on Query type
router.get('/:repo', function (req, res) {
  const repo = req.params.repo
  const params = req.query
  const accept = req.headers['accept']
  const url = rdf4jServer + 'repositories/' + repo
  const config = {
    params: params,
    headers: {
      'Accept': accept,
    }
  }
  axios.get(url, config)
    .then(response => res.send(response.data))
    .catch(error => {
      try { res.status(error.response.status).send(error.response.data) }
      catch {
        try { res.status(400).send(error) }
        catch { res.status(500).send("unknown error :(") }
      }
    });
});

// SPARQL 1.1 Query (POST) (params in x-www-form-urlencoded)
// Caution advised when choosing a "Accept" and "Content-Type" as they change depending on Query type
router.post('/:repo', function (req, res) {
  const repo = req.params.repo
  const accept = req.headers['accept']
  const url = rdf4jServer + 'repositories/' + repo
  const body = convertUTF8toJAVA(decodeURIComponent(qs.stringify(req.body)))
  const config = {
    headers: {
      'Accept': accept,
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



//// Specific Query ////
//// Expects a certain type of Query type
// Select (Table Result)
router.get('/select/:repo', function (req, res) {
  const repo = req.params.repo
  const params = req.query
  // const accept = "text/csv" // HARDCODE text/csv (rdf4j default)
  var accept = req.headers['accept'] // use req accept value
  // if (accept === "*/*") accept = 'application/json' // if no accept is given use JSON
  const url = rdf4jServer + 'repositories/' + repo
  const config = {
    params: params,
    headers: {
      'Accept': accept,
    }
  }
  axios.get(url, config)
    .then(response => res.send(response.data))
    .catch(error => {
      try { res.status(error.response.status).send(error.response.data) }
      catch {
        try { res.status(400).send(error) }
        catch { res.status(500).send("unknown error :(") }
      }
    });
});
// Construct (RDF/Triples Result)
router.get('/construct/:repo', function (req, res) {
  const repo = req.params.repo
  const params = req.query
  // const accept = "text/plain" // HARDCODE text/plain (rdf4j default)
  var accept = req.headers['accept'] // use req accept value
  // if (accept === "*/*") accept = 'application/rdf+json' // if no accept is given use JSON
  const url = rdf4jServer + 'repositories/' + repo
  const config = {
    params: params,
    headers: {
      'Accept': accept,
    }
  }
  axios.get(url, config)
    .then(response => res.send(response.data))
    .catch(error => {
      try { res.status(error.response.status).send(error.response.data) }
      catch {
        try { res.status(400).send(error) }
        catch { res.status(500).send("unknown error :(") }
      }
    });
});
// Ask (Boolean Result)
router.get('/ask/:repo', function (req, res) {
  const repo = req.params.repo
  const params = req.query
  // const accept = "application/sparql-results+json" // HARDCODE application/sparql-results+json (rdf4j default)
  var accept = req.headers['accept'] // use req accept value
  // if (accept === "*/*") accept = 'text/boolean' // if no accept is given use text/boolean
  const url = rdf4jServer + 'repositories/' + repo
  const config = {
    params: params,
    headers: {
      'Accept': accept,
    }
  }
  axios.get(url, config)
    .then(response => res.send(response.data))
    .catch(error => {
      try { res.status(error.response.status).send(error.response.data) }
      catch {
        try { res.status(400).send(error) }
        catch { res.status(500).send("unknown error :(") }
      }
    });
});


//// Accept types ////
//// Table (SELECT)
// Accept:application/sparql-results+xml
// Accept:application/sparql-results+json
// Accept:application/x-binary-rdf-results-table
// Accept:application/json
// Accept:application/xml
// Accept:text/csv
//// RDF/Triples (CONSTRUCT)
// Accept:application/rdf+json
// Accept:application/ld+json
// Accept:text/plain
// Accept:text/turtle
// Accept:application/rdf+xml
// Accept:text/rdf+n3
// Accept:text/x-nquads
// Accept:application/trix
// Accept:application/x-trig
// Accept:application/x-binary-rdf
//// Boolean (ASK)
// Accept:text/boolean
// Accept:application/sparql-results+xml
// Accept:application/sparql-results+json

function strlenFix(str) {
  while (str.length < 4) str = "0" + str;
  return str;
}
function convertUTF8toJAVA(input) {
  var result = '';
  /* UTF-8 to entities */
  for (i = 0; i < input.length; i++) {
    charCode = input.charCodeAt(i);
    if (charCode <= 127)
      result += input.charAt(i);
    else
      result += '\\u' + strlenFix(charCode.toString(16).toUpperCase());
  }
  return result
}

function convertJAVAtoUTF8(input) {
  var result = '';

  var state = 0;
  var chars = 0;
  var value = "";
  /* entities to UTF-8 */
  for (i = 0; i < input.length; i++) {
    switch (state) {
      case 0:
        if (input.charAt(i) == '\\')
          state = 1;
        else
          result += input.charAt(i);
        break;
      case 1:
        if (input.charAt(i) == 'u') {
          state = 2;
          chars = 0;
          value = "";
        } else {
          result += '\\' + input.charAt(i);
          state = 0;
        }
        break;
      case 2:
        chars++;
        value += input.charAt(i);
        if (chars >= 4) {
          result += unescape("%u" + value);
          state = 0;
        }
        break;
    }
  }
  return result
}



module.exports = router;