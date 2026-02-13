const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true
    },

    name: {
      type: String,
      required: function () {
        return this.role === "user";
      }
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    mobile: {
      type: String
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },

    addresses: [
      {
        fullName: String,
        mobile: String,
        address: String,
        city: String,
        state: String,
        pincode: String
      }
    ],

    // 🔥 Email Verification Fields
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailOtp: String,
    emailOtpExpire: Date,

    // ✅ Password Reset Fields (updated)
    resetOtp: String,
    resetOtpExpire: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
