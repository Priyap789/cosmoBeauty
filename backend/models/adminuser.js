const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
});

// THIS is the fix:
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
