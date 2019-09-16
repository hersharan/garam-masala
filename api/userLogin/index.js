const database = require("../../database");
const crypto = require('crypto');
const Joi = require("@hapi/joi");
const emptyValidator = Joi.string().empty();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '.', 'key.txt')
const privateKey = fs.readFileSync(file);
const expiry = Math.floor(Date.now() / 1000) + (24 * 60 * 60);

async function userLogin(loginInfo) {
  const db = await database.connection();
  const {
    email,
    password
  } = loginInfo;

  if (
    !Object.prototype.hasOwnProperty.call(loginInfo, "password") ||
    !Object.prototype.hasOwnProperty.call(loginInfo, "email")
  ) {
    return {
      error: { status: 404, msg: "email and password are mandatory" }
    };
  }

  if (
    emptyValidator.validate(email).error !== null ||
    emptyValidator.validate(password).error !== null
  ) {
    return {
      error: {
        status: 400,
        msg: "email and password should not be empty"
      }
    };
  }

  const userExistingEmail = await db
    .collection("users")
    .find({ email: email })
    .toArray();

  if (userExistingEmail.length === 0) {
    return { error: { status: 400, msg: "user does not exist" } };
  }
  else {
    const hash = await crypto.pbkdf2Sync(password, userExistingEmail[0].salt,
      1000, 64, `sha512`).toString(`hex`);

    if (userExistingEmail[0].hash !== hash) {
      return {status: 200, msg: 'Password is not correct'}
    }
  }

  let token = jwt.sign({
    exp: expiry,
    data: email
  }, privateKey, { algorithm: 'RS256'});

  return {status: 200, msg: {token, expiry}}
}

module.exports = userLogin;