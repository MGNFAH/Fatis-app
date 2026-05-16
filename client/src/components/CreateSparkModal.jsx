import { useState, useRef } from "react";
import {
  FaTimes,
  FaCloudUploadAlt,
  FaHashtag,
  FaPlus,
  FaFire,
} from "react-icons/fa";

const CATEGORIES = [
  "Pittura ad olio",
  "Acquerello",
  "Disegno",
  "Scultura",
  "Fotografia",
  "Arte digitale",
  "Illustrazione",
  "Altro",
];

export default function CreateSparkModal({ onClose, onPublish }) {
const [form, setForm] = useState({
  title: "",
  caption: "",
  imageUrl: "",
  sourcePageUrl: "",
  category: "",
});
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [imageMode, setImageMode] = useState("upload"); // "upload" | "hotlink"
  const [remotePreviewError, setRemotePreviewError] = useState(false);    
  // ── Gestione immagine ──────────────────────────────────────
  const handleImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageMode("upload");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setRemotePreviewError(false);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleRemoteImageChange = (value) => {
    setImageMode("hotlink");
    setForm((prev) => ({ ...prev, imageUrl: value }));
    setPreview(value.trim());
    setImageFile(null);
    setRemotePreviewError(false);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImage(e.dataTransfer.files[0]);
  };

  // ── Gestione tag a chip ────────────────────────────────────
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, "").toLowerCase();
      if (val && !tags.includes(val) && tags.length < 8) {
        setTags([...tags, val]);
      }
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  // ── Validazione ────────────────────────────────────────────
const validate = () => {
  const newErrors = {};

  if (imageMode === "upload" && !preview) {
    newErrors.image = "Carica un'immagine per il tuo Spark.";
  }

  if (imageMode === "hotlink") {
    if (!form.imageUrl.trim()) {
      newErrors.image = "Inserisci l'URL diretto di un'immagine.";
    } else if (remotePreviewError) {
      newErrors.image = "Questa immagine non può essere caricata via hotlink.";
    }
  }

  if (!form.title.trim()) newErrors.title = "Il titolo è obbligatorio.";
  if (!form.category) newErrors.category = "Scegli una categoria.";

  return newErrors;
};
  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simula un piccolo delay come se caricasse sul server
    setTimeout(() => {
    onPublish({
      id: Date.now(),
      url: imageMode === "hotlink" ? form.imageUrl.trim() : preview,
      imageMode,
      imageUrl: imageMode === "hotlink" ? form.imageUrl.trim() : "",
      localPreviewUrl: imageMode === "upload" ? preview : "",
      title: form.title.trim(),
      caption: form.caption.trim(),
      sourcePageUrl: form.sourcePageUrl.trim(),
      category: form.category,
      tags,
      loves: 0,
      views: 0,
      trending: false,
    });
      setIsLoading(false);
      onClose();
    }, 800);
  };

  // ── Stili input condivisi ──────────────────────────────────
  const inputClass =
    "w-full bg-neutral-800 text-white text-sm rounded-xl px-4 py-3 outline-none placeholder-neutral-600 transition";
  const inputStyle = { border: "1px solid rgba(255,255,255,0.08)" };
  const onFocus = (e) => (e.target.style.borderColor = "rgba(232,0,13,0.5)");
  const onBlur = (e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)");

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-3 md:p-5"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 rounded-2xl w-full flex flex-col md:flex-row overflow-hidden"
        style={{ maxWidth: "min(900px, 96vw)", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Colonna sinistra: upload immagine ── */}
        <div
          className="md:w-2/5 bg-neutral-950 flex flex-col items-center justify-center p-6 flex-shrink-0"
          style={{ minHeight: 300 }}
        >
          <div className="w-full flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setImageMode("upload");
                setForm((prev) => ({ ...prev, imageUrl: "" }));
                setPreview(imageFile ? preview : null);
                setRemotePreviewError(false);
              }}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition"
              style={{
                background:
                  imageMode === "upload" ? "#E8000D" : "rgba(255,255,255,0.06)",
                color: "white",
              }}
            >
              Upload
            </button>

            <button
              type="button"
              onClick={() => {
                setImageMode("hotlink");
                setImageFile(null);
                setPreview(form.imageUrl.trim() || null);
                setRemotePreviewError(false);
              }}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition"
              style={{
                background:
                  imageMode === "hotlink"
                    ? "#E8000D"
                    : "rgba(255,255,255,0.06)",
                color: "white",
              }}
            >
              URL immagine
            </button>
          </div>
          
          {imageMode === "upload" ? (
            preview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-xl object-contain max-h-72 w-full"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-[#E8000D] transition"
                >
                  <FaTimes size={11} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className="w-full flex flex-col items-center justify-center gap-4 rounded-2xl cursor-pointer transition-all"
                style={{
                  border: `2px dashed ${dragOver ? "#E8000D" : "rgba(255,255,255,0.12)"}`,
                  background: dragOver ? "rgba(232,0,13,0.06)" : "transparent",
                  minHeight: 240,
                  transition: "all 200ms ease",
                }}
              >
                <FaCloudUploadAlt
                  size={40}
                  style={{
                    color: dragOver ? "#E8000D" : "rgba(255,255,255,0.2)",
                  }}
                />
                <div className="text-center">
                  <p className="text-white text-sm font-semibold">
                    Trascina l'immagine qui
                  </p>
                  <p className="text-neutral-500 text-xs mt-1">
                    oppure clicca per selezionare
                  </p>
                </div>
                <p className="text-neutral-600 text-xs">
                  JPG, PNG, WEBP — max 10MB
                </p>
              </div>
            )
          ) : (
            <div className="w-full flex flex-col gap-3">
              <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                URL immagine
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => handleRemoteImageChange(e.target.value)}
                placeholder="https://..."
                className={inputClass}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />

              <div
                className="w-full rounded-2xl overflow-hidden flex items-center justify-center"
                style={{
                  minHeight: 240,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview remota"
                    className="w-full max-h-72 object-contain"
                    onError={() => {
                      setRemotePreviewError(true);
                    }}
                    onLoad={() => {
                      setRemotePreviewError(false);
                    }}
                  />
                ) : (
                  <p className="text-neutral-600 text-xs px-4 text-center">
                    Incolla un URL diretto a un file immagine per vedere
                    l’anteprima.
                  </p>
                )}
              </div>

              {remotePreviewError && (
                <p className="text-xs" style={{ color: "#ff4d4d" }}>
                  L'immagine non è caricabile: il sito potrebbe bloccare
                  l'hotlinking.
                </p>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImage(e.target.files[0])}
          />
          {errors.image && (
            <p className="text-xs mt-3" style={{ color: "#ff4d4d" }}>
              {errors.image}
            </p>
          )}
        </div>

        {/* ── Colonna destra: form ── */}
        <div
          className="flex-1 flex flex-col min-w-0"
          style={{ maxHeight: "92vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              <FaFire size={14} style={{ color: "#E8000D" }} />
              <h2 className="text-white font-bold text-lg">Crea uno Spark</h2>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Form scrollabile */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#3f3f3f transparent",
            }}
          >
            {/* Titolo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                Titolo <span style={{ color: "#E8000D" }}>*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  setErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="Es. Tramonto sul Vesuvio"
                className={inputClass}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              {errors.title && (
                <p className="text-xs" style={{ color: "#ff4d4d" }}>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Categoria */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                Categoria <span style={{ color: "#E8000D" }}>*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => {
                  setForm({ ...form, category: e.target.value });
                  setErrors((prev) => ({ ...prev, category: "" }));
                }}
                className={inputClass}
                style={{ ...inputStyle, appearance: "none" }}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                <option value="" disabled>
                  Seleziona una categoria
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs" style={{ color: "#ff4d4d" }}>
                  {errors.category}
                </p>
              )}
            </div>

            {/* Caption */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                Descrizione
              </label>
              <textarea
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Racconta qualcosa su questo lavoro..."
                rows={3}
                className={`${inputClass} resize-none`}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                Tag{" "}
                <span className="text-neutral-600 normal-case font-normal">
                  (max 8 — premi Invio per aggiungere)
                </span>
              </label>
              <div
                className="flex flex-wrap gap-2 rounded-xl px-3 py-2.5 min-h-[46px]"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#262626",
                }}
                onClick={() => document.getElementById("tagInput").focus()}
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(232,0,13,0.15)",
                      color: "#E8000D",
                      border: "1px solid rgba(232,0,13,0.25)",
                    }}
                  >
                    <FaHashtag size={8} />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-white transition"
                    >
                      <FaTimes size={8} />
                    </button>
                  </span>
                ))}
                {tags.length < 8 && (
                  <input
                    id="tagInput"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={
                      tags.length === 0 ? "oilpainting, napoli..." : ""
                    }
                    className="bg-transparent text-white text-xs outline-none flex-1 min-w-[120px] placeholder-neutral-600"
                  />
                )}
              </div>
            </div>

            {/* Source */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                Source{" "}
                <span className="text-neutral-600 normal-case font-normal">
                  (facoltativo)
                </span>
              </label>
              <input
                type="url"
                value={form.sourcePageUrl}
                onChange={(e) =>
                  setForm({ ...form, sourcePageUrl: e.target.value })
                }
                placeholder="https://..."
                className={inputClass}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
          </form>

          {/* Footer con pulsante */}
          <div className="px-6 py-4 border-t border-neutral-800 flex-shrink-0">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
              style={{
                background: isLoading ? "rgba(232,0,13,0.5)" : "#E8000D",
                transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {isLoading ? (
                "Pubblicazione in corso..."
              ) : (
                <>
                  <FaFire size={13} /> Pubblica Spark
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
