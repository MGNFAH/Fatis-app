const Spark = require("../models/Spark");
const UserLove = require("../models/userLove");

// READ - Tutti gli spark (feed pubblico)
const getSparks = async (req, res) => {
  try {
    const sparks = await Spark.findAll({
      order: [["createdAt", "DESC"]], // i più recenti prima
    });
    res.json(sparks);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero degli spark" });
  }
};

// READ - Solo gli spark dell'utente loggato
const getMySparks = async (req, res) => {
  try {
    const sparks = await Spark.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(sparks);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero degli spark" });
  }
};

// READ - Singolo spark per ID
const getSparkById = async (req, res) => {
  try {
    const spark = await Spark.findByPk(req.params.id);

    if (!spark) {
      return res.status(404).json({ error: "Spark non trovato" });
    }

    res.json(spark);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dello spark" });
  }
};

// CREATE - Carica un nuovo spark
const createSpark = async (req, res) => {
  try {
    const { imageUrl, source, tags } = req.body;

    // REGOLA: l'immagine è obbligatoria
    if (!imageUrl) {
      return res.status(400).json({ error: "L'immagine è obbligatoria" });
    }

    const spark = await Spark.create({
      imageUrl,
      source,
      tags: tags || [],
      userId: req.user.id, // sempre dall'utente loggato, mai dal client
    });

    res.status(201).json(spark);
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

    // REGOLA: solo il proprietario può eliminarlo
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

    // REGOLA: non puoi mettere love due volte
    const existing = await UserLove.findOne({
      where: { userId: req.user.id, sparkId: req.params.id },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "Hai già messo love a questo spark" });
    }

    await UserLove.create({ userId: req.user.id, sparkId: req.params.id });
    res.status(201).json({ message: "Love aggiunto!" });
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
    res.json({ message: "Love rimosso" });
  } catch (error) {
    res.status(500).json({ error: "Errore nella rimozione del love" });
  }
};

// Tutti gli spark che l'utente ha amato
const getLovedSparks = async (req, res) => {
  try {
    const loves = await UserLove.findAll({
      where: { userId: req.user.id },
      include: [Spark],
    });
    res.json(loves.map((l) => l.Spark));
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero degli spark amati" });
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
};
