import { useState } from "react";
import {
  FaHeart, FaEye, FaLink, FaUser, FaFlag, FaTimes,
  FaEllipsisH, FaBookmark, FaHashtag, FaPaperPlane
} from "react-icons/fa";

export default function ImageModal({ image, onClose }) {
  const [loved, setLoved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(image.comments || []);

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { author: "tu", text: comment.trim() }]);
    setComment("");
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 rounded-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Colonna sinistra: immagine ── */}
        <div className="md:w-1/2 bg-black flex items-center justify-center">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-contain max-h-[92vh]"
          />
        </div>

        {/* ── Colonna destra: info ── */}
        <div className="md:w-1/2 flex flex-col max-h-[92vh]">

          {/* Scrollabile */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">

            {/* Header: autore + menu + chiudi */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {image.avatar && (
                  <img src={image.avatar} alt={image.author}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-700" />
                )}
                <p className="text-white font-semibold text-sm">@{image.author}</p>
              </div>

              <div className="flex items-center gap-1">
                {/* Menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition"
                  >
                    <FaEllipsisH size={14} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-1 w-52 bg-neutral-800 rounded-xl shadow-lg z-10 overflow-hidden text-sm">
                      <button
                        onClick={() => { navigator.clipboard.writeText(image.source); setMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-white transition flex items-center gap-2"
                      >
                        <FaLink size={12} /> Condividi spark
                      </button>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-neutral-300 transition flex items-center gap-2"
                      >
                        <FaUser size={12} /> Vedi profilo di @{image.author}
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

                {/* Chiudi */}
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            {/* Titolo */}
            <h2 className="text-white text-xl font-bold leading-tight">{image.title}</h2>

            {/* Caption */}
            {image.caption && (
              <p className="text-neutral-300 text-sm leading-relaxed">{image.caption}</p>
            )}

            {/* Hashtags */}
            {image.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag, i) => (
                  <span key={i}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(232,0,13,0.1)",
                      color: "#E8000D",
                      border: "1px solid rgba(232,0,13,0.2)",
                    }}
                  >
                    <FaHashtag size={9} />{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Source */}
            {image.source && (
              <div className="text-sm">
                <span className="text-neutral-500 font-medium uppercase tracking-wider text-xs">Source</span>
                <a href={image.source} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 truncate mt-1 transition"
                >
                  <FaLink size={10} />{image.source}
                </a>
              </div>
            )}

            <div className="border-t border-neutral-800" />

            {/* Stats */}
            <div className="flex gap-6 text-sm text-neutral-400">
              <span className="flex items-center gap-1.5">
                <FaEye size={12} />
                <strong className="text-white">{image.views?.toLocaleString()}</strong>
                visualizzazioni
              </span>
              <span className="flex items-center gap-1.5">
                <FaHeart size={12} className="text-[#E8000D]" />
                <strong className="text-white">{loved ? image.loves + 1 : image.loves}</strong>
                I'm loving it
              </span>
            </div>

            {/* Azioni: Love it + Add to collection */}
            <div className="flex gap-3">
              <button
                onClick={() => setLoved(!loved)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-all
                  ${loved ? "bg-[#E8000D] text-white" : "bg-white text-[#E8000D] hover:bg-[#E8000D] hover:text-white"}`}
                style={{ transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                <FaHeart size={13}
                  style={{ transform: loved ? "scale(1.2) rotate(-10deg)" : "scale(1)",
                    transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                />
                {loved ? "I'm loving it!" : "Love it"}
              </button>

              <button
                onClick={() => setSaved(!saved)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all
                  ${saved
                    ? "bg-neutral-700 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"}`}
                style={{ transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                <FaBookmark size={12}
                  style={{ transform: saved ? "scale(1.2)" : "scale(1)",
                    transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                />
                {saved ? "Saved" : "Add to collection"}
              </button>
            </div>

            <div className="border-t border-neutral-800" />

            {/* Commenti esistenti */}
            {comments.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-neutral-500 text-xs font-medium uppercase tracking-wider">Commenti</span>
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <img src={`https://picsum.photos/seed/${c.author}/24/24`} alt={c.author}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white text-xs font-semibold">@{c.author} </span>
                      <span className="text-neutral-300 text-xs">{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input commento — fisso in fondo */}
          <div className="border-t border-neutral-800 p-4">
            <form onSubmit={handleComment} className="flex items-center gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Aggiungi un commento..."
                className="flex-1 bg-neutral-800 text-white text-sm rounded-full px-4 py-2 outline-none placeholder-neutral-500"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="p-2.5 rounded-full transition"
                style={{
                  background: comment.trim() ? "#E8000D" : "rgba(255,255,255,0.08)",
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
