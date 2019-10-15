var mongoose = require('mongoose');
var UserModel = require('../models/users');
const crypto = require('crypto');

// Database Name
const dbName = 'garam_masala';
const url = `mongodb://localhost:27017/${dbName}`;

async function dbConnection() {
  try {
    await mongoose.connect( url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    let db = mongoose.connection;

    // Connection Error
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('123456', salt,
      1000, 64, `sha512`).toString(`hex`);

    await UserModel.findOneAndUpdate(
      {
        role: 'admin'
      }, {
        salutation: 'Mr',
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@garam-masala.com',
        dob: '09-09-2019',
        username: 'admin',
        role: 'admin',
        createDate: Date().now,
        updateDate: Date().now,
        hash: hash,
        salt: salt
    }, {upsert: true});
  }
  catch(err) {
    console.log('err', err);
  }
}

// Use connect method to connect to the server
module.exports = {
  connection: dbConnection
}