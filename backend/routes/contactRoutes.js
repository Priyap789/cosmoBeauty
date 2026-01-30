const express = require("express");
const router = express.Router();
const { createContact } = require("../controllers/contactController");

router.post("/contactus", createContact);

module.exports = router;
