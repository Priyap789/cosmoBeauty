// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db"); // Make sure this path is correct

// const app = express();
// const port = process.env.PORT || 8000;

// app.use(cors());
// app.use(express.json());
// app.use("/api/auth", require("./routes/authRoutes"));


// app.listen(port, async () => {
//   await connectDB();
//   console.log(`Backend is running on port: ${port}`);
// });


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔹 Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

//app.use("/admin", require("./routes/adminAuthRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
//app.use("/api/admin", require("./routes/adminRoutes"));

// Start server and connect to DB
app.listen(port, async () => {
  await connectDB();
  console.log(`Backend running on port ${port}`);
});


