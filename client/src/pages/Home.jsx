import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { FaFire } from "react-icons/fa";
import MasonryGrid from "../components/MasonryGrid";
import CreateSparkModal from "../components/CreateSparkModal";
import { useAuth } from "../hooks/useAuth";
import api from "../api";

export default function Home({ onSpark, onSelectImage }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Carica gli spark dal backend al mount
  useEffect(() => {
    api
      .get("/api/sparks")
      .then((res) => setImages(res.data))
      .catch((err) => console.error("Errore caricamento spark:", err))
      .finally(() => setLoading(false));
  }, []);

  // Apri spark da URL (es. ?spark=123)
  useEffect(() => {
    const sparkId = searchParams.get("spark");
    if (sparkId && images.length) {
      const spark = images.find((img) => String(img.id) === sparkId);
      if (spark) {
        onSelectImage(spark);
        setSearchParams({});
      }
    }
  }, [images]);

  const handleFAB = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowCreateModal(true);
  };

  // Lo spark arriva già dal DB con id reale
  const handlePublish = (newSpark) => {
    setImages((prev) => [newSpark, ...prev]);
    if (onSpark) onSpark();
  };

  return (
    <main className="relative">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-white/30 text-sm">Caricamento spark...</span>
        </div>
      ) : (
        <MasonryGrid
          images={images}
          onSpark={onSpark}
          onSelectImage={onSelectImage}
        />
      )}

      <button
        onClick={handleFAB}
        className="fixed bottom-8 right-8 flex items-center gap-2 px-5 py-3.5 rounded-full text-white font-bold text-sm shadow-2xl z-40"
        style={{
          background: "#E8000D",
          boxShadow: "0 8px 32px rgba(232,0,13,0.45)",
          animation: "fabFloat 3s ease-in-out infinite",
        }}
      >
        <FaFire size={15} />
        Crea Spark
      </button>

      <style>{`
        @keyframes fabFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {showCreateModal && (
        <CreateSparkModal
          onClose={() => setShowCreateModal(false)}
          onPublish={handlePublish}
        />
      )}
    </main>
  );
}
