const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/products");

router.post("/:productId", async (req, res) => {
  try {
    const { rating, comment, userId } = req.body;

    if (!rating || !userId) {
      return res.status(400).json({
        message: "rating and userId are required",
      });
    }

    await Review.create({
      user: userId, // 👈 manually sent from frontend
      product: req.params.productId,
      rating,
      comment,
    });

    const reviews = await Review.find({
      product: req.params.productId,
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(req.params.productId, {
      rating: avgRating,
      numReviews: reviews.length,
    });

    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
