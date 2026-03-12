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
   GET USER ORDERS WITH PRODUCT DETAILS
================================= */
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.productId",
        model: "Product",
        select: "name images",
      });

  const formattedOrders = orders.map((order) => ({
  _id: order._id,
  amount: order.amount,
  createdAt: order.createdAt,
  deliveryStatus: order.deliveryStatus,

  // ⭐ ADD THESE
  refundStatus: order.refundStatus,
  refundDate: order.refundDate,
  cancelReason: order.cancelReason,
  adminMessage: order.adminMessage,

  items: order.items.map((item) => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    mainImage: item.productId?.images?.[0] || "",
  })),
}));

    res.json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

module.exports = router;