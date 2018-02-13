var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//File store takes a session as a parameter
var FileStore = require('session-file-store')(session);


//routes and endpoints
var index = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');
// Connection URL
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, {
    /* other options */
  });

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//supplying a signed cookie for encrypting information
//app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

//before authentication we want users to be able to login 
//so we put these 2 lines before adding auth middleware
app.use('/', index);
app.use('/users', users);

function auth(req, res, next){
  console.log(req.session);
  //changed from checking cookie to checking sessoion
  if(!req.session.user) {
    
      var err = new Error('You are not authenticated!');
      //settting header in response
      err.status = 403;
      return next(err);
    }
    
  //now we are checking session not cookie
  else {
    if (req.session.user === "authenticated") {
      next();
    }
    //will normally not happen but for the sake of completeness 
    //we are adding this error check
    else {
      var err = new Error("You are not authenticated!");
      err.status = 403;
      next(err);
    }
  }
} 

//authorization middleware
app.use(auth);
//!!IMPORTANT
//everything after this will have to go through authorization 
//in order for client to use

//enables us to serve public data from the static server
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
//global handler for errors
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
