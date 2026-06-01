import { useState, useEffect } from "react";
import api from "../api";

export default function SaveToCollectionModal({ spark, onClose }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

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
      if (err.response?.status === 400) {
        setSaved((prev) => ({ ...prev, [collectionId]: true }));
      }
    } finally {
      setSaving(null);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await api.post("/api/collections", { name: newName.trim() });
      const created = res.data;
      setCollections((prev) => [created, ...prev]);
      setNewName("");
      setShowCreateForm(false);
      // Salva automaticamente lo spark nella nuova collezione
      await handleSave(created.id);
    } catch (err) {
      console.error("Errore creazione collezione:", err);
    } finally {
      setCreating(false);
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
        ) : (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {collections.length === 0 && !showCreateForm && (
              <div className="flex flex-col items-center gap-2 py-4 text-white/30">
                <span className="text-3xl">✦</span>
                <p className="text-sm text-center">
                  Non hai ancora collezioni.
                </p>
              </div>
            )}

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

        {/* Form crea nuova collezione */}
        {showCreateForm ? (
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Nome collezione..."
              className="flex-1 bg-white/10 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder:text-white/30 border border-white/10 focus:border-white/30"
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#E8000D] text-white disabled:opacity-40 hover:bg-[#c0000b] transition-colors"
            >
              {creating ? "..." : "Crea"}
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewName("");
              }}
              className="px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/25 transition-all"
          >
            <span className="text-base leading-none">+</span>
            Nuova collezione
          </button>
        )}
      </div>
    </div>
  );
}
