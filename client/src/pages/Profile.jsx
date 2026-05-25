import { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import api from "../api";

// Avatar con iniziali come fallback
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

// Statistica singola
function StatCard({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4">
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="text-xs text-white/50 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Campi del form
  const [formName, setFormName] = useState(user?.name || "");
  const [formBio, setFormBio] = useState(user?.bio || "");
  const [formAvatarPreview, setFormAvatarPreview] = useState(
    user?.avatar || null,
  );

  const fileInputRef = useRef(null);

  // Se non loggato, redirect al login
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/60">
          Devi essere loggato per vedere il profilo.
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

  // Gestione upload avatar (anteprima locale — non invia ancora al server)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSaveError("Carica un file immagine valido.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setFormAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };



  // Sostituisci handleSave
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/api/users/me", {
        name: formName,
        bio: formBio,
        avatar: formAvatarPreview,
      });
      // Aggiorna il contesto globale con i dati reali dal server
      updateProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.error || "Errore nel salvataggio. Riprova.");
    } finally {
      setSaving(false);
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

  // Stat placeholder — in futuro verranno dall'API
  const stats = [
    { label: "Spark", value: user.sparkCount ?? 0 },
    { label: "Love", value: user.loveCount ?? 0 },
    { label: "Collezioni", value: user.collectionCount ?? 0 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {/* ── HEADER PROFILO ── */}
        <div className="flex flex-col items-center gap-4">
          {/* Avatar con overlay edit */}
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
                {/* Bottone modifica foto */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Cambia foto profilo"
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

          {/* Nome e username */}
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

          {/* Statistiche */}
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
                Modifica
              </button>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={formBio}
              onChange={(e) => setFormBio(e.target.value)}
              placeholder="Raccontati agli altri artisti... chi sei, da dove vieni, cosa ti ispira?"
              rows={4}
              maxLength={300}
              className="textarea textarea-bordered w-full bg-white/5 border-white/10 text-white placeholder-white/30 text-sm resize-none rounded-xl"
            />
          ) : (
            <p className="text-white/60 text-sm leading-relaxed">
              {user.bio || (
                <span className="text-white/25 italic">
                  Nessuna bio ancora. Clicca Modifica per raccontarti!
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
                  "Salva modifiche"
                )}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-sm border-red-800/50 text-red-400 hover:bg-red-900/20 hover:border-red-600"
          >
            Esci dall'account
          </button>
        )}
      </div>
    </div>
  );
}
