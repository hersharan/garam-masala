var express = require('express');
var router = express.Router();
var userProfile = require('../api/userRegistration');
var userLogin = require('../api/userLogin');
var addProduct = require('../api/addProduct');
var deleteProduct = require('../api/deleteProduct');
var getProducts = require('../api/getProducts');
var addOrder = require('../api/addOrder');
var getOrder = require('../api/getOrder');
var {isAuthorize, isAdmin} = require('../utils/authorize');

/* Login */
router.post('/login', async function(req, res, next) {
  const Info = await userLogin(req.body);

  if (Object.prototype.hasOwnProperty.call(Info, 'error')) {
    res.status(Info.error.status).send(Info.error);
  } else {
    res.status(Info.status).send(Info.msg);
  }
});

/* Registration */
router.post('/register', async function(req, res, next) {
  const Info = await userProfile(req.body);

  if (Object.prototype.hasOwnProperty.call(Info, 'error')) {
    res.status(Info.error.status).send(Info.error);
  } else {
    res.status(200).send(Info.msg);
  }
});

/* Add Product */
router.post('/add-product', async function(req, res, next) {
  const admin = await isAdmin(req);

  if (!admin) {
    res.status(403).send('you are not authorize');
  }
  else {
    const Info = await addProduct(req.body);

    if (Object.prototype.hasOwnProperty.call(Info, 'error')) {
      res.status(Info.error.status).send(Info.error);
    } else {
      res.status(Info.status).send(Info.msg);
    }
  }

});

/* Delete Product */
router.delete('/delete-product', async function(req, res, next) {
  const admin = await isAdmin(req);

  if (!admin) {
    res.status(403).send('you are not authorize');
  }
  else {
    const Info = await deleteProduct(req.query);

    if (Object.prototype.hasOwnProperty.call(Info, 'error')) {
      res.status(Info.error.status).send(Info.error);
    } else {
      res.status(Info.status).send(Info.msg);
    }
  }
});

/* Get All Products */
router.get('/products', async function(req, res, next) {
  const Info = await getProducts(req.query);

  if (Object.prototype.hasOwnProperty.call(Info, 'error')) {
    res.status(Info.error.status).send(Info.error);
  } else {
    res.status(Info.status).send(Info.msg);
  }
});

/* Get All Products */
router.post('/add-to-cart', async function(req, res, next) {
  const user = await isAuthorize(req);

  if (!user) {
    res.status(403).send('you are not authorize');
  }
  else {
    const Info = await addOrder(req.body, user);

    if (Object.prototype.hasOwnProperty.call(Info, 'error')) {
      res.status(Info.error.status).send(Info.error);
    } else {
      res.status(200).send(Info.msg);
    }
  }
});

/* Get All Products */
router.get('/get-my-order', async function(req, res, next) {
  const user = await isAuthorize(req);

  if (!user) {
    res.status(403).send('you are not authorize');
  }
  else {
    const Info = await getOrder(user);

    if (Object.prototype.hasOwnProperty.call(Info, 'error')) {
      res.status(Info.error.status).send(Info.error);
    } else {
      res.status(200).send(Info.msg);
    }
  }
});


module.exports = router;