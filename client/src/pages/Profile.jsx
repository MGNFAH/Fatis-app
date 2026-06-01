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
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  return user?.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      className={`${sizeMap[size]} rounded-full object-cover`}
    />
  ) : (
    <div
      className={`${sizeMap[size]} rounded-full bg-[#E8000D] flex items-center justify-center text-white font-bold`}
    >
      {initials}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-white font-bold text-xl">{value}</span>
      <span className="text-white/40 text-xs">{label}</span>
    </div>
  );
}

function SparkGrid({ sparks, loading, emptyMessage, onDelete }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton aspect-square rounded-xl" />
        ))}
      </div>
    );
  }
  if (!sparks.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-white/30">
        <span className="text-4xl">✦</span>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {sparks.map((spark) => (
        <div key={spark.id} className="relative group">
          <img
            src={spark.imageUrl || spark.url}
            alt={spark.title}
            className="w-full aspect-square object-cover rounded-xl"
          />
          {onDelete && (
            <button
              onClick={() => onDelete(spark.id)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white/70 hover:text-white hover:bg-red-600/80 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Delete spark"
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
  const [formAvatarPreview, setFormAvatarPreview] = useState(user?.avatar || null);
  const fileInputRef = useRef(null);
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
      console.error("Error deleting spark:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/50 text-sm">You need to be logged in to view your profile.</p>
        <button onClick={() => navigate("/login")} className="btn btn-primary btn-sm">
          Go to login
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
      setIsEditing(false);
    } catch (err) {
      setSaveError("Error saving. Please try again.");
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
    { label: "Sparks", value: mySparks.length },
    { label: "Loved", value: lovedSparks.length },
    { label: "Collections", value: user.collectionCount ?? 0 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        {/* ── PROFILE HEADER ── */}
        <div className="flex flex-col items-center gap-4 pt-6">
          <div className="relative group">
            {isEditing ? (
              <>
                {formAvatarPreview ? (
                  <img
                    src={formAvatarPreview}
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <AvatarDisplay user={user} size="lg" />
                )}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Change profile picture"
                >
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </>
            ) : (
              <AvatarDisplay user={user} size="lg" />
            )}
          </div>

          <div className="flex flex-col items-center gap-1">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Your name"
                  className="input input-bordered input-sm w-full text-center bg-white/5 border-white/10 text-white placeholder-white/30"
                  maxLength={50}
                />
                <span className="text-white/30 text-xs">@{user.username || user.email?.split("@")[0]}</span>
              </>
            ) : (
              <>
                <h1 className="text-white font-bold text-2xl">{user.name}</h1>
                <span className="text-white/30 text-xs">@{user.username || user.email?.split("@")[0]}</span>
              </>
            )}
          </div>

          <div className="flex gap-8">
            {stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
          </div>
        </div>

        {/* ── BIO ── */}
        <div
          className="bg-white/5 rounded-2xl p-5 flex flex-col gap-3"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-white/70 text-xs uppercase tracking-widest font-medium">Bio</h2>
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
              placeholder="Tell other artists about yourself..."
              rows={4}
              maxLength={300}
              className="textarea textarea-bordered w-full bg-white/5 border-white/10 text-white placeholder-white/30 text-sm resize-none rounded-xl"
            />
          ) : (
            <p className="text-white/60 text-sm leading-relaxed">
              {user.bio || (
                <span className="text-white/25 italic">
                  No bio yet. Click Edit to tell your story!
                </span>
              )}
            </p>
          )}
          {isEditing && (
            <span className="text-white/25 text-xs text-right">{formBio.length}/300</span>
          )}
        </div>

        {/* ── TABS ── */}
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
                  <span className="ml-1.5 text-xs opacity-60">({mySparks.length})</span>
                )}
                {tab === "Loved" && lovedSparks.length > 0 && (
                  <span className="ml-1.5 text-xs opacity-60">({lovedSparks.length})</span>
                )}
              </button>
            ))}
          </div>
          {activeTab === "My Sparks" && (
            <SparkGrid
              sparks={mySparks}
              loading={loadingMy}
              emptyMessage="You haven't uploaded any sparks yet."
              onDelete={handleDeleteSpark}
            />
          )}
          {activeTab === "Loved" && (
            <SparkGrid
              sparks={lovedSparks}
              loading={loadingLoved}
              emptyMessage="You haven't loved any sparks yet."
            />
          )}
        </div>

        {/* ── ACCOUNT INFO ── */}
        <div
          className="bg-white/5 rounded-2xl p-5 flex flex-col gap-3"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-white/70 text-xs uppercase tracking-widest font-medium">Account</h2>
          <div className="flex items-center gap-3 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-white/50">{user.email}</span>
          </div>
        </div>

        {/* ── ACTIONS ── */}
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
                Cancel
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
            Log out
          </button>
        )}
      </div>
    </div>
  );
}
