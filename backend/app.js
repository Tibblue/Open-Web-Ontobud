var express = require('express');
var path = require('path');
var logger = require('morgan');
var createError = require('http-errors');
var bodyParser = require("body-parser")

var cookieParser = require('cookie-parser');

var flash = require('connect-flash')


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


// Body parser stuff
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(flash()) // FLASH
app.use(logger('dev'));
app.use(cookieParser()); // COOKIE PARSER
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));



// Headers alterados para permitir PUTs e DELETEs sem problemas
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true)
  next();
});

//// Routing
// Mongo
app.use('/api/users', require('./routes/api/mongo/users'));
app.use('/api/repos', require('./routes/api/mongo/repos'));
app.use('/api/queries', require('./routes/api/mongo/queries'));
// RDF4J
app.use('/api/rdf4j/management', require('./routes/api/rdf4j/management'));
app.use('/api/rdf4j/repository', require('./routes/api/rdf4j/repository'));
app.use('/api/rdf4j/query', require('./routes/api/rdf4j/query'));



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
