import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import api from "../api";

function AvatarDisplay({ user, size = "lg" }) {
  const sizeMap = {
    sm: "w-10 h-10 text-base",
    md: "w-16 h-16 text-xl",
    lg: "w-24 h-24 text-3xl",
    xl: "w-32 h-32 text-4xl",
  };
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return user?.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      className={`${sizeMap[size]} rounded-full object-cover border-2 border-white/10`}
    />
  ) : (
    <div
      className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white border-2 border-white/10`}
    >
      {initials}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4">
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="text-xs text-white/50 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// Griglia riutilizzabile per My Sparks e Loved
function SparkGrid({ sparks, loading, emptyMessage, onDelete }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton aspect-square rounded-lg" />
        ))}
      </div>
    );
  }
  if (!sparks.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-white/25">
        <span className="text-4xl">✦</span>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {sparks.map((spark) => (
        <div key={spark.id} className="relative group aspect-square">
          <img
            src={spark.url || spark.imageUrl}
            alt={spark.title}
            className="w-full h-full object-cover rounded-lg"
          />
          {onDelete && (
            <button
              onClick={() => onDelete(spark.id)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white/70 hover:text-white hover:bg-red-600/80 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Elimina spark"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const TABS = ["My Sparks", "Loved"];

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [formName, setFormName] = useState(user?.name || "");
  const [formBio, setFormBio] = useState(user?.bio || "");
  const [formAvatarPreview, setFormAvatarPreview] = useState(
    user?.avatar || null,
  );

  const fileInputRef = useRef(null);

  // Tab state
  const [activeTab, setActiveTab] = useState("My Sparks");
  const [mySparks, setMySparks] = useState([]);
  const [lovedSparks, setLovedSparks] = useState([]);
  const [loadingMy, setLoadingMy] = useState(false);
  const [loadingLoved, setLoadingLoved] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchMySparks();
    fetchLovedSparks();
  }, [user]);

  const fetchMySparks = async () => {
    setLoadingMy(true);
    try {
      const res = await api.get("/api/sparks/me");
      setMySparks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMy(false);
    }
  };

  const fetchLovedSparks = async () => {
    setLoadingLoved(true);
    try {
      const res = await api.get("/api/sparks/me/loved");
      setLovedSparks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLoved(false);
    }
  };

  const handleDeleteSpark = async (sparkId) => {
    try {
      await api.delete(`/api/sparks/${sparkId}`);
      setMySparks((prev) => prev.filter((s) => s.id !== sparkId));
    } catch (err) {
      console.error("Errore eliminazione spark:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/60">
          You must be logged in to view your profile.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="btn btn-primary btn-sm"
        >
          Login
        </button>
      </div>
    );
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSaveError("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setFormAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    try {
      const res = await api.put("/api/users/me", {
        name: formName,
        bio: formBio,
        avatar: formAvatarPreview || undefined,
      });
      updateProfile(res.data);
      setIsEditing(false); // ← fix del bug
    } catch (err) {
      setSaveError("Error saving. Please try again later.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormName(user.name || "");
    setFormBio(user.bio || "");
    setFormAvatarPreview(user.avatar || null);
    setSaveError("");
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const stats = [
    { label: "Spark", value: mySparks.length },
    { label: "Love", value: lovedSparks.length },
    { label: "Collezioni", value: user.collectionCount ?? 0 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {/* ── HEADER PROFILO ── */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            {isEditing ? (
              <>
                {formAvatarPreview ? (
                  <img
                    src={formAvatarPreview}
                    alt="Anteprima avatar"
                    className="w-32 h-32 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <AvatarDisplay user={{ ...user, avatar: null }} size="xl" />
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Change profile photo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </>
            ) : (
              <AvatarDisplay user={user} size="xl" />
            )}
          </div>

          {isEditing ? (
            <div className="flex flex-col items-center gap-2 w-full max-w-xs">
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Il tuo nome"
                className="input input-bordered input-sm w-full text-center bg-white/5 border-white/10 text-white placeholder-white/30"
                maxLength={50}
              />
              <span className="text-white/40 text-sm">
                @{user.username || user.email?.split("@")[0]}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <span className="text-white/40 text-sm">
                @{user.username || user.email?.split("@")[0]}
              </span>
            </div>
          )}

          <div className="flex items-center divide-x divide-white/10 mt-2">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </div>

        {/* ── BIO ── */}
        <div className="bg-white/5 rounded-2xl p-5 flex flex-col gap-3 border border-white/8">
          <div className="flex items-center justify-between">
            <h2 className="text-white/70 text-xs uppercase tracking-widest font-medium">
              Bio
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                Edit
              </button>
            )}
          </div>
          {isEditing ? (
            <textarea
              value={formBio}
              onChange={(e) => setFormBio(e.target.value)}
              placeholder="Raccontati agli altri artisti..."
              rows={4}
              maxLength={300}
              className="textarea textarea-bordered w-full bg-white/5 border-white/10 text-white placeholder-white/30 text-sm resize-none rounded-xl"
            />
          ) : (
            <p className="text-white/60 text-sm leading-relaxed">
              {user.bio || (
                <span className="text-white/25 italic">
                  Nessuna bio ancora. Click Edit to share your story!
                </span>
              )}
            </p>
          )}
          {isEditing && (
            <span className="text-white/25 text-xs text-right">
              {formBio.length}/300
            </span>
          )}
        </div>

        {/* ── MY SPARKS / LOVED TABS ── */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-white text-black"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab}
                {tab === "My Sparks" && mySparks.length > 0 && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({mySparks.length})
                  </span>
                )}
                {tab === "Loved" && lovedSparks.length > 0 && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({lovedSparks.length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "My Sparks" && (
            <SparkGrid
              sparks={mySparks}
              loading={loadingMy}
              emptyMessage="No sparks uploaded yet."
              onDelete={handleDeleteSpark}
            />
          )}
          {activeTab === "Loved" && (
            <SparkGrid
              sparks={lovedSparks}
              loading={loadingLoved}
              emptyMessage="No sparks loved yet."
            />
          )}
        </div>

        {/* ── INFO ACCOUNT ── */}
        <div className="bg-white/5 rounded-2xl p-5 flex flex-col gap-3 border border-white/8">
          <h2 className="text-white/70 text-xs uppercase tracking-widest font-medium">
            Account
          </h2>
          <div className="flex items-center gap-3 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-white/50">{user.email}</span>
          </div>
        </div>

        {/* ── AZIONI ── */}
        {isEditing ? (
          <div className="flex flex-col gap-3">
            {saveError && (
              <p className="text-red-400 text-sm text-center">{saveError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="btn btn-outline btn-sm flex-1 border-white/10 text-white/60 hover:border-white/30"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn btn-primary btn-sm flex-1"
              >
                {isSaving ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-sm border-red-800/50 text-red-400 hover:bg-red-900/20 hover:border-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
