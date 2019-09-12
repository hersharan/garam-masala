const database = require("../../database");
const Joi = require("@hapi/joi");
const UserSchema = require("./schema");
const emptyValidator = Joi.string().empty();

async function userProfile(userInfo) {
  const db = await database.connection();
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    last,
    dob,
    role,
    salutation
  } = userInfo;
  if (
    !Object.prototype.hasOwnProperty.call(userInfo, "password") ||
    !Object.prototype.hasOwnProperty.call(userInfo, "email") ||
    !Object.prototype.hasOwnProperty.call(userInfo, "username")
  ) {
    return {
      error: { status: 400, msg: "email, username and password are mandatory" }
    };
  }

  if (
    emptyValidator.validate(username).error !== null ||
    emptyValidator.validate(email).error !== null ||
    emptyValidator.validate(password).error !== null
  ) {
    return {
      error: {
        status: 400,
        msg: "email, username and password should not be empty"
      }
    };
  }

  const emailValidation = Joi.string().email();
  if (emailValidation.validate(email).error !== null) {
    return { error: { status: 400, msg: "email is not correct" } };
  }

  const usernameValidator = Joi.string().regex(/\s?\w+\s/i);

  if (usernameValidator.validate(username).error === null) {
    return {
      error: {
        status: 400,
        msg: "username should not contain spaces and uppercase"
      }
    };
  }

  const userExistingEmail = await db
    .collection("users")
    .find({ email: email })
    .toArray();

  if (userExistingEmail.length !== 0) {
    return { error: { status: 400, msg: "emailId already exist" } };
  }
  else {
    let user = new UserSchema({
      username,
      email,
      firstName,
      lastName,
      last,
      dob,
      role,
      salutation
    });

    user.setPassword(password);

    const mongoStatus = await user.save().catch(err => err);

    if (
      mongoStatus !== undefined &&
      Object.prototype.hasOwnProperty.call(mongoStatus, "name") &&
      mongoStatus.name === "MongoError"
    ) {
      return { status: 500, msg: mongoStatus.errmsg };
    }

    return { status: 201, msg: `${username} user has been created` };
  }
}

module.exports = userProfile;
