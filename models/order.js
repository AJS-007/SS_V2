const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  craft: { type: mongoose.Schema.Types.ObjectId, ref: 'Craft', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' }
});
module.exports = mongoose.model('Order', orderSchema);
