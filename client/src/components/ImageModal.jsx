import { useState, useEffect } from "react";
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

function MiniCard({ img, onClick }) {
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [img.url]);
  return (
    <div
      onClick={() => onClick(img)}
      className="group relative overflow-hidden rounded-xl flex-shrink-0 cursor-pointer"
      style={{ width: 130, height: 100 }}
    >
      {imgError ? (
        <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600 text-xs">
          N/A
        </div>
      ) : (
        <>
          <img
            src={img.url}
            alt={img.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            onLoad={() => setImgError(false)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end p-2">
            <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
              {img.title}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function HorizontalScroll({ title, icon, items, onSelect }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
        {icon}&nbsp;&nbsp;{title}
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {items.map((img) => (
          <MiniCard key={img.id} img={img} onClick={onSelect} />
        ))}
      </div>
    </div>
  );
}

export default function ImageModal({ image, onClose, allImages = [] }) {
  const [loved, setLoved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [mainImgError, setMainImgError] = useState(false);
  const [comments, setComments] = useState(image.comments || []);
  const [current, setCurrent] = useState(image);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setMainImgError(false); }, [current.url]);

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
    setComments([...comments, { author: "you", text: comment.trim() }]);
    setComment("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-5xl rounded-2xl overflow-hidden"
        style={{
          background: "#141414",
          border: "1px solid rgba(255,255,255,0.06)",
          maxHeight: "92vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Left: image ── */}
        <div
          className="flex items-center justify-center flex-shrink-0 bg-black"
          style={{ width: "55%", minHeight: 400 }}
        >
          {mainImgError ? (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <span className="text-4xl">!</span>
              <p className="text-white/70 font-semibold">Image not available</p>
              <p className="text-white/40 text-sm">
                The site may block hotlinking or the image URL is no longer valid.
              </p>
              {current.sourcePageUrl && (
                <a
                  href={current.sourcePageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8000D] text-sm hover:underline"
                >
                  Open source page →
                </a>
              )}
              <button
                onClick={() => setMainImgError(false)}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  transition: "all 200ms ease",
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <img
              src={current.url || current.imageUrl}
              alt={current.title}
              className="w-full h-full object-contain"
              onError={() => setMainImgError(true)}
              onLoad={() => setMainImgError(false)}
            />
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
            {/* Author header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {current.avatar && (
                  <img
                    src={current.avatar}
                    alt={current.author}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-white font-semibold text-sm">@{current.author}</p>
                  {current.location && (
                    <p className="text-neutral-500 text-xs">{current.location}</p>
                  )}
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition"
                >
                  <FaEllipsisH size={14} />
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 top-10 rounded-xl overflow-hidden z-10"
                    style={{
                      background: "#1e1e1e",
                      border: "1px solid rgba(255,255,255,0.08)",
                      minWidth: 200,
                    }}
                  >
                    <button
                      onClick={() => {
                        const urlToShare = `${window.location.origin}?spark=${current.id}`;
                        navigator.clipboard.writeText(urlToShare);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-white transition flex items-center gap-2"
                    >
                      <FaLink size={12} /> Share spark
                    </button>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-neutral-300 transition flex items-center gap-2"
                    >
                      <FaUser size={12} /> View @{current.author}'s profile
                    </button>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-red-400 transition flex items-center gap-2"
                    >
                      <FaFlag size={12} /> Report content
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Title & details */}
            <div className="flex flex-col gap-2">
              <h2 className="text-white font-bold text-xl leading-tight">{current.title}</h2>
              {current.caption && (
                <p className="text-neutral-400 text-sm leading-relaxed">{current.caption}</p>
              )}
              {current.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {current.tags.map((tag, i) => (
                    <span key={i} className="text-xs text-neutral-500">#{tag}</span>
                  ))}
                </div>
              )}
              {(current.sourcePageUrl || current.source) && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <FaLink size={10} />
                  <span>Source</span>
                  <a
                    href={current.sourcePageUrl || current.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-white transition truncate"
                  >
                    {current.sourcePageUrl || current.source}
                  </a>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span><FaEye className="inline mr-1" /><strong className="text-white">{current.views?.toLocaleString()}</strong> views</span>
              <span><FaHeart className="inline mr-1" /><strong className="text-white">{loved ? current.loves + 1 : current.loves}</strong> loves</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!user) { onClose(); navigate("/login"); return; }
                  setLoved(!loved);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm ${
                  loved
                    ? "bg-[#E8000D] text-white"
                    : "bg-white text-[#E8000D] hover:bg-[#E8000D] hover:text-white"
                }`}
                style={{ transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                <FaHeart size={13} />
                {loved ? "I'm loving it!" : "Love it"}
              </button>
              <button
                onClick={() => {
                  if (!user) { onClose(); navigate("/login"); return; }
                  setSaved(!saved);
                }}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm ${
                  saved
                    ? "bg-neutral-700 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                }`}
                style={{ transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                <FaBookmark size={13} />
                {saved ? "Saved" : "Add to collection"}
              </button>
            </div>

            {/* Related works */}
            <HorizontalScroll
              title="More from this artist"
              icon={<FaUser size={10} />}
              items={authorWorks}
              onSelect={handleSelect}
            />
            <HorizontalScroll
              title="Similar sparks"
              icon={<FaFire size={10} />}
              items={suggested}
              onSelect={handleSelect}
            />

            {(authorWorks.length > 0 || suggested.length > 0) && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
            )}

            {/* Comments */}
            {comments.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                  Comments
                </p>
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {c.author[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-white text-xs font-semibold">@{c.author}</span>{" "}
                      <span className="text-neutral-400 text-xs">{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fixed comment input */}
          <form
            onSubmit={handleComment}
            className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-neutral-800 text-white text-sm rounded-full px-4 py-2.5 outline-none placeholder-neutral-500"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <button type="submit" className="text-[#E8000D] hover:text-white transition p-2">
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition p-1.5 rounded-lg hover:bg-neutral-800"
        >
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  );
}
