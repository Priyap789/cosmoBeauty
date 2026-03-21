const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/products");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

/* ==============================
   MULTER CONFIGURATION
================================ */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ==============================
   ADD REVIEW
================================ */

router.post("/:productId", protect, upload.single("image"), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || !userId) {
      return res.status(400).json({ message: "Rating and userId are required" });
    }

    /* 🔥 Check if user purchased & order delivered */
    const order = await Order.findOne({
      userId: userId,
      deliveryStatus: "Delivered",
      "items.productId": req.params.productId,
    });

    if (!order) {
      return res
        .status(400)
        .json({ message: "You can review only delivered products" });
    }

    /* 🔥 Check duplicate review */
    const alreadyReviewed = await Review.findOne({
      user: userId,
      product: req.params.productId,
    });

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    /* CREATE REVIEW */

    await Review.create({
      user: userId,
      product: req.params.productId,
      rating,
      comment,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    /* UPDATE PRODUCT RATING */

    const reviews = await Review.find({ product: req.params.productId });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(req.params.productId, {
      rating: avgRating,
      numReviews: reviews.length,
    });

    res.status(201).json({
      message: "Review added successfully",
      reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

/* ==============================
   GET ALL REVIEWS
================================ */

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ==============================
   GET REVIEWS BY PRODUCT
================================ */

router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;