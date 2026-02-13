// routes/profile.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// GET logged-in user
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// UPDATE logged-in user
router.put("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.mobile = req.body.mobile || user.mobile;
  user.addresses = req.body.addresses || user.addresses;

  await user.save();
  res.json(user);
});

module.exports = router;
