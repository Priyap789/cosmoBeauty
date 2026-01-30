const User = require("../models/adminuser");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Admin login successful",
    token
  });
};

exports.adminDashboard = (req, res) => {
  res.json({
    message: "Welcome to Admin Dashboard",
    data: {
      totalUsers: 120,
      totalOrders: 45
    }
  });
};
