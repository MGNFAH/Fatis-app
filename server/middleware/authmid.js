const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token mancante" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // l'utente loggato è ora disponibile in tutti i controller
    next();
  } catch (error) {
    res.status(401).json({ error: "Token non valido" });
  }
};

module.exports = authMiddleware;
