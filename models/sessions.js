const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  uid: { type: Schema.Types.ObjectId, ref: 'Users' },
  token: String,
  expiry: String,
  expireAt: {type: Date, index: { expires: '1d' }},
});

const Session = mongoose.model('Session', SessionSchema, 'sessions');

module.exports = Session;