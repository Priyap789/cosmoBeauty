const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
