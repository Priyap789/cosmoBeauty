const express = require("express");
const router = express.Router();
const SubCategory = require("../models/SubCategory");

// Create SubCategory
router.post("/", async (req, res) => {
  try {
    const subCategory = new SubCategory(req.body);
    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All SubCategories with Category info
router.get("/", async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("category", "name");
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
