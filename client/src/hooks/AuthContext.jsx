import { createContext, useContext, useState } from "react";

// 1. Crea il context (il "contenitore globale")
export const AuthContext = createContext(null);

// 2. AuthProvider: il componente che avvolgerà tutta l'app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = nessuno loggato

  // Per ora fake — quando ci sarà il backend, modifichi solo qui
  const login = (email, password) => {
    setUser({ email, name: email.split("@")[0] });
  };

  const register = (name, username, email) => {
    setUser({ name, username, email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook per leggere il context — questo è ciò che importeranno tutti gli altri
export function useAuth() {
  return useContext(AuthContext);
}
