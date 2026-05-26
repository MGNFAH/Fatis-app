import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api";

export default function SaveToCollectionModal({ spark, onClose }) {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // id collezione in corso
  const [saved, setSaved] = useState({}); // { [collectionId]: true }

  useEffect(() => {
    api
      .get("/api/collections")
      .then((res) => setCollections(res.data))
      .catch(() => setCollections([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (collectionId) => {
    if (saved[collectionId]) return;
    setSaving(collectionId);
    try {
      await api.post(`/api/collections/${collectionId}/sparks/${spark.id}`);
      setSaved((prev) => ({ ...prev, [collectionId]: true }));
    } catch (err) {
      // 400 = già presente → segna comunque come saved
      if (err.response?.status === 400) {
        setSaved((prev) => ({ ...prev, [collectionId]: true }));
      }
    } finally {
      setSaving(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-5 flex flex-col gap-4"
        style={{ background: "#111" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-base">
            Salva in collezione
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Preview spark */}
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-2.5">
          <img
            src={spark.url || spark.imageUrl}
            alt={spark.title}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
          <p className="text-white/60 text-xs truncate">
            {spark.title || "Spark senza titolo"}
          </p>
        </div>

        {/* Lista collezioni */}
        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6 text-white/30">
            <span className="text-3xl">✦</span>
            <p className="text-sm text-center">Non hai ancora collezioni.</p>
            <button
              onClick={() => {
                onClose();
                navigate("/collections");
              }}
              className="text-xs text-white/50 underline hover:text-white/80 transition-colors"
            >
              Crea la tua prima collezione →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => handleSave(col.id)}
                disabled={saving === col.id}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                  saved[col.id]
                    ? "bg-[#E8000D]/15 text-[#E8000D]"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="truncate font-medium">{col.name}</span>
                <span className="flex-shrink-0 ml-2 text-xs">
                  {saving === col.id
                    ? "..."
                    : saved[col.id]
                      ? "✓ Salvato"
                      : "Salva"}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
