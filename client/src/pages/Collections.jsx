import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import api from "../api";

function CollectionCover({ sparks = [] }) {
  const slots = Array.from({ length: 4 }, (_, i) => sparks[i] || null);
  return (
    <div className="grid grid-cols-2 gap-0.5 aspect-square rounded-xl overflow-hidden">
      {slots.map((spark, i) =>
        spark ? (
          <img key={i} src={spark.imageUrl || spark.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div key={i} className="w-full h-full bg-white/5" />
        )
      )}
    </div>
  );
}

function CollectionCard({ collection, onClick }) {
  const sparks = collection.Sparks || [];
  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-2 cursor-pointer group"
    >
      <div className="relative overflow-hidden rounded-xl">
        <CollectionCover sparks={sparks} />
        {!collection.isPublic && (
          <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-black/70 text-white/60">
            🔒 Private
          </span>
        )}
      </div>
      <div>
        <p className="text-white text-sm font-semibold group-hover:text-white/80 transition-colors">
          {collection.name}
        </p>
        <p className="text-white/40 text-xs">{sparks.length} spark{sparks.length !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
}

function CollectionModal({ collection, onClose }) {
  const sparks = collection.Sparks || collection.sparks || [];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.06)",
          maxHeight: "85vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h2 className="text-white font-bold text-lg">{collection.name}</h2>
            {collection.description && (
              <p className="text-white/40 text-sm mt-0.5">{collection.description}</p>
            )}
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition text-lg">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {sparks.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-12">No sparks in this collection yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sparks.map((spark) => (
                <img
                  key={spark.id}
                  src={spark.imageUrl || spark.url}
                  alt={spark.title}
                  className="w-full aspect-square object-cover rounded-xl"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateCollectionModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onCreate({ name: name.trim(), description: description.trim(), isPublic });
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
        style={{
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white font-bold text-lg">New collection</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs uppercase tracking-wider">Name <span className="text-[#E8000D]">*</span></label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Portrait references"
            className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs uppercase tracking-wider">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional..."
            rows={2}
            className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 resize-none"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setIsPublic((v) => !v)}
            className={`w-10 h-5 rounded-full transition-colors relative ${isPublic ? "bg-[#E8000D]" : "bg-white/15"}`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                isPublic ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-white/60 text-sm">{isPublic ? "Public" : "Private"}</span>
        </label>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-40"
            style={{ background: "#E8000D" }}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Collections() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    fetchCollections();
  }, [user]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/api/collections");
      setCollections(res.data);
    } catch (err) {
      setError("Could not load collections. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCollection = async (collection) => {
    try {
      setLoadingDetail(true);
      const res = await api.get(`/api/collections/${collection.id}`);
      setSelectedCollection(res.data);
    } catch (err) {
      setSelectedCollection({ ...collection, Sparks: [] });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCreate = async ({ name, description, isPublic }) => {
    try {
      const res = await api.post("/api/collections", { name, description, isPublic });
      setCollections((prev) => [res.data, ...prev]);
    } catch (err) {
      alert("Error creating collection. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/50 text-sm">You need to be logged in to view your collections.</p>
        <button onClick={() => navigate("/login")} className="btn btn-primary btn-sm">
          Go to login
        </button>
      </div>
    );
  }

  const filtered = collections.filter((c) => {
    if (filter === "public") return c.isPublic;
    if (filter === "private") return !c.isPublic;
    return true;
  });

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-2xl">My collections</h1>
            <p className="text-white/40 text-sm mt-0.5">
              {collections.length}{" "}
              {collections.length === 1 ? "collection" : "collections"}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "All" },
            { key: "public", label: "Public" },
            { key: "private", label: "Private" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                filter === key
                  ? "bg-white text-black font-semibold"
                  : "bg-white/8 text-white/50 hover:bg-white/12 hover:text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* States */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="skeleton w-full aspect-square rounded-xl" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-20 text-white/40">
            <span className="text-4xl">⚠︎</span>
            <p className="text-sm">{error}</p>
            <button onClick={fetchCollections} className="btn btn-outline btn-xs border-white/10 text-white/40">
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-white/30">
            <span className="text-5xl">✦</span>
            <p className="text-sm">
              {filter === "all"
                ? "No collections yet. Create one!"
                : "No collections in this category."}
            </p>
            {filter === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-outline btn-xs border-white/10 text-white/40 hover:border-white/30 mt-2"
              >
                Create your first collection
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onClick={() => handleOpenCollection(collection)}
              />
            ))}
          </div>
        )}
      </div>

      {loadingDetail && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <span className="loading loading-spinner loading-md text-white/60" />
        </div>
      )}

      {selectedCollection && (
        <CollectionModal
          collection={selectedCollection}
          onClose={() => setSelectedCollection(null)}
        />
      )}

      {showCreateModal && (
        <CreateCollectionModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
