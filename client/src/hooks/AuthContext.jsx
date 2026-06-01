import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chiama il backend per registrare l'attività del giorno e aggiornare la streak
  const syncStreak = async () => {
    try {
      const res = await api.post("/api/users/me/activity");
      setUser((prev) => prev ? { ...prev, ...res.data } : prev);
    } catch {
      // Non bloccante: se fallisce, la streak rimane quella in memoria
    }
  };

  // Al mount: se c'è un token salvato, ricarica il profilo dal backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/api/users/me")
      .then((res) => {
        setUser(res.data);
        // Aggiorna la streak all'apertura dell'app (una volta al giorno)
        return api.post("/api/users/me/activity");
      })
      .then((res) => {
        if (res?.data) {
          setUser((prev) => prev ? { ...prev, ...res.data } : prev);
        }
      })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem("token", token);
    setUser(userData);
    // Aggiorna streak subito dopo il login
    try {
      const streakRes = await api.post("/api/users/me/activity");
      setUser((prev) => prev ? { ...prev, ...streakRes.data } : prev);
    } catch {
      // Non bloccante
    }
  };

  const register = async (name, username, email, password) => {
    const res = await api.post("/api/auth/register", {
      name,
      username,
      email,
      password,
    });
    const { token, user: userData } = res.data;
    localStorage.setItem("token", token);
    setUser({ ...userData, streakDays: 1 }); // primo giorno di streak
    // Registra anche sul backend
    try {
      await api.post("/api/users/me/activity");
    } catch {
      // Non bloccante
    }
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateProfile, syncStreak }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
