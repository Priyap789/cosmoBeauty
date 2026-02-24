// routes/profile.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order"); // ✅ Added
const { protect } = require("../middleware/authMiddleware");

/* =================================
   GET LOGGED-IN USER
================================= */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

/* =================================
   UPDATE LOGGED-IN USER
================================= */
router.put("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.mobile = req.body.mobile || user.mobile;
    user.addresses = req.body.addresses || user.addresses;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

/* =================================
   GET USER ORDERS (WITH DELIVERY STATUS)
================================= */
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
    });
  }
});

module.exports = router;