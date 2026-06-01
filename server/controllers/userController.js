const User = require("../models/User");

// Helper: calcola e aggiorna la streak dell'utente
// Logica:
//   - Se lastActiveDate è oggi → streak invariata (già aggiornata oggi)
//   - Se lastActiveDate è ieri  → streak + 1
//   - Altrimenti                → streak reset a 1 (nuovo inizio)
async function updateStreak(user) {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const last = user.lastActiveDate; // stringa "YYYY-MM-DD" o null

  if (last === today) {
    // Già aggiornata oggi, non fare nulla
    return;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const newStreak = last === yesterday ? user.streakDays + 1 : 1;
  await user.update({ streakDays: newStreak, lastActiveDate: today });
}

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "name",
        "username",
        "email",
        "avatar",
        "bio",
        "level",
        "streakDays",
        "lastActiveDate",
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero del profilo" });
  }
};

// POST /api/users/me/activity  — chiamata al login/apertura app
// Aggiorna la streak e restituisce i dati aggiornati
const recordActivity = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    await updateStreak(user);

    res.json({
      streakDays: user.streakDays,
      lastActiveDate: user.lastActiveDate,
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento della streak" });
  }
};

// PUT /api/users/me
const updateMe = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

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
      streakDays: user.streakDays,
      lastActiveDate: user.lastActiveDate,
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento del profilo" });
  }
};

module.exports = { getMe, updateMe, recordActivity };
