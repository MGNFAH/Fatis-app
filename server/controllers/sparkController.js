const Spark = require("../models/Spark");
const UserLove = require("../models/userLove");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const { sequelize } = require("../config/db");
const { fn, col, literal } = require("sequelize");

// Formatta uno spark arricchendolo con il conteggio reale dei love
const formatSpark = (spark, lovedByUserId = null) => {
  const loves = parseInt(spark.dataValues.loveCount ?? 0, 10);
  const isLoved = spark.dataValues.isLoved ?? false;

  return {
    id: spark.id,
    url: spark.imageUrl,
    imageUrl: spark.imageUrl,
    title: spark.title || "Senza titolo",
    caption: spark.caption || "",
    category: spark.category || "",
    source: spark.source || "",
    tags: spark.tags || [],
    loves,
    isLoved,
    views: 0,
    trending: loves >= 1000,
    comments: [],
    author: spark.User?.username || "anonymous",
    avatar:
      spark.User?.avatar ||
      `https://picsum.photos/seed/${spark.User?.username || "anonymous"}/64/64`,
    authorLevel: spark.User?.level || 1,
    userId: spark.userId,
    createdAt: spark.createdAt,
  };
};

// Helper: carica tutti gli spark con conteggio love reale
async function fetchSparksWithLoves(where = {}, userId = null) {
  const sparks = await Spark.findAll({
    where,
    order: [["createdAt", "DESC"]],
    attributes: {
      include: [
        [
          literal(
            `(SELECT COUNT(*) FROM "UserLoves" WHERE "UserLoves"."sparkId" = "Spark"."id")`
          ),
          "loveCount",
        ],
        userId
          ? [
              literal(
                `(SELECT COUNT(*) FROM "UserLoves" WHERE "UserLoves"."sparkId" = "Spark"."id" AND "UserLoves"."userId" = ${userId})`
              ),
              "isLoved",
            ]
          : [literal("0"), "isLoved"],
      ],
    },
    include: [{ model: User, attributes: ["username", "avatar", "level"] }],
  });

  return sparks.map((s) => {
    s.dataValues.isLoved = parseInt(s.dataValues.isLoved, 10) > 0;
    return formatSpark(s, userId);
  });
}

// READ - Tutti gli spark (feed pubblico)
const getSparks = async (req, res) => {
  try {
    const userId = req.user?.id ?? null;
    const sparks = await fetchSparksWithLoves({}, userId);
    res.json(sparks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero degli spark" });
  }
};

// READ - Solo gli spark dell'utente loggato
const getMySparks = async (req, res) => {
  try {
    const sparks = await fetchSparksWithLoves(
      { userId: req.user.id },
      req.user.id
    );
    res.json(sparks);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero degli spark" });
  }
};

// READ - Singolo spark per ID
const getSparkById = async (req, res) => {
  try {
    const userId = req.user?.id ?? null;
    const sparks = await fetchSparksWithLoves(
      { id: req.params.id },
      userId
    );
    if (!sparks.length)
      return res.status(404).json({ error: "Spark non trovato" });
    res.json(sparks[0]);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dello spark" });
  }
};

// CREATE - Carica un nuovo spark
const createSpark = async (req, res) => {
  try {
    const { imageUrl, source, tags, title, caption, category } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "L'immagine è obbligatoria" });
    }

    const spark = await Spark.create({
      imageUrl,
      title,
      caption,
      category,
      source,
      tags: tags || [],
      userId: req.user.id,
    });

    const sparks = await fetchSparksWithLoves({ id: spark.id }, req.user.id);
    res.status(201).json(sparks[0]);
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione dello spark" });
  }
};

// DELETE - Elimina uno spark
const deleteSpark = async (req, res) => {
  try {
    const spark = await Spark.findByPk(req.params.id);

    if (!spark) {
      return res.status(404).json({ error: "Spark non trovato" });
    }

    if (spark.userId !== req.user.id) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    await spark.destroy();
    res.json({ message: "Spark eliminato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'eliminazione dello spark" });
  }
};

// ---- LOVE ----

// Aggiungi love
const addLove = async (req, res) => {
  try {
    const spark = await Spark.findByPk(req.params.id);

    if (!spark) {
      return res.status(404).json({ error: "Spark non trovato" });
    }

    const existing = await UserLove.findOne({
      where: { userId: req.user.id, sparkId: req.params.id },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "Hai già messo love a questo spark" });
    }

    await UserLove.create({ userId: req.user.id, sparkId: req.params.id });

    const count = await UserLove.count({ where: { sparkId: req.params.id } });
    res.status(201).json({ message: "Love aggiunto!", loves: count, isLoved: true });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiunta del love" });
  }
};

// Rimuovi love
const removeLove = async (req, res) => {
  try {
    const love = await UserLove.findOne({
      where: { userId: req.user.id, sparkId: req.params.id },
    });

    if (!love) {
      return res.status(404).json({ error: "Love non trovato" });
    }

    await love.destroy();

    const count = await UserLove.count({ where: { sparkId: req.params.id } });
    res.json({ message: "Love rimosso", loves: count, isLoved: false });
  } catch (error) {
    res.status(500).json({ error: "Errore nella rimozione del love" });
  }
};

// Firma Cloudinary
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

// Tutti gli spark che l'utente ha amato
const getLovedSparks = async (req, res) => {
  try {
    const loves = await UserLove.findAll({
      where: { userId: req.user.id },
      attributes: ["sparkId"],
    });
    const sparkIds = loves.map((l) => l.sparkId);
    if (!sparkIds.length) return res.json([]);

    const { Op } = require("sequelize");
    const sparks = await fetchSparksWithLoves(
      { id: { [Op.in]: sparkIds } },
      req.user.id
    );
    res.json(sparks);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero degli spark amati" });
  }
};

// Conteggio totale dei love dati dall'utente loggato (per la LoveGauge)
const getMyLoveCount = async (req, res) => {
  try {
    const count = await UserLove.count({
      where: { userId: req.user.id },
    });
    res.json({ loveCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel conteggio dei love" });
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
  getMyLoveCount,
};
