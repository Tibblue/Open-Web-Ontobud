var express = require('express');
var router = express.Router();
var passport = require('passport')
var auth = require("../auth/auth")
var Users = require("../controllers/user")


// Sign Up - Create new User
router.post('/signup', function (req, res) {
  Users.createUser(req.body)
    .then(data => res.jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

// Logs user in
router.post('/login', async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try{
      if(err) return next(err)
      if (!user) return res.status(404).send(info.message)
      req.login(user, {session: false}, async (error) => {
        if (error) return next(error)
        var userInfo = {email: user.email}
        var token = auth.genToken(userInfo)
        res.send(token)
      })
    }catch(error){
      return next(error)
    }
  })(req,res,next)
});

// Delete User Account
router.delete('/delete/:email', auth.isAuthenticated, function(req, res, next) {
  passport.authenticate("jwt", async (err, user) => {
    if (err) return next(err)
    // TODO: if admin, can delete any user
    if(req.params.email === user.email){
      Users.deleteUser(req.params.email)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
    }
    else res.status(403).send()
  })(req, res, next)
});


// debug
router.get('/user', auth.isAuthenticated, function(req, res, next) {
  passport.authenticate("jwt", async (err, user) => {
    if (err) return next(err)
    res.jsonp(user)
  })(req,res,next)
});


module.exports = router;