var express = require('express');
var router = express.Router();
var passport = require('passport')
var jwt = require("jsonwebtoken")
var fs = require('fs')
var auth = require("../auth/auth")


router.get('/', auth.isAuthenticated, (req, res) => {
  // console.dir(req.query)
  console.log(">> SESSION ID: " + req.sessionID)
  // console.log(req.session)
  console.log(">> SESSION Token: " + req.session.token)
  res.send(req.session.token)
});


router.get('/logout', auth.isAuthenticated, (req, res, next) => {
  // req.logout() // didnt work
  req.session.destroy( (error) => {
    if(!error)
      res.send('success');
    else
      res.status(400).send('fail')
  })
});

router.get('/login', auth.authenticated, async (req, res, next) => {
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
        var myuser = {_id: user._id, email: user.email}
        // Token Generation
        var privateKey = fs.readFileSync("./auth/private.key", "utf8")
        var token = jwt.sign({user: myuser}, privateKey, {expiresIn: '30m', algorithm: "RS256"})
        req.session.token = token
        req.session.email = user.email
        res.redirect(req.app.locals.url + "auth")
      })
    }catch(error){
      return next(error)
    }
  })(req,res,next)
});

router.get('/authrequired', auth.isAuthenticated, (req, res) => {
  res.send('Atingiste area autenticada!!!')
})


module.exports = router;