var express = require('express');
var router = express.Router();
var passport = require('passport')
var jwt = require("jsonwebtoken")
var fs = require('fs')
var auth = require("../auth/auth")


router.get('/', (req, res) => {
  // console.dir(req.query)
  console.log(">> SESSION ID: " + req.sessionID)
  // console.log(req.session)
  console.log(">> SESSION Token: " + req.session.token)
  res.send(req.sessionID)
});


router.get('/logout', (req, res, next) => {
  // req.logout()
  req.session.destroy(function () {console.log('>> RIP session')})
  // req.logOut()
  res.send('logout');
});

router.get('/login', auth.authenticated, async (req, res, next) => {
  // res.send('login');
  passport.authenticate("login", async (err, user, info) => {
    try{
      if(err || !user) {
        if (!user) {
          console.log(info.message)
          return res.redirect(req.app.locals.url+"auth")
        }
        else
          return next(err)
      }
      req.login(user, {session: false}, async (error) => {
        if(error) return next(error)
        var myuser = {_id: user._id, email: user.email}
        //Token Generation
        var privateKey = fs.readFileSync("./auth/private.key", "utf8")
        var token = jwt.sign({user: myuser}, privateKey, {expiresIn: '30m', algorithm: "RS256"})
        req.session.token = token
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