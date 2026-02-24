const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// ================= CREATE CONTACT =================
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Contact request submitted successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= GET ALL CONTACTS (ADMIN) =================
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= REPLY TO CONTACT =================
exports.replyToContact = async (req, res) => {
  try {
    const { contactId, replyMessage } = req.body;

    if (!contactId || !replyMessage) {
      return res.status(400).json({
        success: false,
        message: "Contact ID and reply message required",
      });
    }

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // ===== Nodemailer setup =====
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS, // App Password from Gmail
      },
    });

    // ===== Send email =====
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contact.email,                // user email
      subject: "Reply from COSMO Support Team",
      text: replyMessage,
      replyTo: process.env.EMAIL_USER,  // admin can receive replies
    });

    // ===== Update contact status =====
    contact.status = "Replied";
    contact.replyMessage = replyMessage;
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message,
    });
  }
};



