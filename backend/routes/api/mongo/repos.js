var express = require('express');
var router = express.Router();
var Repos = require("../../../controllers/repo")

// Aux File
var aux = require("./mongo_help")

router.get('/', function (req, res) {
  Repos.list()
    .then(data => res.jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

router.get('/:id', function (req, res) {
  Repos.getRepo(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

router.post('/', function (req, res) {
  // console.dir(req.body)
  console.log(">log-router API/REPOS inserting into database: " + JSON.stringify(req.body))
  Repos.createRepo(req.body)
    .then(data => res.jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

// router.put('/:id/name', function (req, res) {
//   // console.dir(req.body)
//   console.log(">log-router API/USERS altering name: " + JSON.stringify(req.body))
//   Repos.updateRepoName(req.params.id, req.body)
//     .then(data => res.jsonp(data))
//     .catch(error => res.status(500).jsonp(error))
// });

router.delete('/:id', function (req, res) {
  Repos.deleteRepo(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.status(500).jsonp(error))
})

module.exports = router;