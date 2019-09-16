const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  title: String,
  description: String,
  image: String,
  extension: String,
});

const Products = mongoose.model('Products', ProductsSchema, 'products');

module.exports = Products;