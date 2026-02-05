const Product = require("../models/products");

/* ================= ADD PRODUCT ================= */
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

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL PRODUCTS ================= */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET PRODUCT BY ID (🔥 REQUIRED) ================= */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json(null);
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
};

/* ================= UPDATE PRODUCT ================= */
const updateProduct = async (req, res) => {
  try {
    const updatedData = {
      name: req.body.name,
      price: req.body.price,
      mainCategory: req.body.mainCategory,
      subCategory: req.body.subCategory,
      description: req.body.description,
    };

    // update image only if new file uploaded
    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE PRODUCT ================= */
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById, // 👈 VERY IMPORTANT
  updateProduct,
  deleteProduct,
};
