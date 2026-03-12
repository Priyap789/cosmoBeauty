const express = require("express");
const router = express.Router();

const {
  createContact,
  getAllContacts,
  replyToContact,
  deleteContact,
} = require("../controllers/contactController");

// Public
router.post("/contactus", createContact);

// Admin
router.get("/admin/contacts", getAllContacts);
router.post("/admin/reply", replyToContact);
router.delete("/admin/:contactId", deleteContact);

module.exports = router;