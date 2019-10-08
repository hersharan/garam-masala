const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EstimateSchema = new Schema({
  weight: Number,
  cost: Number,
  pid: {type: Schema.Types.ObjectId, ref: 'Products'}
});

const Estimate = mongoose.model('Estimate', EstimateSchema, 'estimate');

module.exports = Estimate;