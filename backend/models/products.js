const mongoose = require("mongoose");

// 🔥 Offer Sub-Schema
const offerSchema = new mongoose.Schema({
  discountPercentage: {
    type: Number,
    default: 0,
  },
  offerPrice: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    mainCategory: String,
    subCategory: String,
    description: String,
    images: [String],       // multiple images
    ingredients: [String],  // list of ingredients
    howToUse: String,       // instructions

    // ⭐ Ratings
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    // 🔥 Offer (NEW)
    offer: {
      type: offerSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
