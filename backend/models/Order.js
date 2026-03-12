const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: String,
        price: Number,
        quantity: Number,
        mainImage: String
      },
    ],

    shipping: {
      name: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentId: String,

    deliveryStatus: {
      type: String,
      enum: [
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Processing",
    },

    // ⭐ WHO CANCELLED THE ORDER
    cancelledBy: {
      type: String,
      enum: ["user", "admin"],
      default: null,
    },

    cancelReason: {
      type: String,
      default: "",
    },

    cancelledAt: {
      type: Date,
    },

    adminMessage: {
      type: String,
      default: "",
    },

    refundStatus: {
      type: String,
      enum: ["none", "processing", "completed"],
      default: "none",
    },

    refundDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);