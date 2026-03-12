const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
// Temporary in-memory OTP store
const otpStore = {}; 
// Structure: otpStore[email] = { name, password, otp, expires }
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
// POST /send-otp
exports.sendOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in temporary store (expires in 5 minutes)
    otpStore[email] = { name, password, otp, expires: Date.now() + 5*60*1000 };

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      html: `<h2>Your OTP is: ${otp}</h2><p>This OTP will expire in 5 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to your email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// =============================
// VERIFY EMAIL OTP
// =============================
// POST /verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];
    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expires < Date.now()) return res.status(400).json({ message: "OTP expired" });

    // Hash password
    const hashedPassword = await bcrypt.hash(record.password, 10);

    // Auto-increment userId
    const lastUser = await User.findOne().sort({ userId: -1 });
    const nextUserId = lastUser ? lastUser.userId + 1 : 1;

    // Create user after OTP verification
    const newUser = await User.create({
      userId: nextUserId,
      name: record.name,
      email,
      password: hashedPassword,
      role: "user",
      emailVerified: true,
    });

    // Remove OTP from temporary store
    delete otpStore[email];

    res.status(201).json({ message: "User created successfully", userId: newUser._id });

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
  role: user.role,
  userId: user._id,        // MongoDB ObjectId
  numericUserId: user.userId, // Your auto increment id (optional)
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


