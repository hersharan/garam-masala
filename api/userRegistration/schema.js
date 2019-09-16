const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  salutation: String,
  firstName: String,
  lastName: String,
  email: { type: String, match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
  dob: Date,
  username: { type: String, lowercase: true, trim: true, sparse:true },
  orders: {type: Array, default: 0},
  role: {type: Array, default: 1},
  createDate: { type: Date, default: Date.now},
  updateDate: Date,
  address: String,
  hash : String,
  salt : String
});

// Password Generator
UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt,
  1000, 64, `sha512`).toString(`hex`);
};

// Password Generator
UsersSchema.methods.validPassword = function(password) {
  let hash = crypto.pbkdf2Sync(password,
  this.salt, 1000, 64, `sha512`).toString(`hex`);

  return this.hash === hash;
};

const Users = mongoose.model('Users', UsersSchema, 'users');

module.exports = Users;