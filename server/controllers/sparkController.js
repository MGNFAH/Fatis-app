const Spark = require("../models/Spark");
const User = require("../models/User");
const UserLove = require("../models/userLove");
const cloudinary = require("cloudinary").v2;

// Helper: formato spark uniforme
const formatSpark = (spark) => ({
  id: spark.id,
  title: spark.title,
  url: spark.url || spark.imageUrl,
  imageUrl: spark.url || spark.imageUrl,
  tags: spark.tags || [],
  source: spark.source,
  isPublic: spark.isPublic,
  loveCount: parseInt(spark.dataValues?.loveCount || spark.loveCount || 0),
  createdAt: spark.createdAt,
  User: spark.User
    ? {
        username: spark.User.username,
        avatar: spark.User.avatar,
        level: spark.User.level,
      }
    : null,
});

// GET /api/sparks — feed pubblico
const getSparks = async (req, res) => {
  try {
    const sparks = await Spark.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, attributes: ["username", "avatar", "level"] },
      ],
      attributes: {
        include: [
          [
            Spark.sequelize.literal(
              `(SELECT COUNT(*) FROM "UserLoves" WHERE "UserLoves"."sparkId" = "Spark"."id")`
            ),
            "loveCount",
          ],
        ],
      },
    });
    res.json(sparks.map(formatSpark));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero degli spark" });
  }
};

// GET /api/sparks/me — spark dell'utente loggato
const getMySparks = async (req, res) => {
  try {
    const sparks = await Spark.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, attributes: ["username", "avatar", "level"] },
      ],
      attributes: {
        include: [
          [
            Spark.sequelize.literal(
              `(SELECT COUNT(*) FROM "UserLoves" WHERE "UserLoves"."sparkId" = "Spark"."id")`
            ),
            "loveCount",
          ],
        ],
      },
    });
    res.json(sparks.map(formatSpark));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero degli spark" });
  }
};

// GET /api/sparks/:id — singolo spark
const getSparkById = async (req, res) => {
  try {
    const spark = await Spark.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["username", "avatar", "level"] },
      ],
      attributes: {
        include: [
          [
            Spark.sequelize.literal(
              `(SELECT COUNT(*) FROM "UserLoves" WHERE "UserLoves"."sparkId" = "Spark"."id")`
            ),
            "loveCount",
          ],
        ],
      },
    });
    if (!spark) return res.status(404).json({ error: "Spark non trovato" });
    res.json(formatSpark(spark));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero dello spark" });
  }
};

// POST /api/sparks — crea nuovo spark
const createSpark = async (req, res) => {
  try {
    const { title, url, imageUrl, tags, source, isPublic } = req.body;
    const finalUrl = url || imageUrl;
    if (!finalUrl) {
      return res.status(400).json({ error: "URL immagine obbligatorio" });
    }
    const spark = await Spark.create({
      title: title || "",
      url: finalUrl,
      tags: tags || [],
      source: source || "",
      isPublic: isPublic !== undefined ? isPublic : true,
      userId: req.user.id,
    });
    res.status(201).json(formatSpark(spark));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nella creazione dello spark" });
  }
};

// DELETE /api/sparks/:id — elimina spark
const deleteSpark = async (req, res) => {
  try {
    const spark = await Spark.findByPk(req.params.id);
    if (!spark) return res.status(404).json({ error: "Spark non trovato" });
    if (spark.userId !== req.user.id) {
      return res.status(403).json({ error: "Non autorizzato" });
    }
    await spark.destroy();
    res.json({ message: "Spark eliminato" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nell'eliminazione dello spark" });
  }
};

// POST /api/sparks/:id/love — aggiungi love
const addLove = async (req, res) => {
  try {
    const spark = await Spark.findByPk(req.params.id);
    if (!spark) return res.status(404).json({ error: "Spark non trovato" });
    const existing = await UserLove.findOne({
      where: { userId: req.user.id, sparkId: spark.id },
    });
    if (existing) {
      return res.status(400).json({ error: "Hai già amato questo spark" });
    }
    await UserLove.create({ userId: req.user.id, sparkId: spark.id });
    res.status(201).json({ message: "Love aggiunto" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nell'aggiunta del love" });
  }
};

// DELETE /api/sparks/:id/love — rimuovi love
const removeLove = async (req, res) => {
  try {
    const love = await UserLove.findOne({
      where: { userId: req.user.id, sparkId: req.params.id },
    });
    if (!love) return res.status(404).json({ error: "Love non trovato" });
    await love.destroy();
    res.json({ message: "Love rimosso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nella rimozione del love" });
  }
};

// GET /api/sparks/me/loved — spark che l'utente ha amato
const getLovedSparks = async (req, res) => {
  try {
    const loves = await UserLove.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Spark,
          include: [{ model: User, attributes: ["username", "avatar", "level"] }],
          attributes: {
            include: [
              [
                Spark.sequelize.literal(
                  `(SELECT COUNT(*) FROM "UserLoves" WHERE "UserLoves"."sparkId" = "Spark"."id")`
                ),
                "loveCount",
              ],
            ],
          },
        },
      ],
    });
    res.json(loves.map((l) => formatSpark(l.Spark)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero degli spark amati" });
  }
};

// GET /api/sparks/upload-signature — firma Cloudinary per upload diretto
const getUploadSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = `sparks/${req.user.id}`;
    const paramsToSign = { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );
    res.json({
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nella generazione della firma" });
  }
};

module.exports = {
  getSparks,
  getMySparks,
  getSparkById,
  createSpark,
  deleteSpark,
  addLove,
  removeLove,
  getLovedSparks,
  getUploadSignature,
};
