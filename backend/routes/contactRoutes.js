const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  replyToContact,
} = require("../controllers/contactController");

router.post("/contactus", createContact);
router.get("/admin/contacts", getAllContacts);
router.post("/admin/reply", replyToContact);

module.exports = router;
