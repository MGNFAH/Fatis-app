import { useState } from "react";
import { useNavigate } from "react-router";
import { FaFire } from "react-icons/fa";
import MasonryGrid from "../components/MasonryGrid";
import CreateSparkModal from "../components/CreateSparkModal";
import { useAuth } from "../hooks/useAuth";
import { fakeImages } from "../data/placeholderImages";

export default function Home({ onSpark, onSelectImage }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [images, setImages] = useState(fakeImages);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleFAB = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowCreateModal(true);
  };

  const handlePublish = (newSpark) => {
    const sparkToInsert = {
      ...newSpark,
      author: user?.username || user?.name || "anonymous",
      avatar: `https://picsum.photos/seed/${user?.username || user?.name || "anonymous"}/64/64`,
      url: newSpark.url,
      views: 0,
      loves: 0,
      trending: false,
      comments: [],
      location: user?.location || "",
    };

    setImages((prev) => [sparkToInsert, ...prev]);
  };

  return (
    <main className="relative">
      <MasonryGrid
        images={images}
        onSpark={onSpark}
        onSelectImage={onSelectImage}
      />

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
