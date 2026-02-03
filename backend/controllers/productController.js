const Product = require("../models/products");

// ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      mainCategory: req.body.mainCategory,
      subCategory: req.body.subCategory,
      description: req.body.description,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PRODUCTS
const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedProduct);
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted successfully" });
};

// ✅ GET TOTAL PRODUCTS
const getProductCount = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductCount, // <-- exported the new function
};
