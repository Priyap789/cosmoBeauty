const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* ==============================
   GET ALL ORDERS (Admin)
================================ */
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

/* ==============================
   UPDATE DELIVERY STATUS
================================ */
router.put("/:id/delivery-status", protect, async (req, res) => {
  try {
    const { deliveryStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Allowed statuses
    const allowedStatuses = [
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(deliveryStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery status",
      });
    }

    order.deliveryStatus = deliveryStatus;

    await order.save();

    res.json({
      success: true,
      message: "Delivery status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update delivery status",
    });
  }
});

module.exports = router;