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
} = require("../controllers/sparkController");
const authMiddleware = require("../middleware/authmid");

router.use(authMiddleware);

router.get("/", getSparks);
router.get("/me", getMySparks);
router.get("/me/loved", getLovedSparks);
router.get("/:id", getSparkById);
router.post("/", createSpark);
router.delete("/:id", deleteSpark);
router.post("/:id/love", addLove);
router.delete("/:id/love", removeLove);

module.exports = router;
