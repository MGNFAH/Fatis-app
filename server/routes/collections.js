const express = require("express");
const router = express.Router();
const {
  getMyCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  addSparkToCollection,
  removeSparkFromCollection,
} = require("../controllers/collectionController");
const authMiddleware = require("../middleware/authmid");

router.use(authMiddleware);

router.get("/", getMyCollections);
router.get("/:id", getCollectionById);
router.post("/", createCollection);
router.put("/:id", updateCollection);
router.delete("/:id", deleteCollection);
router.post("/:id/sparks/:sparkId", addSparkToCollection);
router.delete("/:id/sparks/:sparkId", removeSparkFromCollection);

module.exports = router;
