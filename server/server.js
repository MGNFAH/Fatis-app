require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { connectDB, sequelize } = require("./config/db");
  require("./models/Item");

 
// Connect to database
 connectDB().then(() => sequelize.sync());
 const app = express();


// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
