const express = require("express");
const router = express.Router();
const {
  getSparks,
  getMySparks,
  getSparkById,
  createSpark,
  deleteSpark,
  addLove,
  removeLove,
  getLovedSparks,
  getUploadSignature,
} = require("../controllers/sparkController");
const authMiddleware = require("../middleware/authmid");

router.get("/me", authMiddleware, getMySparks);
router.get("/me/loved", authMiddleware, getLovedSparks);
router.get("/upload-signature", authMiddleware, getUploadSignature);
router.get("/", getSparks);
router.get("/:id", getSparkById);
router.post("/", authMiddleware, createSpark);
router.delete("/:id", authMiddleware, deleteSpark);
router.post("/:id/love", authMiddleware, addLove);
router.delete("/:id/love", authMiddleware, removeLove);

module.exports = router;
