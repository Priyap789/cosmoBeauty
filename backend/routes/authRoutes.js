const express = require("express");
const router = express.Router();

const {
  sendOtp,       // ✅ must import
  verifyOtp,     // ✅ must import
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Auth Routes
router.post("/send-otp", sendOtp);       // sends OTP to email
router.post("/verify-otp", verifyOtp);   // verifies OTP & creates user
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected Routes
router.get("/admin/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin Dashboard" });
});

router.get("/user/home", protect, (req, res) => {
  res.json({ message: "User Home Page" });
});

module.exports = router;