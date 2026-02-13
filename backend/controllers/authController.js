const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ✅ Email Transport Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// =============================
// USER SIGNUP (WITH OTP)
// =============================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔢 AUTO-INCREMENT USER ID
    const lastUser = await User.findOne().sort({ userId: -1 });
    const nextUserId = lastUser ? lastUser.userId + 1 : 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      userId: nextUserId,
      name,
      email,
      password: hashedPassword,
      role: "user",
      emailVerified: false,
      emailOtp: otp,
      emailOtpExpire: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // 🔥 Send OTP Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      html: `
        <h2>Your OTP is: ${otp}</h2>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    res.status(201).json({
      message: "OTP sent to your email",
      email
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed" });
  }
};


// =============================
// VERIFY EMAIL OTP
// =============================
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (user.emailOtp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.emailOtpExpire < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.emailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpire = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed" });
  }
};


// =============================
// LOGIN (CHECK EMAIL VERIFIED)
// =============================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Invalid credentials" });

  if (!user.emailVerified)
    return res.status(400).json({
      message: "Please verify your email first"
    });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user),
    role: user.role
  });
};


// =============================
// FORGOT PASSWORD (SEND OTP)
// =============================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // 🔢 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
user.resetOtpExpire = Date.now() + 5 * 60 * 1000;
await user.save();

    // 📧 Send OTP Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Your Password Reset OTP is: ${otp}</h2>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    res.json({
      message: "OTP sent to your email",
      email
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};



// =============================
// RESET PASSWORD WITH OTP
// =============================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found" });

   // Reset Password with OTP
if (user.resetOtp !== otp)
  return res.status(400).json({ message: "Invalid OTP" });

if (user.resetOtpExpire < Date.now())
  return res.status(400).json({ message: "OTP expired" });

user.password = await bcrypt.hash(password, 10);
user.resetOtp = undefined;
user.resetOtpExpire = undefined;
await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Password reset failed" });
  }
};


