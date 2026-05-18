const Collection = require("../models/Collection");
const CollectionSpark = require("../models/CollectionSpark");
const Spark = require("../models/Spark");

// READ - Tutte le collezioni dell'utente loggato
const getMyCollections = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero delle collezioni" });
  }
};

// READ - Singola collezione con tutti i suoi spark
const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: "Collezione non trovata" });
    }

    // REGOLA: solo il proprietario può vedere una collezione
    if (collection.userId !== req.user.id) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    // Recupera gli spark collegati
    const collectionSparks = await CollectionSpark.findAll({
      where: { collectionId: collection.id },
      include: [Spark],
    });

    res.json({
      ...collection.toJSON(),
      sparks: collectionSparks.map((cs) => cs.Spark),
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero della collezione" });
  }
};

// CREATE - Crea una nuova collezione
const createCollection = async (req, res) => {
  try {
    const { name, description, coverImage } = req.body;

    // REGOLA: il nome è obbligatorio
    if (!name) {
      return res
        .status(400)
        .json({ error: "Il nome della collezione è obbligatorio" });
    }

    const collection = await Collection.create({
      name,
      description,
      coverImage,
      userId: req.user.id,
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione della collezione" });
  }
};

// UPDATE - Modifica nome/descrizione di una collezione
const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: "Collezione non trovata" });
    }

    // REGOLA: solo il proprietario può modificarla
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

// DELETE - Elimina una collezione
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: "Collezione non trovata" });
    }

    // REGOLA: solo il proprietario può eliminarla
    if (collection.userId !== req.user.id) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    // Elimina prima i collegamenti, poi la collezione
    await CollectionSpark.destroy({ where: { collectionId: collection.id } });
    await collection.destroy();

    res.json({ message: "Collezione eliminata con successo" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Errore nell'eliminazione della collezione" });
  }
};

// ---- SPARK DENTRO UNA COLLEZIONE ----

// Aggiungi uno spark a una collezione
const addSparkToCollection = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: "Collezione non trovata" });
    }

    // REGOLA: solo il proprietario può aggiungere spark
    if (collection.userId !== req.user.id) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    const spark = await Spark.findByPk(req.params.sparkId);
    if (!spark) {
      return res.status(404).json({ error: "Spark non trovato" });
    }

    // REGOLA: lo spark non può essere aggiunto due volte
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

// Rimuovi uno spark da una collezione
const removeSparkFromCollection = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: "Collezione non trovata" });
    }

    // REGOLA: solo il proprietario può rimuovere spark
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
