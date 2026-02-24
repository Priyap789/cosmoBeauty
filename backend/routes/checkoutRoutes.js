// routes/checkout.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { protect } = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===============================
// ✅ CREATE RAZORPAY ORDER
// ===============================
router.post("/create-order", protect, async (req, res) => {
  try {
    const { totalAmount } = req.body;

    const options = {
      amount: totalAmount * 100, // convert to paisa
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const paymentOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: paymentOrder,
    });
  } catch (error) {
    console.log("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===============================
// ✅ VERIFY PAYMENT & SAVE ORDER
// ===============================
router.post("/verify-payment", protect, async (req, res) => {
  try {
    const { razorpayResponse, items, shipping, totalAmount } = req.body;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = razorpayResponse;

    // 🔐 VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ✅ Save Order
    const newOrder = await Order.create({
      userId: req.user._id,
      items,
      shipping,
      amount: totalAmount,
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      deliveryStatus: "Processing",
    });

    // ✅ Get user details
    const user = await User.findById(req.user._id);

    // ✅ Send confirmation email
    if (user?.email) {
      await sendEmail(
        user.email,
        "Payment Successful 🎉",
        `
          <h2>Hello ${user.name},</h2>
          <p>Your payment of ₹${totalAmount} was successful.</p>
          <p><strong>Order ID:</strong> ${newOrder._id}</p>
          <p><strong>Status:</strong> ${newOrder.deliveryStatus}</p>
          <br/>
          <p>We’ll notify you once your order is shipped.</p>
          <p>Thank you for shopping with us ❤️</p>
        `
      );
    }

    res.json({
      success: true,
      message: "Payment verified, order saved & email sent",
      order: newOrder,
    });
  } catch (error) {
    console.log("Verify Payment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===============================
// ✅ GET LOGGED-IN USER ORDERS
// ===============================
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("Fetch Orders Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;