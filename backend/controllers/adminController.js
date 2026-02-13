const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json(users); // always array
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

module.exports = { getAllUsers };
