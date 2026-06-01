import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import ImageModal from "./components/ImageModal";
import { BrowserRouter, Routes, Route } from "react-router";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import Register from "./pages/Register";
import Collections from "./pages/Collections";
import ProtectedRoute from "./components/ProtectedRoute";
import api from "./api";

// Componente interno separato per poter usare useAuth (che richiede AuthProvider sopra di lui)
function AppContent() {
  const [sparkCount, setSparkCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [allSparks, setAllSparks] = useState([]);
  const { user } = useAuth();

  // Carica il conteggio reale dei love dell'utente dal backend
  useEffect(() => {
    if (!user) {
      setSparkCount(0);
      return;
    }
    api
      .get("/api/sparks/me/loves/count")
      .then((res) => setSparkCount(res.data.loveCount ?? 0))
      .catch((err) =>
        console.error("Errore nel caricamento del conteggio love:", err)
      );
  }, [user]);

  return (
    <BrowserRouter>
      <Navbar sparkCount={sparkCount} onSelectImage={setSelectedImage} />

      <CategoryBar />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onSpark={() => setSparkCount((c) => c + 1)}
              onSelectImage={setSelectedImage}
              onSparksFetched={setAllSparks}
            />
          }
        />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections"
          element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          allImages={allSparks}
        />
      )}
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
