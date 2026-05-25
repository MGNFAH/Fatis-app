const User = require("../models/User");

// GET /api/users/me — legge il profilo dell'utente loggato
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "username", "email", "avatar", "bio", "level"],
    });

    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero del profilo" });
  }
};

// PUT /api/users/me — aggiorna nome, bio e avatar
const updateMe = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    // Aggiorna solo i campi inviati — se un campo non è nel body, rimane invariato
    await user.update({
      ...(name !== undefined && { name }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
    });

    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento del profilo" });
  }
};

module.exports = { getMe, updateMe };
