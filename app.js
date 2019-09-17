var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();
app.use(helmet())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// Validates required headers
app.use(function(req, res, next) {
  if (req.url.indexOf("/api/v1/") !== -1) {
    if (req.headers['content-type'] !== 'application/json') {
      res.status(400).send('Request does not contain Content-Type header');
    }
  }

  next();
});

// Error Handler for Body Empty Check
app.use(function(req, res, next) {
  if ((req.method === 'POST' || req.method === 'DELETE') &&
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
