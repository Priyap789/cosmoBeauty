const express = require("express");
const multer = require("multer");
const {
  addProduct,
  getProducts,
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

// ADD PRODUCT
router.post("/", upload.single("image"), addProduct);

// GET ALL PRODUCTS
router.get("/", getProducts);

// 🔥 GET PRODUCT BY ID (REQUIRED FOR PRODUCT DETAIL PAGE)
router.get("/:id", getProductById);

// UPDATE PRODUCT
router.put("/:id", upload.single("image"), updateProduct);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

module.exports = router;
