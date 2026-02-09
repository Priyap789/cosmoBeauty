const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;

  next();
};


exports.adminOnly = (req, res, next) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Admin only" });

  next();
};

