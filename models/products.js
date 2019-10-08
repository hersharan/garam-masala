const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  title: String,
  description: String,
  image: String,
  fileName: String,
  extension: String,
  details: {type: Array, ref: 'Estimate'}
});

const Products = mongoose.model('Products', ProductsSchema, 'products');

module.exports = Products;