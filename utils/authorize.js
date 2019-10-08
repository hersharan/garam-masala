const SessionModel = require('../models/sessions');
const jwt = require('jsonwebtoken');

async function loginStatus(req) {
  const auth = req.headers['authorization'];
  if (auth !== undefined) {
    const token = auth.split(' ');
    const decodedToken = jwt.decode(token[1]);

    if (decodedToken !== null) {
      const { uid } = decodedToken;

      try {
        const user = await SessionModel.findOne({uid}).populate('uid');
        if (user !== null) return user;

        return false;
      }
      catch(err) {
        return {error: {status: 500, msg: err.toString()}}
      }
    }
    else {
      return false;
    }
  }

  return false;
}

async function isAuthorize(req) {
  const user = await loginStatus(req);
  if (typeof user === 'object') {
    return user;
  }

  return false;
}

async function isAdmin(req) {
  const user = await loginStatus(req);
  if (typeof user === 'object' && user.uid.role.includes('admin')) {
      return true;
  }

  return false;
}

module.exports = {
  isAdmin,
  isAuthorize
}