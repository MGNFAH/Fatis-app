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

// Origini autorizzate: frontend locale + produzione su Render
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // es. https://fatis-app.onrender.com
].filter(Boolean); // rimuove undefined se CLIENT_URL non è impostato

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Permetti richieste senza origin (es. Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origine non autorizzata dal CORS"));
      }
    },
    credentials: true, // necessario per Authorization header
  }),
);
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const sparkRoutes = require("./routes/sparks");
const collectionRoutes = require("./routes/collections");
const userRoutes = require("./routes/users");

app.use("/api/auth", authRoutes);
app.use("/api/sparks", sparkRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/users", userRoutes);

// Route di test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Fatis funzionante!" });
});

// Connessione DB e avvio server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
      console.log(`Server Fatis running on port ${PORT}`);
    });
  });
});
