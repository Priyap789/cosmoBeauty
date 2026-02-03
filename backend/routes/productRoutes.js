const express = require("express");
const multer = require("multer");
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductCount, // <-- import
} = require("../controllers/productController");

const router = express.Router();

// Multer config...
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), addProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// ✅ New route
router.get("/count", getProductCount);

module.exports = router;



