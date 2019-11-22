var express = require('express');
var router = express.Router();
var Users = require("../../../controllers/user")
var bcrypt = require("bcrypt")
const saltRounds = 10

router.get('/', function (req, res) {
  Users.list()
    .then(data => res.jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

router.get('/:email', function (req, res) {
  Users.getUser(req.params.email)
    .then(data => res.jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

router.post('/', function (req, res) {
  console.log(">> API/USERS inserting user: " + JSON.stringify(req.body))
  Users.createUser(req.body)
    .then(data => res.jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

router.put('/:email/password', function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) res.send('RIP bcrypt')
        else {
            console.log(">> API/USERS altering password: " + JSON.stringify(req.body))
            req.body.password = hash
            Users.updateUserPassword(req.params.email, req.body)
                .then(data => res.jsonp(data))
                .catch(error => res.status(500).jsonp(error))
        }
    })
});

router.delete('/:email', function (req, res) {
  Users.deleteUser(req.params.email)
    .then(data => res.jsonp(data))
    .catch(error => res.status(500).jsonp(error))
})

module.exports = router;