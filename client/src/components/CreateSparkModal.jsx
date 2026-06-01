import { useState, useRef } from "react";
import {
  FaTimes,
  FaCloudUploadAlt,
  FaHashtag,
  FaPlus,
  FaFire,
} from "react-icons/fa";
import api from "../api";

const CATEGORIES = [
  "Oil Painting",
  "Watercolor",
  "Drawing",
  "Sculpture",
  "Photography",
  "Digital Art",
  "Illustration",
  "Other",
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
    try {
      const urlObj = new URL(value.trim());
      const origin = urlObj.protocol + "//" + urlObj.host;
      setForm((prev) => ({ ...prev, sourcePageUrl: origin }));
    } catch {
      // invalid URL, sourcePageUrl stays empty
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImage(e.dataTransfer.files[0]);
  };

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

  const validate = () => {
    const newErrors = {};
    if (imageMode === "upload" && !preview) {
      newErrors.image = "Upload an image for your Spark.";
    }
    if (imageMode === "hotlink") {
      if (!form.imageUrl.trim()) {
        newErrors.image = "Enter the direct URL of an image.";
      } else if (remotePreviewError) {
        newErrors.image = "This image cannot be loaded via hotlink.";
      }
    }
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.category) newErrors.category = "Choose a category.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      let imageUrl;
      if (imageMode === "upload") {
        const { data: sigData } = await api.get("/api/sparks/upload-signature");
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp);
        formData.append("signature", sigData.signature);
        formData.append("folder", sigData.folder);
        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
          { method: "POST", body: formData },
        );
        const cloudData = await cloudRes.json();
        if (!cloudData.secure_url) {
          throw new Error("Cloudinary upload failed");
        }
        imageUrl = cloudData.secure_url;
      } else {
        imageUrl = form.imageUrl.trim();
      }
      const res = await api.post("/api/sparks", {
        imageUrl,
        source: form.sourcePageUrl.trim(),
        title: form.title.trim(),
        caption: form.caption.trim(),
        category: form.category,
        tags,
      });
      onPublish(res.data);
      onClose();
    } catch (err) {
      setErrors({
        general:
          err.response?.data?.error ||
          err.message ||
          "Publication failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-neutral-800 text-white text-sm rounded-xl px-4 py-3 outline-none placeholder-neutral-600 transition";
  const inputStyle = { border: "1px solid rgba(255,255,255,0.08)" };
  const onFocus = (e) => (e.target.style.borderColor = "rgba(232,0,13,0.5)");
  const onBlur = (e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-4xl rounded-2xl overflow-hidden"
        style={{
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.06)",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Left column: image upload ── */}
        <div
          className="flex flex-col gap-4 p-6 flex-shrink-0"
          style={{
            width: 340,
            background: "rgba(255,255,255,0.02)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Mode toggle */}
          <div className="flex gap-2">
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
                  imageMode === "upload"
                    ? "#E8000D"
                    : "rgba(255,255,255,0.06)",
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
              Image URL
            </button>
          </div>

          {imageMode === "upload" ? (
            preview ? (
              <div className="relative w-full rounded-xl overflow-hidden" style={{ minHeight: 240 }}>
                <p className="text-xs text-neutral-500 mb-2">Preview</p>
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => { setPreview(null); setImageFile(null); }}
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-[#E8000D] transition"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
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
                <FaCloudUploadAlt size={36} className="text-neutral-600" />
                <p className="text-neutral-400 text-sm font-medium">Drag & drop your image here</p>
                <p className="text-neutral-600 text-xs">or click to select</p>
                <p className="text-neutral-700 text-xs">JPG, PNG, WEBP — max 10MB</p>
              </div>
            )
          ) : (
            <div className="flex flex-col gap-3">
              <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                Image URL
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
              {preview ? (
                <div>
                  <p className="text-xs text-neutral-500 mb-2">Remote preview</p>
                  <img
                    src={preview}
                    alt="Remote preview"
                    className="w-full rounded-xl object-cover"
                    style={{ maxHeight: 160 }}
                    onError={() => { setRemotePreviewError(true); }}
                    onLoad={() => { setRemotePreviewError(false); }}
                  />
                </div>
              ) : (
                <p className="text-neutral-600 text-xs">
                  Paste a direct link to an image file to see the preview.
                </p>
              )}
              {remotePreviewError && (
                <p className="text-red-400 text-xs">
                  Image cannot be loaded: the site may block hotlinking.
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
            <p className="text-red-400 text-xs">{errors.image}</p>
          )}
        </div>

        {/* ── Right column: form ── */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h2 className="text-white font-bold text-lg">Create a Spark</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition p-1"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Scrollable form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4"
          >
            {errors.general && (
              <p
                className="text-sm px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(232,0,13,0.1)",
                  border: "1px solid rgba(232,0,13,0.2)",
                  color: "#ff4d4d",
                }}
              >
                {errors.general}
              </p>
            )}

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                Title <span className="text-[#E8000D]">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  setErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="e.g. Sunset over the Bay"
                className={inputClass}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              {errors.title && (
                <p className="text-red-400 text-xs">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                Category <span className="text-[#E8000D]">*</span>
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
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-xs">{errors.category}</p>
              )}
            </div>

            {/* Caption */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Tell us something about this work..."
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
                Tags{" "}
                <span className="text-neutral-600 normal-case font-normal">
                  (max 8 — press Enter to add)
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
                    placeholder={tags.length === 0 ? "oilpainting, naples..." : ""}
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
                  (optional)
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

          {/* Footer */}
          <div
            className="px-6 py-4 border-t border-neutral-800 flex-shrink-0"
          >
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
                "Publishing..."
              ) : (
                <>
                  <FaFire size={13} />
                  Publish Spark
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
