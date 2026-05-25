import { createContext, useContext, useState } from "react";
import api from "../api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // POST /api/auth/login
    const res = await api.post("/api/auth/login", { email, password });
    const { token, user: userData } = res.data;
    sessionStorage.setItem("token", token);
    setUser(userData);
  };

  const register = async (name, username, email, password) => {
    // POST /api/auth/register
    const res = await api.post("/api/auth/register", {
      name,
      username,
      email,
      password,
    });
    const { token, user: userData } = res.data;
    sessionStorage.setItem("token", token);
    setUser(userData);
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

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
