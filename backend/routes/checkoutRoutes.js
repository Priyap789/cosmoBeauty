// routes/checkout.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { protect } = require("../middleware/authMiddleware");
require("dotenv").config();
const Product = require("../models/products");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ======================================================
// ✅ CREATE RAZORPAY ORDER
// ======================================================
router.post("/create-order", protect, async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const options = {
      amount: totalAmount * 100,
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
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================
// ✅ VERIFY PAYMENT & SAVE ONLINE ORDER
// ======================================================
router.post("/verify-payment", protect, async (req, res) => {
  try {
    const { razorpayResponse, items, shipping, totalAmount } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      razorpayResponse;

    // 🔐 Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // ✅ Save Order (ONLINE)
    const itemsWithImage = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: item.productId,
          name: product.name,
          price: item.price,
          quantity: item.quantity,
          mainImage: product.images?.[0] || "",
        };
      })
    );

   const newOrder = await Order.create({
  userId: req.user._id,
  items: itemsWithImage,
  shipping,
  amount: totalAmount,
  paymentMethod: "ONLINE",
  paymentStatus: "paid",
  paymentId: razorpay_payment_id,
  deliveryStatus: "Processing",
});

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
      message: "Payment verified & order saved",
      order: newOrder,
    });
  } catch (error) {
    console.log("Verify Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================
// ✅ CASH ON DELIVERY ORDER
// ======================================================
router.post("/cod-order", protect, async (req, res) => {
  try {
    const { items, shipping, totalAmount } = req.body;

    const itemsWithImage = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: item.productId,
          name: product.name,
          price: item.price,
          quantity: item.quantity,
          mainImage: product.images?.[0] || "",
        };
      })
    );

    const newOrder = await Order.create({
  userId: req.user._id,
  items: itemsWithImage,
  shipping,
  amount: totalAmount,
  paymentMethod: "COD",
  paymentStatus: "pending",
  deliveryStatus: "Processing",
});

    const user = await User.findById(req.user._id);

    // ✅ Send COD email
    if (user?.email) {
      await sendEmail(
        user.email,
        "Order Confirmed - Cash on Delivery 🚚",
        `
          <h2>Hello ${user.name},</h2>
          <p>Your order has been placed successfully.</p>
          <p><strong>Order ID:</strong> ${newOrder._id}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <p><strong>Payment Method:</strong> Cash on Delivery</p>
          <br/>
          <p>🚚 Please pay the amount in cash when your order is delivered.</p>
          <p>We’ll notify you once your order is shipped.</p>
          <br/>
          <p>Thank you for shopping with us ❤️</p>
        `
      );
    }

    res.status(201).json({
      success: true,
      message: "COD Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("COD Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================
// ✅ GET LOGGED-IN USER ORDERS
// ======================================================
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("Fetch Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================
// ✅ CANCEL ORDER
// ======================================================
// routes/checkout.js
router.put("/cancel/:id", protect, async (req, res) => {
  try {
    const { reason = "No reason provided" } = req.body;

    const order = await Order.findById(req.params.id).populate("userId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ❌ Prevent cancelling delivered order
    if (order.deliveryStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be cancelled",
      });
    }

    // ❌ Prevent cancelling twice
    if (order.deliveryStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled",
      });
    }

    // ✅ Mark cancelled by USER
    order.deliveryStatus = "Cancelled";
    order.cancelledBy = "user";
    order.cancelReason = reason;
    order.cancelledAt = new Date();

    await order.save();

    const user = order.userId;

    // ✅ Send Email
    if (user?.email) {
      await sendEmail(
        user.email,
        `Order Cancelled - ${order._id.toString().slice(-6)}`,
        `<h2>Hello ${user.name},</h2>
         <p>Your order has been cancelled successfully.</p>
         <p><strong>Reason:</strong> ${reason}</p>
         <br/>
         <p>If this was a mistake please contact support.</p>
         <p>Thank you ❤️</p>`
      );
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });

  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;