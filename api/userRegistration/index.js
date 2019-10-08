const Joi = require("@hapi/joi");
const UserSchema = require("../../models/users");
const emptyValidator = Joi.string().empty();
const emailValidation = Joi.string().email();
const usernameValidator = Joi.string().regex(/\s?\w+\s/i);

/**
 * Check for password, email and username properties in user object.
 *
 * @param {object} userInfo
 *
 * @returns error if exist else null.
 */
function handleExistenceFields(userInfo) {
  if (
    !Object.prototype.hasOwnProperty.call(userInfo, "password") ||
    !Object.prototype.hasOwnProperty.call(userInfo, "email") ||
    !Object.prototype.hasOwnProperty.call(userInfo, "username")
  ) {
    return {
      error: {
        status: 400,
        msg: "email, username and password are mandatory"
      }
    };
  }

  return null;
}

/**
 * Check for password, email and username emptiness.
 *
 * @param {object} userInfo
 *
 * @returns error if exist else null.
 */
function handleEmptyFields(userInfo) {
  const { username, email, password } = userInfo;

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

  return null;
}

/**
 * Check for email validation.
 *
 * @param {object} userInfo
 *
 * @returns error if exist else null.
 */
function handleEmailValidation(userInfo) {
  const { email } = userInfo;

  if (emailValidation.validate(email).error !== null) {
    return {
      error: {
        status: 400,
        msg: "email is not correct"
      }
    };
  }

  return null;
}

/**
 * Check for username should not contain spaces and uppercase.
 *
 * @param {object} userInfo
 *
 * @returns error if exist else null.
 */
function handleUsernameValidation(userInfo) {
  const { username } = userInfo;

  if (usernameValidator.validate(username).error === null) {
    return {
      error: {
        status: 400,
        msg: "username should not contain spaces and uppercase"
      }
    };
  }

  return null;
}

/**
 * Create New User.
 *
 * @param {object} userInfo
 *
 * @returns error if exist else success message.
 */
async function registerNewUser(userInfo) {
  const {
    email,
    username,
    firstName,
    lastName,
    dob,
    role,
    salutation,
    password
  } = userInfo;

  try {
    const userExistingEmail = await UserSchema.find({ email: email });

    if (userExistingEmail.length !== 0) {
      return { error: { status: 400, msg: "emailId already exist" } };
    } else {
      try {
        let user = new UserSchema({
          username,
          email,
          firstName,
          lastName,
          dob,
          role,
          salutation,
        });

        user.setPassword(password);
        await user.save();

        return { status: 201, msg: `${username} user has been created` };
      } catch (err) {
        return { error: { status: 500, msg: err.toString() } };
      }
    }
  } catch (err) {
    return { error: { status: 500, msg: err.toString() } };
  }
}

/**
 * Check all validations.
 *
 * @param {object} userInfo
 *
 * @returns error if exist else null.
 */
function validation(userInfo) {
  if (handleExistenceFields(userInfo) !== null) {
    return handleExistenceFields(userInfo);
  }

  if (handleEmailValidation(userInfo) !== null) {
    return handleEmailValidation(userInfo);
  }

  if (handleEmptyFields(userInfo) !== null) {
    return handleEmptyFields(userInfo);
  }

  if (handleUsernameValidation(userInfo) !== null) {
    return handleUsernameValidation(userInfo);
  }

  return null;
}

async function userProfile(userInfo) {
  let result = await validation(userInfo);

  if (result === null) {
    result = await registerNewUser(userInfo);
  }

  return result;
}

module.exports = userProfile;
