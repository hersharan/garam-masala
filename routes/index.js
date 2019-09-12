var express = require('express');
var router = express.Router();
var userProfile = require('../api/userRegistration/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Login Page */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

/* GET Login Page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET Login Page */
router.post('/register', async function(req, res, next) {
  const result = await userProfile(req, res);
  console.log('results', result);
  res.render('register', result);
});

module.exports = router;
