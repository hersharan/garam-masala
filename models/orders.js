const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = new Schema({
  uid: String,
  items: {type: Array, default: []},
  status: {type: Boolean, default: 0},
  totalAmount: {type: Number, default: 0},
  createdDate: {type: Date, default: Date.now},
  completedDate: {type: Date, default: null}
});

const Orders = mongoose.model('Orders', OrdersSchema, 'pending_orders');

module.exports = Orders;