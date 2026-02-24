const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,   // ✅ FIXED
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,     // ✅ FIXED
      to,
      subject,
      html
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.log("Email Error:", error);
    throw error;
  }
};

module.exports = sendEmail;