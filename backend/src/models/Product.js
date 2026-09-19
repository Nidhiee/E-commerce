const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  imageUrl: {
    type: String
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  warranty: {
    type: String   // e.g. "1 year manufacturer warranty"
  },
  subCategory: {
  type: String   // e.g. "Smartphones", "Laptops", "Headphones"
},
color: {
  type: String
},
weight: {
  type: Number   // in grams, useful for shipping calculations later
}

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);