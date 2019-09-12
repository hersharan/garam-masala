var express = require('express');
var router = express.Router();
var userProfile = require('../api/userRegistration/user');

/* GET home page. */
router.post('/register', async function(req, res, next) {
  const userInfo = await userProfile(req.body);
  console.log(userInfo);

  if (Object.prototype.hasOwnProperty.call(userInfo, 'error')) {
    res.status(400).send(userInfo.error);
  } else {
    res.status(userInfo.status).send(userInfo.msg);
  }
});

module.exports = router;