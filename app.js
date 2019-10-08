var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var cors = require('cors');
var expressWinston = require('express-winston');
var winston = require('winston');
var dbConnection = require('./config/database');
var apiRouter = require('./routes/api');

dbConnection.connection();

var app = express();
app.use(helmet());
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// Validates required headers
app.use(function(req, res, next) {
  if (req.url.indexOf("/api/v1/") !== -1) {
    if (req.headers['content-type'] !== 'application/json') {
      res.status(406).send('Request does not contain Content-Type header');
    }
    if (req.headers['authorization'] !== undefined && req.headers['authorization'].match(/^Bearer\s\S+$/g) === null) {
      res.status(403).send('Token is invalid');
    }
    else {
      next();
    }
  }
});

// Error Handler for Body Empty Check
app.use(function(req, res, next) {
  if ((req.method === 'POST') &&
    (req.body instanceof Object && Object.keys(req.body).length === 0) || req.body instanceof Array && req.body.length === 0) {
    res.status(400).send({
      "status": 400,
      "msg": "Body should not be empty"
    });
  }
  else {
    next();
  }
});


// APIs
app.use('/api/v1/', apiRouter);

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

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
