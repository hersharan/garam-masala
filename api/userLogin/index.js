const crypto = require('crypto');
const Joi = require("@hapi/joi");
const emptyValidator = Joi.string().empty();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../../config', 'key.txt');
const UserModel = require('../../models/users');
const Session = require('../../models/sessions');
const privateKey = fs.readFileSync(file);
const expiry = Date.now();

/**
 * Check for password and email properties in login object.
 *
 * @param {object} loginInfo
 *
 * @returns error if exist else null.
 */
function handleExistenceFields(loginInfo) {
  if (
    !Object.prototype.hasOwnProperty.call(loginInfo, "password") ||
    !Object.prototype.hasOwnProperty.call(loginInfo, "email")
  ) {
    return {
      error: { status: 404, msg: "email and password are mandatory" }
    };
  }

  return null;
}

/**
 * Check for password and email emptiness.
 *
 * @param {object} loginInfo
 *
 * @returns error if exist else null.
 */
function handleEmptyFields(loginInfo) {
  const {
    email,
    password
  } = loginInfo;

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

  return null;
}

/**
 * Check all validations.
 *
 * @param {object} loginInfo
 *
 * @returns error if exist else null.
 */
function validation(loginInfo) {
  if (handleExistenceFields(loginInfo) !== null) {
    return handleExistenceFields(loginInfo);
  }

  if (handleEmptyFields(loginInfo) !== null) {
    return handleEmptyFields(loginInfo);
  }

  return null;
}

/**
 * Check for user and create login token.
 *
 * @param {object} userInfo
 *
 * @returns error if exist else success message.
 */
async function userLogin(loginInfo) {
  const {
    email,
    password
  } = loginInfo;

  try {
    const userExistingEmail = await UserModel.find({ email: email });
    if (userExistingEmail.length === 0) {
      return { error: { status: 404, msg: "user does not exist" } };
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
      data: email,
      uid: userExistingEmail[0]._id
    }, privateKey, { algorithm: 'RS256'});

    try {
      const id = await Session.findOneAndUpdate({uid: userExistingEmail[0]._id}, {
        uid: userExistingEmail[0]._id,
        token,
        expiry: Math.floor(expiry / 1000),
        expireAt: expiry
      }, {upsert: true});
    }
    catch(err) {
      return { error: { status: 500, msg: err.toString() } };
    }

    return {status: 200, msg: {token, expiry}}
  }
  catch(err) {
    return { error: { status: 500, msg: err.toString() } };
  }
}

async function login(loginInfo) {
  let result = await validation(loginInfo);

  if (result === null) {
    result = await userLogin(loginInfo);
  }

  return result;
}

module.exports = login;