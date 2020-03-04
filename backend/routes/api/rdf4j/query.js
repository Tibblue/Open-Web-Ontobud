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
  const url = rdf4jServer + 'repositories/' + repo
  // const config = { params: params}
  const config = { params: params, headers: {'Accept': 'text/csv'}}
  axios.get(url, config)
    .then(response => res.status(200).send(response.data))
    .catch( () => res.status(400).send());
});

// query (POST) (params in x-www-form-urlencoded)
router.post('/:repo', function (req, res) {
  const repo = req.params.repo
  const url = rdf4jServer + 'repositories/' + repo
  const body = qs.stringify(req.body)
  const config = {
    headers: {
      // 'Accept': 'text/csv',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  axios.post(url, body, config)
    .then(response => res.status(200).send(response.data))
    .catch( () => res.status(400).send());
});

// query (POST) (params in x-www-form-urlencoded)
// query (POST) (accepts text/csv)
// router.post('/:repo', function (req, res) {
//   const repo = req.params.repo
//   const accept = req.headers['accept'] // keep original content type
//   const url = rdf4jServer + 'repositories/' + repo
//   const body = qs.stringify(req.body)
//   const config = {
//     headers: {
//       // 'Accept': accept, // isto torna o pedido sempre text/csv
//       "Content-Type": 'application/x-www-form-urlencoded',
//     }
//   }
//   axios.post(url, body, config)
//     .then(response => {
//         res.jsonp(response.data)
//     })
//     .catch(err => res.status(404).send());
// });

module.exports = router;