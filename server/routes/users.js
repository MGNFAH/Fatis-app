const express = require("express");
const router = express.Router();
const { getMe, updateMe, recordActivity } = require("../controllers/userController");
const authMiddleware = require("../middleware/authmid");

router.get("/me", authMiddleware, getMe);                     // GET  /api/users/me
router.put("/me", authMiddleware, updateMe);                  // PUT  /api/users/me
router.post("/me/activity", authMiddleware, recordActivity);  // POST /api/users/me/activity

module.exports = router;
