var express = require('express');
var router = express.Router();
var passport = require('passport')
var jwt = require("jsonwebtoken")
var fs = require('fs')
var auth = require("../auth/auth")

const tokenOptions = {
  expiresIn: '10m',
  algorithm: "RS256"
}



// Logs user in
router.post('/login', auth.authenticated, async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try{
      if(err || !user) {
        if (!user)
          return res.status(404).send(info.message)
        else
          return next(err)
      }
      req.login(user, {session: false}, async (error) => {
        if(error) return next(error)
        var tokenUser = {email: user.email}
        var privateKey = fs.readFileSync("./auth/private.key", "utf8")
        // Token Generation
        var token = jwt.sign({user: tokenUser}, privateKey, tokenOptions)
        req.session.token = token
        req.session.email = user.email
        res.send("success " + token)
        // res.redirect(req.app.locals.url + "auth/authrequired")
      })
    }catch(error){
      return next(error)
    }
  })(req,res,next)
});

// Logs user out
router.post('/logout', auth.isAuthenticated, (req, res, next) => {
  // req.logout() // didnt work
  req.session.destroy( (error) => {
    if(!error)
      res.send('success');
    else
      res.status(400).send('fail')
  })
});


// debug
router.get('/token', auth.isAuthenticated, (req, res) => {
  // console.dir(req.query)
  console.log(">> SESSION ID: " + req.sessionID)
  // console.log(req.session)
  console.log(">> SESSION Token: " + req.session.token)
  res.send(req.session.token)
});

// debug
router.get('/user', auth.isAuthenticated, (req, res) => {
  // console.log(req.session)
  console.log(">> SESSION Token: " + req.session.token)
  var publicKey = fs.readFileSync("./auth/public.key", "utf8")
  var legit = jwt.verify(req.session.token, publicKey, tokenOptions)
  res.send(legit)
});

// debug
router.get('/authrequired', auth.isAuthenticated, (req, res) => {
  res.send('Atingiste area autenticada!!!')
})


module.exports = router;