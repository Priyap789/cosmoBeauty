const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmailOtp
} = require("../controllers/authController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmailOtp);

router.post("/forgot-password", forgotPassword);

// 🔹 UPDATED: remove :token since OTP is used
router.post("/reset-password", resetPassword);

// Protected Routes
router.get("/admin/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin Dashboard" });
});

router.get("/user/home", protect, (req, res) => {
  res.json({ message: "User Home Page" });
});

module.exports = router;
