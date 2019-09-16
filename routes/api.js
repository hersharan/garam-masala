var express = require('express');
var router = express.Router();
var userProfile = require('../api/userRegistration');
var userLogin = require('../api/userLogin');
var addProduct = require('../api/addProduct');
var deleteProduct = require('../api/deleteProduct');

/* GET home page. */
router.post('/login', async function(req, res, next) {
  const userInfo = await userLogin(req.body);

  if (Object.prototype.hasOwnProperty.call(userInfo, 'error')) {
    res.status(400).send(userInfo.error);
  } else {
    res.status(userInfo.status).send(userInfo.msg);
  }
});

/* GET home page. */
router.post('/register', async function(req, res, next) {
  const userInfo = await userProfile(req.body);

  if (Object.prototype.hasOwnProperty.call(userInfo, 'error')) {
    res.status(400).send(userInfo.error);
  } else {
    res.status(userInfo.status).send(userInfo.msg);
  }
});

/* GET home page. */
router.post('/add-product', async function(req, res, next) {
  const productInfo = await addProduct(req.body);

  if (Object.prototype.hasOwnProperty.call(productInfo, 'error')) {
    res.status(400).send(productInfo.error);
  } else {
    res.status(productInfo.status).send(productInfo.msg);
  }
});

/* GET home page. */
router.delete('/delete-product', async function(req, res, next) {
  const productInfo = await deleteProduct(req.body);

  if (Object.prototype.hasOwnProperty.call(productInfo, 'error')) {
    res.status(400).send(productInfo.error);
  } else {
    res.status(productInfo.status).send(productInfo.msg);
  }
});


module.exports = router;