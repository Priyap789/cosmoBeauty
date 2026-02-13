const express = require("express");
const User = require("../models/User");
const router = express.Router();

// GET all users (Admin)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
