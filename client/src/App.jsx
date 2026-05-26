import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import ImageModal from "./components/ImageModal";
import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from "react";
import { AuthProvider } from "./hooks/AuthContext";
import Register from "./pages/Register";
import Collections from "./pages/Collections";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [sparkCount, setSparkCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [allSparks, setAllSparks] = useState([]); 
  return (
    <AuthProvider>
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

        {/* Modale globale — accessibile da ovunque */}
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            allImages={allSparks}
          />
        )}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
