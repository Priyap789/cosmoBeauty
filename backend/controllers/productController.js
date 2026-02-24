const Product = require("../models/products");
const Review = require("../models/Review");
/* ================= ADD PRODUCT ================= */
const addProduct = async (req, res) => {
  try {
    const imagePaths = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];
    const mainImageIndex = Number(req.body.mainImageIndex) || 0;
  

    // Ingredients: comma-separated string to array
    const ingredientsArray = req.body.ingredients
      ? req.body.ingredients.split(",").map((i) => i.trim())
      : [];

    // 🔥 Offer logic
    const discountPercentage = Number(req.body.discountPercentage) || 0;
    const isActive = req.body.isActive === "true" || req.body.isActive === true;

    let offerPrice = null;

    if (isActive && discountPercentage > 0) {
      offerPrice =
        req.body.price -
        (req.body.price * discountPercentage) / 100;
    }

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      mainCategory: req.body.mainCategory,
      subCategory: req.body.subCategory,
      description: req.body.description,
      images: imagePaths,
      mainImage: imagePaths[mainImageIndex] || imagePaths[0],

      ingredients: ingredientsArray,
      howToUse: req.body.howToUse || "",

      // 🔥 Offer object
      offer: {
        discountPercentage,
        offerPrice,
        isActive,
        startDate: req.body.startDate || null,
        endDate: req.body.endDate || null,
      },
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

/* ================= GET OFFER PRODUCTS ONLY ================= */
const getOfferProducts = async (req, res) => {
  try {
    const today = new Date();

    const products = await Product.find({
      "offer.isActive": true,
      $or: [
        { "offer.startDate": null },
        {
          "offer.startDate": { $lte: today },
          "offer.endDate": { $gte: today },
        },
      ],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET PRODUCT BY ID ================= */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 Fetch reviews for this product
    const reviews = await Review.find({ product: product._id })
      .populate("user", "name") // include user's name
      .sort({ createdAt: -1 });

    // Send product + reviews together
    res.json({
      ...product.toObject(),
      reviews,
    });
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
      ingredients: req.body.ingredients
        ? req.body.ingredients.split(",").map((i) => i.trim())
        : [],
      howToUse: req.body.howToUse || "",
    };

    // Update images if new ones uploaded
    if (req.files && req.files.length > 0) {
  const imagePaths = req.files.map(
    (file) => `/uploads/${file.filename}`
  );

  const mainImageIndex = Number(req.body.mainImageIndex) || 0;

  updatedData.images = imagePaths;
  updatedData.mainImage =
    imagePaths[mainImageIndex] || imagePaths[0];
}


    // 🔥 Offer update logic
    const discountPercentage = Number(req.body.discountPercentage) || 0;
    const isActive = req.body.isActive === "true" || req.body.isActive === true;

    let offerPrice = null;

    if (isActive && discountPercentage > 0) {
      offerPrice =
        req.body.price -
        (req.body.price * discountPercentage) / 100;
    }

    updatedData.offer = {
      discountPercentage,
      offerPrice,
      isActive,
      startDate: req.body.startDate || null,
      endDate: req.body.endDate || null,
    };

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
  getOfferProducts, // 🔥 NEW
  getProductById,
  updateProduct,
  deleteProduct,
};
