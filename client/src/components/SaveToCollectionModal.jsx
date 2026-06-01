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
      await handleSave(created.id);
    } catch (err) {
      console.error("Error creating collection:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.08)",
          maxHeight: "70vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-white font-semibold text-base">Save to collection</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition text-lg leading-none">
            ✕
          </button>
        </div>

        {/* Spark preview */}
        <div
          className="flex items-center gap-3 px-5 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <img
            src={spark.url || spark.imageUrl}
            alt={spark.title}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
          />
          <p className="text-white/70 text-sm font-medium truncate">
            {spark.title || "Untitled Spark"}
          </p>
        </div>

        {/* Collection list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1.5">
          {loading ? (
            <div className="flex flex-col gap-2 px-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-12 rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {collections.length === 0 && !showCreateForm && (
                <div className="flex flex-col items-center gap-2 py-6 text-white/30">
                  <span className="text-3xl">✦</span>
                  <p className="text-sm">You have no collections yet.</p>
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
                  <span>📁 {col.name}</span>
                  <span className="text-xs">
                    {saving === col.id ? "..." : saved[col.id] ? "✓ Saved" : "Save"}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Create new collection */}
        <div
          className="px-3 pb-3 pt-2 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {showCreateForm ? (
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Collection name..."
                className="flex-1 bg-white/10 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder:text-white/30 border border-white/10 focus:border-white/30"
              />
              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                style={{ background: "#E8000D" }}
              >
                {creating ? "..." : "Create"}
              </button>
              <button
                onClick={() => { setShowCreateForm(false); setNewName(""); }}
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
              <span className="text-lg leading-none">+</span> New collection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
