const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts
} = require("../controllers/productController");

router.post("/add", createProduct);     // Admin
router.get("/list", getProducts);       // User + Admin

module.exports = router;
