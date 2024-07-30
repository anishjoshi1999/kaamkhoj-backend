const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./connectDB");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database connection
connectDB(MONGODB_URI);

// Routes
const apiRoute = require("./Routes/apiRoute");
const adminRoute = require("./Routes/adminRoute");

// Public route
app.get("/", (req, res) => {
  try {
    res.json({ message: "Welcome To KaamKhoj API" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API routes
app.use("/api", apiRoute);

// Admin routes
app.use("/admin", adminRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
