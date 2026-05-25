require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { connectDB, sequelize } = require("./config/db");

// Importa tutti i models per registrarli
require("./models/User");
require("./models/Spark");
require("./models/Collection");
require("./models/userLove");
require("./models/collectionSpark");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const sparkRoutes = require("./routes/sparks");
const collectionRoutes = require("./routes/collections");
const userRoutes = require("./routes/users"); // ← NUOVO

app.use("/api/auth", authRoutes);
app.use("/api/sparks", sparkRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/users", userRoutes); // ← NUOVO

// Route di test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Fatis funzionante!" });
});

// Connessione DB e avvio server
const PORT = process.env.PORT || 3001;
connectDB().then(() => {
  sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
      console.log(`Server Fatis running on port ${PORT}`);
    });
  });
});
