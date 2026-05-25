import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // evita flash di "non loggato"

  // Al mount: se c'è un token salvato, ricarica il profilo dal backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/api/users/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token")) // token scaduto/invalido
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem("token", token); // ← localStorage invece di sessionStorage
    setUser(userData);
  };

  const register = async (name, username, email, password) => {
    const res = await api.post("/api/auth/register", {
      name,
      username,
      email,
      password,
    });
    const { token, user: userData } = res.data;
    localStorage.setItem("token", token); // ← localStorage
    setUser(userData);
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const logout = () => {
    localStorage.removeItem("token"); // ← localStorage
    setUser(null);
  };

  // Mentre controlla il token non mostrare nulla — evita il flash della ProtectedRoute
  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
