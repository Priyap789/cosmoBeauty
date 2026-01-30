const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String }, // image URL
  status: { type: Boolean, default: true } // active/inactive
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
