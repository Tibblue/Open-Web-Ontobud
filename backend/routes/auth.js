var express = require('express');
var router = express.Router();
var Users = require("../controllers/user")
var bcrypt = require("bcrypt")
var passport = require('passport')

router.get('/', function (req, res) {
  // console.dir(req.query)
  console.log("SESSION ID: " + req.sessionID)
  // console.log(req.session.id)
  console.log(req.session)
  res.render('login', { title: 'Login', status: req.query.status});
});

router.post('/auth', function(req, res) {
  console.dir(req.body)
  Users.getUser(req.body.email)
    .then(user => {
      if(user==null){
        // User nao existe
        console.log("NAO HA USER")
        res.redirect(req.app.locals.url + 'login?status=missing+user')
      }
      else{
        var json = user._doc
        console.dir(json)

        var password = req.body.password
        var hash = user.password
        bcrypt.compare(password, hash, function (err, equal) {
          if (err)
            res.render('error', { error: err })
          else{
            if(equal==false) // Password errada
              res.redirect(req.app.locals.url+'login?status=wrong+password')
            else // Password correta
              res.redirect(req.app.locals.url+'login?status=success')
          }
        })
      }
    })
    .catch(error => res.render('error', { error: error }))
});



// SESSION STUFF
router.get('/logout', function (req, res, next) {
  console.log('Estou no GET Logout')
  // req.logout()
  req.session.destroy(function (err) {
    console.log('RIP session')
    // cannot access session here
  })
  // res.send('logout');
  res.redirect('/login?status=LOGOUT+success')
});

// new and modular
var isAuthenticated = () => passport.authenticate('local', {
  successRedirect: '/login/authrequired',
  successFlash: 'Utilizador autenticado com sucesso!',
  failureRedirect: '/login/login?status=not+authenticated',
  failureFlash: 'Utilizador ou password inválido(s)...'
})
function verificaAutenticacao(req, res, next){
  if(req.isAuthenticated()) next()
  else res.redirect("/login")
}
router.get('/authrequired', verificaAutenticacao, (req,res) => {
  res.send('Atingiste a area de autenticação!!!')
})


module.exports = router;