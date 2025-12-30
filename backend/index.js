require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Make sure this path is correct

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(port, async () => {
  await connectDB();
  console.log(`Backend is running on port: ${port}`);
});
