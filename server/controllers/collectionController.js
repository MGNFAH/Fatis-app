const Collection = require("../models/Collection");
const CollectionSpark = require("../models/collectionSpark");
const Spark = require("../models/Spark");

// GET /api/collections — tutte le collezioni dell'utente loggato
const getMyCollections = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: CollectionSpark,
          include: [{ model: Spark }],
        },
      ],
    });

    // Normalizza: mappa gli spark in un array piatto con chiave "Sparks"
    const result = collections.map((col) => ({
      ...col.toJSON(),
      Sparks: col.CollectionSparks?.map((cs) => cs.Spark) || [],
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero delle collezioni" });
  }
};

// GET /api/collections/:id — singola collezione con i suoi spark
const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: "Collezione non trovata" });
    }

    // Privata → solo il proprietario la vede
    // Pubblica → chiunque può vederla
    if (!collection.isPublic && collection.userId !== req.user.id) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    const collectionSparks = await CollectionSpark.findAll({
      where: { collectionId: collection.id },
      include: [{ model: Spark }],
    });

    res.json({
      ...collection.toJSON(),
      Sparks: collectionSparks.map((cs) => cs.Spark),
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero della collezione" });
  }
};

// POST /api/collections — crea una nuova collezione
const createCollection = async (req, res) => {
  try {
    const { name, description, coverImage, isPublic } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ error: "Il nome della collezione è obbligatorio" });
    }

    const collection = await Collection.create({
      name,
      description,
      coverImage,
      isPublic: isPublic !== undefined ? isPublic : true,
      userId: req.user.id,
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione della collezione" });
  }
};

// PUT /api/collections/:id — modifica nome/descrizione/visibilità
const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: "Collezione non trovata" });
    }

    if (collection.userId !== req.user.id) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    await collection.update(req.body);
    res.json(collection);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Errore nell'aggiornamento della collezione" });
  }
};

// DELETE /api/collections/:id
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: "Collezione non trovata" });
    }

    if (collection.userId !== req.user.id) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    await CollectionSpark.destroy({ where: { collectionId: collection.id } });
    await collection.destroy();

    res.json({ message: "Collezione eliminata con successo" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Errore nell'eliminazione della collezione" });
  }
};

// POST /api/collections/:id/sparks/:sparkId
const addSparkToCollection = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: "Collezione non trovata" });
    }

    if (collection.userId !== req.user.id) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    const spark = await Spark.findByPk(req.params.sparkId);
    if (!spark) {
      return res.status(404).json({ error: "Spark non trovato" });
    }

    const existing = await CollectionSpark.findOne({
      where: { collectionId: collection.id, sparkId: spark.id },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "Spark già presente in questa collezione" });
    }

    await CollectionSpark.create({
      collectionId: collection.id,
      sparkId: spark.id,
    });

    res.status(201).json({ message: "Spark aggiunto alla collezione!" });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiunta dello spark" });
  }
};

// DELETE /api/collections/:id/sparks/:sparkId
const removeSparkFromCollection = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: "Collezione non trovata" });
    }

    if (collection.userId !== req.user.id) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    const link = await CollectionSpark.findOne({
      where: { collectionId: collection.id, sparkId: req.params.sparkId },
    });

    if (!link) {
      return res
        .status(404)
        .json({ error: "Spark non trovato in questa collezione" });
    }

    await link.destroy();
    res.json({ message: "Spark rimosso dalla collezione" });
  } catch (error) {
    res.status(500).json({ error: "Errore nella rimozione dello spark" });
  }
};

module.exports = {
  getMyCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  addSparkToCollection,
  removeSparkFromCollection,
};
