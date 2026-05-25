import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Login fake — da sostituire con chiamata API reale
  const login = (email, password) => {
    setUser({
      email,
      name: email.split("@")[0],
      username: email.split("@")[0],
      bio: "",
      avatar: null,
      sparkCount: 0,
      loveCount: 0,
      collectionCount: 0,
    });
  };

  // Register fake — da sostituire con chiamata API reale
  const register = (name, username, email) => {
    setUser({
      name,
      username,
      email,
      bio: "",
      avatar: null,
      sparkCount: 0,
      loveCount: 0,
      collectionCount: 0,
    });
  };

  // Aggiorna solo i campi del profilo (nome, bio, avatar)
  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
