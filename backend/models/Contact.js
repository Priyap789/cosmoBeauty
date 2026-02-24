const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    // ✅ NEW FIELDS
    status: {
      type: String,
      enum: ["Pending", "Replied"],
      default: "Pending",
    },
    replyMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
