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
