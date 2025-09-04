const mongoose = require('mongoose');

const craftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  price: Number,
  images: [String],           // URLs or /uploads/file.jpg
  originState: String,        // to show state-wise products
  weightKg: Number,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Craft', craftSchema);
