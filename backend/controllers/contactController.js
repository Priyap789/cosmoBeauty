const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// ================= CREATE CONTACT =================
const createContact = async (req, res) => {
  try {
    let { name, email, phone, message } = req.body;

    name = name?.trim();
    email = email?.trim();
    phone = phone?.trim();
    message = message?.trim();

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Enter valid 10-digit Indian mobile number",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
    });

    // ================= SEND EMAIL TO ADMIN =================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Contact request submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ================= GET ALL CONTACTS (Admin) =================
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE CONTACT =================
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }
    await contact.deleteOne();
    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= REPLY TO CONTACT =================
const replyToContact = async (req, res) => {
  try {
    const { contactId, replyMessage } = req.body;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contact.email,
      subject: "Reply to your contact request",
      html: `<h3>Hello ${contact.name},</h3><p>${replyMessage}</p><br/><p>Thank you.</p>`,
    });

    contact.status = "Replied";
    contact.replyMessage = replyMessage;
    await contact.save();

    res.json({
      success: true,
      message: "Reply sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  deleteContact,
  replyToContact,
};