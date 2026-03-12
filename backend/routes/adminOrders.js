const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* ==============================
   GET ALL ORDERS (Admin)
================================ */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "userId",
        select: "_id name email mobile",
      })
      .populate({
        path: "items.productId",
        select: "name price images mainImage",
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

/* ==============================
   UPDATE DELIVERY STATUS (Admin)
================================ */
router.put("/:id/delivery-status", protect, adminOnly, async (req, res) => {
  try {
    const { deliveryStatus, adminMessage } = req.body;

    const order = await Order.findById(req.params.id).populate("userId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ❌ Do not allow status change if already cancelled
    if (order.deliveryStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled. Status cannot be changed.",
      });
    }

    // Update delivery status
    order.deliveryStatus = deliveryStatus;

    // Save admin message
    if (adminMessage) {
      order.adminMessage = adminMessage;
    }

    /* ===========================
       ADMIN CANCEL ORDER
    ============================ */
    if (deliveryStatus === "Cancelled") {
      order.cancelledBy = "admin";
      order.cancelledAt = new Date();
      order.cancelReason = adminMessage || "Cancelled by admin";
    }

    /* ===========================
       COD PAYMENT AUTO COMPLETE
    ============================ */
    if (order.paymentMethod === "COD" && deliveryStatus === "Delivered") {
      order.paymentStatus = "paid";
    }

    await order.save();

    const user = order.userId;

    /* ===========================
       SEND EMAIL TO USER
    ============================ */
    if (user?.email) {
      await sendEmail(
        user.email,
        `Order Update - ${order._id.toString().slice(-6)}`,
        `
        <h2>Hello ${user.name},</h2>

        <p>Your order status has been updated.</p>

        <p><strong>Status:</strong> ${deliveryStatus}</p>

        ${
          adminMessage
            ? `<p><strong>Message from Admin:</strong> ${adminMessage}</p>`
            : ""
        }

        ${
          deliveryStatus === "Cancelled"
            ? `<p>Your order has been cancelled by the admin.</p>`
            : ""
        }

        <br/>
        <p>Thank you for shopping with us ❤️</p>
        `
      );
    }

    res.json({
      success: true,
      message: "Order status updated and email sent",
      data: order,
    });

  } catch (error) {
    console.log("Delivery Status Update Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==============================
   SEND REFUND MESSAGE (Admin)
================================ */
router.post("/:id/send-refund", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const user = order.userId;

    if (!user || !user.email) {
      return res.status(400).json({
        success: false,
        message: "User email not found",
      });
    }

    // ⭐ START REFUND PROCESS
    order.refundStatus = "processing";
    order.refundDate = new Date();
    await order.save();

    await sendEmail(
      user.email,
      `Refund Initiated for Order ${order._id}`,
      `
      <h2>Hello ${user.name},</h2>

      <p>Your refund request for order <strong>${order._id}</strong> has been received.</p>

      <p>The refund amount will be credited within <strong>2 days</strong>.</p>

      <br/>
      <p>Thank you for shopping with us ❤️</p>
      `
    );

    res.json({
      success: true,
      message: `Refund notification sent to ${user.email}`,
    });

  } catch (error) {
    console.error("Send Refund Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send refund message",
    });
  }
});
module.exports = router;