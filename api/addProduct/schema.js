const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  title: String,
  description: String,
  image: String,
  extension: String,
});

const EstimateSchema = new Schema({
  weight: {type: Number, default: 0},
  cost: {type: Number, default: 0},
  pid: String,
});

const Products = mongoose.model('Products', ProductsSchema, 'products');
const Estimate = mongoose.model('Estimate', EstimateSchema, 'estimate');

module.exports.Schema = {
  Products: Products,
  Estimate: Estimate
};