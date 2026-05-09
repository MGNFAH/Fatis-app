import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import ImageModal from "./components/ImageModal";
import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from "react";

function App() {
  const [sparkCount, setSparkCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

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
            />
          }
        />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Modale globale — accessibile da ovunque */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          allImages={images}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
