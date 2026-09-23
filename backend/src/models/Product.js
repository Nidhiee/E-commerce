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
    type: String   // legacy single cover image, kept for existing cart/order snapshots
  },
  media: {
    type: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          default: 'image'
        },
        url: { type: String, required: true, trim: true },
        altText: { type: String, trim: true }
      }
    ],
    default: []
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
},
isActive: {
  type: Boolean,
  default: true    // soft-delete flag; false hides the product from listings
}

}, { timestamps: true });

// Matches the GET /api/products query: filter by category + isActive,
// sorted by createdAt.
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);