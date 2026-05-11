import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  // Avviso se qualcuno usa useAuth fuori dall'AuthProvider
  if (!context) {
    throw new Error("useAuth deve essere usato dentro <AuthProvider>");
  }

  return context;
}
