import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import ImageModal from "./components/ImageModal";
import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from "react";
import { fakeImages } from "./data/placeholderImages";
import { AuthProvider } from "./hooks/AuthContext";
import Register from "./pages/Register";
function App() {
  const [sparkCount, setSparkCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

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
                allImages={fakeImages}
              />
            }
          />
          <Route path="/explore" element={<Explore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        {/* Modale globale — accessibile da ovunque */}
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            allImages={fakeImages} // ← era "images", ora "placeholderImages"
          />
        )}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
