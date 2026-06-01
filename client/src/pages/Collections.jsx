import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import api from "../api";

// ── CollectionCover ──────────────────────────────────────────────────────────
function CollectionCover({ sparks = [] }) {
  const slots = Array.from({ length: 4 }, (_, i) => sparks[i] || null);
  return (
    <div className="w-full aspect-square rounded-xl overflow-hidden grid grid-cols-2 gap-0.5 bg-white/5">
      {slots.map((spark, i) =>
        spark ? (
          <img
            key={i}
            src={spark.url || spark.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div key={i} className="w-full h-full bg-white/5" />
        )
      )}
    </div>
  );
}

// ── CollectionCard ───────────────────────────────────────────────────────────
function CollectionCard({ collection, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2 text-left group"
    >
      <div className="relative overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-[1.02]">
        <CollectionCover sparks={collection.Sparks || []} />
        {!collection.isPublic && (
          <span className="absolute top-2 right-2 text-[10px] bg-black/60 text-white/70 px-2 py-0.5 rounded-full backdrop-blur-sm">
            🔒 Privata
          </span>
        )}
      </div>
      <div className="px-0.5">
        <p className="text-white text-sm font-semibold truncate">{collection.name}</p>
        <p className="text-white/40 text-xs">
          {collection.Sparks?.length || 0} spark
        </p>
      </div>
    </button>
  );
}

// ── CollectionModal ──────────────────────────────────────────────────────────
function CollectionModal({ collection, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: "#111" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">{collection.name}</h2>
            {collection.description && (
              <p className="text-white/40 text-sm mt-0.5">{collection.description}</p>
            )}
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
        </div>

        {collection.Sparks?.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-10">
            Nessuno spark in questa collezione.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(collection.Sparks || []).map((spark) => (
              <img
                key={spark.id}
                src={spark.url || spark.imageUrl}
                alt={spark.title}
                className="w-full aspect-square object-cover rounded-lg"
                const sparks = collection.Sparks || collection.sparks || [];
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── CreateCollectionModal ────────────────────────────────────────────────────
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: "#111" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white font-bold text-lg">Nuova collezione</h2>

        <div className="flex flex-col gap-1">
          <label className="text-white/50 text-xs uppercase tracking-wider">Nome *</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Es. Riferimenti per ritratti"
            className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/50 text-xs uppercase tracking-wider">Descrizione</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opzionale..."
            rows={2}
            className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 resize-none"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setIsPublic((v) => !v)}
            className={`w-10 h-5 rounded-full transition-colors relative ${isPublic ? "bg-[#E8000D]" : "bg-white/15"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isPublic ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <span className="text-white/60 text-sm">{isPublic ? "Pubblica" : "Privata"}</span>
        </label>

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors">
            Annulla
          </button>
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-40"
            style={{ background: "#E8000D" }}
          >
            {loading ? "Creando..." : "Crea"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Pagina principale ────────────────────────────────────────────────────────
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

  // Carica le collezioni al mount
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
      setError("Impossibile caricare le collezioni. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  // Apre la modal con il dettaglio completo (spark inclusi)
  const handleOpenCollection = async (collection) => {
    try {
      setLoadingDetail(true);
      const res = await api.get(`/api/collections/${collection.id}`);
      setSelectedCollection(res.data); // ha già .sparks dentro
    } catch (err) {
      setSelectedCollection({ ...collection, sparks: [] });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCreate = async ({ name, description, isPublic }) => {
    try {
      const res = await api.post("/api/collections", {
        name,
        description,
        isPublic,
      });
      setCollections((prev) => [res.data, ...prev]);
    } catch (err) {
      alert("Errore nella creazione della collezione. Riprova.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/50 text-sm">
          Devi essere loggato per vedere le tue collezioni.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="btn btn-primary btn-sm"
        >
          Vai al login
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
            <h1 className="text-white font-bold text-2xl">Le mie collezioni</h1>
            <p className="text-white/40 text-sm mt-0.5">
              {collections.length}{" "}
              {collections.length === 1 ? "collezione" : "collezioni"}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuova
          </button>
        </div>

        {/* Filtro */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "Tutte" },
            { key: "public", label: "Pubbliche" },
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

        {/* Stati: loading / errore / vuoto / griglia */}
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
            <button
              onClick={fetchCollections}
              className="btn btn-outline btn-xs border-white/10 text-white/40"
            >
              Riprova
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-white/30">
            <span className="text-5xl">✦</span>
            <p className="text-sm">
              {filter === "all"
                ? "Nessuna collezione ancora. Creane una!"
                : "Nessuna collezione in questa categoria."}
            </p>
            {filter === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-outline btn-xs border-white/10 text-white/40 hover:border-white/30 mt-2"
              >
                Crea la prima collezione
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

      {/* Spinner apertura dettaglio */}
      {loadingDetail && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <span className="loading loading-spinner loading-md text-white/60" />
        </div>
      )}

      {/* Modal dettaglio */}
      {selectedCollection && (
        <CollectionModal
          collection={selectedCollection}
          onClose={() => setSelectedCollection(null)}
        />
      )}

      {/* Modal crea */}
      {showCreateModal && (
        <CreateCollectionModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
