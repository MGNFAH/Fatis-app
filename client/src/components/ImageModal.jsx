import { useState } from "react";
import {
  FaHeart,
  FaEye,
  FaLink,
  FaUser,
  FaFlag,
  FaTimes,
  FaEllipsisH,
  FaBookmark,
  FaHashtag,
  FaPaperPlane,
  FaFire,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

// ─── Mini card per opere correlate ───────────────────────────────────────
function MiniCard({ img, onClick }) {
  return (
    <button
      onClick={() => onClick(img)}
      className="group relative overflow-hidden rounded-xl flex-shrink-0"
      style={{ width: 130, height: 100 }}
    >
      <img
        src={img.url}
        alt={img.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: "rgba(0,0,0,0.45)" }}
      />
      <p
        className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-white text-xs font-semibold
          translate-y-full group-hover:translate-y-0 transition-transform duration-200"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
        }}
      >
        {img.title}
      </p>
    </button>
  );
}

// ─── Sezione scroll orizzontale ──────────────────────────────────────────
function HorizontalScroll({ title, icon, items, onSelect }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span className="text-[#E8000D]">{icon}</span>
        <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((img) => (
          <MiniCard key={img.id} img={img} onClick={onSelect} />
        ))}
      </div>
    </div>
  );
}

// ─── Componente principale ───────────────────────────────────────────────
export default function ImageModal({ image, onClose, allImages = [] }) {
  const [loved, setLoved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(image.comments || []);
  const [current, setCurrent] = useState(image);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (img) => {
    setCurrent(img);
    setLoved(false);
    setSaved(false);
    setComments(img.comments || []);
    setComment("");
  };

  const authorWorks = allImages.filter(
    (img) => img.author === current.author && img.id !== current.id,
  );

  const suggested = allImages
    .filter((img) => {
      if (img.id === current.id || img.author === current.author) return false;
      if (!img.tags?.length || !current.tags?.length) return false;
      return img.tags.some((t) => current.tags.includes(t));
    })
    .slice(0, 12);

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { author: "tu", text: comment.trim() }]);
    setComment("");
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-3 md:p-5"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 rounded-2xl overflow-hidden w-full flex flex-col md:flex-row"
        style={{ maxWidth: "min(1200px, 96vw)", maxHeight: "94vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Immagine sinistra ── */}
        <div
          className="bg-black flex items-center justify-center flex-shrink-0"
          style={{ width: "min(55%, 660px)", minHeight: 400 }}
        >
          <img
            src={current.url}
            alt={current.title}
            className="w-full h-full object-contain"
            style={{ maxHeight: "94vh" }}
          />
        </div>

        {/* ── Pannello destra ── */}
        <div
          className="flex-1 flex flex-col min-w-0"
          style={{ maxHeight: "94vh" }}
        >
          {/* Scrollabile */}
          <div
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#3f3f3f transparent",
            }}
          >
            {/* Header autore */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {current.avatar && (
                  <img
                    src={current.avatar}
                    alt={current.author}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-700 flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    @{current.author}
                  </p>
                  {current.location && (
                    <p className="text-neutral-500 text-xs truncate">
                      {current.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition"
                  >
                    <FaEllipsisH size={14} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-1 w-52 bg-neutral-800 rounded-xl shadow-xl z-10 overflow-hidden text-sm">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(current.source);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-white transition flex items-center gap-2"
                      >
                        <FaLink size={12} /> Condividi spark
                      </button>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-neutral-300 transition flex items-center gap-2"
                      >
                        <FaUser size={12} /> Vedi profilo di @{current.author}
                      </button>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-red-400 transition flex items-center gap-2"
                      >
                        <FaFlag size={12} /> Segnala contenuto
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            <h2 className="text-white text-2xl font-bold leading-tight">
              {current.title}
            </h2>

            {current.caption && (
              <p className="text-neutral-300 text-sm leading-relaxed">
                {current.caption}
              </p>
            )}

            {current.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {current.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full cursor-default"
                    style={{
                      background: "rgba(232,0,13,0.1)",
                      color: "#E8000D",
                      border: "1px solid rgba(232,0,13,0.2)",
                    }}
                  >
                    <FaHashtag size={9} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {current.source && (
              <div className="text-sm">
                <span className="text-neutral-500 font-medium uppercase tracking-wider text-xs">
                  Source
                </span>
                <a
                  href={current.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 truncate mt-1 transition"
                >
                  <FaLink size={10} />
                  {current.source}
                </a>
              </div>
            )}

            <div className="border-t border-neutral-800" />

            <div className="flex gap-6 text-sm text-neutral-400">
              <span className="flex items-center gap-1.5">
                <FaEye size={12} />
                <strong className="text-white">
                  {current.views?.toLocaleString()}
                </strong>
                visualizzazioni
              </span>
              <span className="flex items-center gap-1.5">
                <FaHeart size={12} className="text-[#E8000D]" />
                <strong className="text-white">
                  {loved ? current.loves + 1 : current.loves}
                </strong>
                I'm loving it
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  setLoved(!loved);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm
                  ${loved ? "bg-[#E8000D] text-white" : "bg-white text-[#E8000D] hover:bg-[#E8000D] hover:text-white"}`}
                style={{
                  transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <FaHeart
                  size={13}
                  style={{
                    transform: loved
                      ? "scale(1.25) rotate(-10deg)"
                      : "scale(1)",
                    transition:
                      "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
                {loved ? "I'm loving it!" : "Love it"}
              </button>

              <button
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  setSaved(!saved);
                }}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm
                  ${
                    saved
                      ? "bg-neutral-700 text-white"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  }`}
                style={{
                  transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <FaBookmark
                  size={12}
                  style={{
                    transform: saved ? "scale(1.2)" : "scale(1)",
                    transition:
                      "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
                {saved ? "Saved" : "Add to collection"}
              </button>
            </div>

            <div className="border-t border-neutral-800" />

            {/* Altre opere dell'autore */}
            <HorizontalScroll
              title={`Altre opere di @${current.author}`}
              icon={<FaUser size={11} />}
              items={authorWorks}
              onSelect={handleSelect}
            />

            {/* Suggeriti per tag */}
            <HorizontalScroll
              title="Potrebbe piacerti"
              icon={<FaFire size={11} />}
              items={suggested}
              onSelect={handleSelect}
            />

            {(authorWorks.length > 0 || suggested.length > 0) && (
              <div className="border-t border-neutral-800" />
            )}

            {comments.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                  Commenti
                </span>
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-2.5">
                    <img
                      src={`https://picsum.photos/seed/${c.author}/28/28`}
                      alt={c.author}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="text-white text-xs font-semibold">
                        @{c.author}{" "}
                      </span>
                      <span className="text-neutral-300 text-xs">{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input commento fisso */}
          <div className="border-t border-neutral-800 p-4 flex-shrink-0">
            <form onSubmit={handleComment} className="flex items-center gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Aggiungi un commento..."
                className="flex-1 bg-neutral-800 text-white text-sm rounded-full px-4 py-2.5 outline-none placeholder-neutral-500"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="p-2.5 rounded-full flex-shrink-0 transition"
                style={{
                  background: comment.trim()
                    ? "#E8000D"
                    : "rgba(255,255,255,0.08)",
                  color: comment.trim() ? "white" : "rgba(255,255,255,0.3)",
                  transition: "all 200ms ease",
                }}
              >
                <FaPaperPlane size={12} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
