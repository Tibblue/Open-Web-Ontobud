var createError = require('http-errors');
var express = require('express');
var bodyParser = require("body-parser")
var path = require('path');
var logger = require('morgan');
var flash = require('connect-flash')

// auth session stuff
var uuid = require("uuid/v4")
var passport = require('passport')
var session = require("express-session")
var FileStore = require("session-file-store")(session)

require('./auth/auth')
var auth = require('./auth/auth')


var app = express();
// Variaveis
app.address = '127.0.0.1'
app.port = 5000
app.locals.url = "http://"+app.address+":"+app.port+"/"

// const dbOnline = 'mongodb+srv://Kiko:Kiko@pri-1819-kiko-rsuyj.mongodb.net/test?retryWrites=true'
const dbLocal = 'mongodb://127.0.0.1:27017/rdf4jFrontend'
// Base de dados
var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.connect(dbLocal, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=> console.log('Mongo running... status: ' + mongoose.connection.readyState))
  .catch(()=> console.log('Mongo: erro na conexao!!!'))


// configure session
app.use(session({
  genid: req => {
    console.log('Gerando nova sessão !!!')
    // console.log(req.sessionID)
    return uuid()
  },
  store: new FileStore(),
  secret: 'batataazul',
  resave: false,
  saveUninitialized: true,
  cookie:{maxAge: 2*60*1000}, // miliseconds
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())


// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//// Middleware
app.use(flash()) // FLASH
app.use(logger('dev'));
// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))



// Headers alterados para permitir PUTs e DELETEs sem problemas
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true)
  next();
});

//// Routing
// Public (maybe remove?)
app.use(express.static(path.join(__dirname, 'public')));
// Mongo
app.use('/api/users', require('./routes/api/mongo/users'));
app.use('/api/repos', require('./routes/api/mongo/repos'));
app.use('/api/queries', require('./routes/api/mongo/queries'));
// RDF4J
app.use('/api/rdf4j/management', require('./routes/api/rdf4j/management'));
app.use('/api/rdf4j/repository', require('./routes/api/rdf4j/repository'));
app.use('/api/rdf4j/query', require('./routes/api/rdf4j/query'));
// Auth
app.use('/auth', require('./routes/auth'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
