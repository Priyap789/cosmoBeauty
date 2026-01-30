const express = require("express");
const router = express.Router();
const { adminLogin, adminDashboard } = require("../controllers/adminAuthController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

router.post("/login", adminLogin);
router.get("/dashboard", adminAuthMiddleware, adminDashboard);

module.exports = router;
