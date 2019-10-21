var express = require('express');
var router = express.Router();
var Users = require("../../controllers/user")
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
    // console.dir(req.body)
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err)
            res.send('RIP bcrypt')
        else {
            console.log(">log-router API/USERS inserting into database: " + JSON.stringify(req.body))
            req.body.password = hash
            // console.dir(req.body) // DEBUG
            Users.createUser(req.body)
                .then(data => res.jsonp(data))
                .catch(error => res.status(500).jsonp(error))
        }
    })
});

router.put('/:email/password', function (req, res) {
    // console.dir(req.body)
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err)
            res.send('RIP bcrypt')
        else {
            console.log(">log-router API/USERS altering password: " + JSON.stringify(req.body))
            req.body.password = hash
            // console.dir(req.body) // DEBUG
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