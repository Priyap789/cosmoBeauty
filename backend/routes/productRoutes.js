const express = require("express");
const multer = require("multer");
const {
  addProduct,
  getProducts,
  getOfferProducts,   // 🔥 NEW
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

// 🔥 CREATE PRODUCT
router.post("/", upload.array("images", 5), addProduct);

// 🔥 GET ALL PRODUCTS
router.get("/", getProducts);

// 🔥 GET OFFER PRODUCTS ONLY  (IMPORTANT: ABOVE :id)
router.get("/offers", getOfferProducts);

// 🔥 GET PRODUCT BY ID
router.get("/:id", getProductById);

// 🔥 UPDATE PRODUCT
router.put("/:id", upload.array("images", 5), updateProduct);

// 🔥 DELETE PRODUCT
router.delete("/:id", deleteProduct);

module.exports = router;
