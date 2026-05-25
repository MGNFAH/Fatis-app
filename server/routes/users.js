const express = require("express");
const router = express.Router();
const { getMe, updateMe } = require("../controllers/userController");
const authMiddleware = require("../middleware/authmid");

// Entrambe le route richiedono il token JWT
router.get("/me", authMiddleware, getMe); // GET  /api/users/me
router.put("/me", authMiddleware, updateMe); // PUT  /api/users/me

module.exports = router;
