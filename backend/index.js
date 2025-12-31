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
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Start server and connect to DB
app.listen(port, async () => {
  await connectDB();
  console.log(`Backend running on port ${port}`);
});
