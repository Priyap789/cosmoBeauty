const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    mainCategory: String,
    subCategory: String,
    description: String,
    images: [String], // multiple images
    ingredients: [String], // NEW: list of ingredients
    howToUse: String,      // NEW: instructions
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
