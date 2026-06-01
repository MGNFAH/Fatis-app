import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FaHeart, FaEye } from "react-icons/fa";
import { createPortal } from "react-dom";
import { useHeartSound } from "../hooks/useHeartSound";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import SaveToCollectionModal from "./SaveToCollectionModal";
import { FaBookmark } from "react-icons/fa";
import api from "../api";

function LevelBadge({ level }) {
  return (
    <span
      className="text-xs px-1.5 py-0.5 rounded font-semibold"
      style={{ background: "rgba(232,0,13,0.15)", color: "#E8000D" }}
    >
      {level}
    </span>
  );
}

function fmt(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function LoversPreview({ lovers, loves }) {
  if (!loves || loves === 0)
    return (
      <span className="text-xs text-neutral-500 italic">Be the first ❤</span>
    );
  return (
    <div className="flex items-center gap-1">
      {lovers.slice(0, 3).map((name, i) => (
        <div
          key={i}
          className="w-5 h-5 rounded-full bg-neutral-600 flex items-center justify-center text-white text-xs font-bold"
        >
          {name[0]}
        </div>
      ))}
      <span className="text-xs text-neutral-400 ml-1">and more</span>
    </div>
  );
}

function TrendingBadge({ loves }) {
  if (loves < 1000) return null;
  const tier =
    loves >= 10000
      ? { label: "🔥 Hot", bg: "rgba(232,0,13,0.85)" }
      : loves >= 5000
        ? { label: "🔥 Trending", bg: "rgba(200,60,0,0.82)" }
        : { label: "✦ Popular", bg: "rgba(30,30,30,0.78)" };
  return (
    <span
      className="absolute top-2 left-2 text-white text-xs px-2 py-0.5 rounded-full font-semibold"
      style={{
        background: tier.bg,
        boxShadow:
          loves >= 5000
            ? "0 0 10px rgba(232,0,13,0.4)"
            : "0 1px 4px rgba(0,0,0,0.4)",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {tier.label}
    </span>
  );
}

const ImageCard = forwardRef(function ImageCard({ image, onSpark }, ref) {
  const [sparked, setSparked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [viewed, setViewed] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [viewBouncing, setViewBouncing] = useState(false);
  const { playLove, playUnlove } = useHeartSound();
  const sparkedRef = useRef(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const localLoves = sparked ? image.loves + 1 : image.loves;
  const localLovers = sparked
    ? ["you", ...(image.lovers || [])]
    : image.lovers || [];
  const localViews = viewed ? image.views + 1 : image.views;

  useEffect(() => { setImgError(false); }, [image.url]);

  const handleLove = async (e) => {
    e?.stopPropagation();
    if (!user) { navigate("/login"); return; }
    const newSparked = !sparkedRef.current;
    sparkedRef.current = newSparked;
    setSparked(newSparked);
    if (newSparked) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);
      setGlowing(true);
      setTimeout(() => setGlowing(false), 700);
      setBouncing(true);
      setTimeout(() => setBouncing(false), 500);
      onSpark?.();
      playLove();
    } else {
      playUnlove();
    }
    try {
      if (newSparked) {
        await api.post(`/api/sparks/${image.id}/love`);
      } else {
        await api.delete(`/api/sparks/${image.id}/love`);
      }
    } catch (err) {
      sparkedRef.current = !newSparked;
      setSparked(!newSparked);
      console.error("Love error:", err);
    }
  };

  useImperativeHandle(ref, () => ({ triggerLove: handleLove }));

  return (
    <div
      className="group relative overflow-hidden rounded-2xl cursor-pointer bg-neutral-900"
      style={{ breakInside: "avoid" }}
      onClick={() => {
        if (!viewed) {
          setViewed(true);
          setViewBouncing(true);
          setTimeout(() => setViewBouncing(false), 500);
        }
      }}
    >
      {imgError && (
        <div className="w-full aspect-video bg-neutral-800 flex flex-col items-center justify-center gap-2 p-4">
          <span className="text-2xl">!</span>
          <p className="text-neutral-400 text-xs text-center">Image not available</p>
          <p className="text-neutral-600 text-xs text-center">The site may block hotlinking.</p>
        </div>
      )}
      {!imgError && (
        <img
          src={image.url || image.imageUrl}
          alt={image.title}
          className="w-full object-cover block"
          onError={() => setImgError(true)}
          onLoad={() => setImgError(false)}
          style={{
            transition: "transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            pointerEvents: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      )}

      {image.loves >= 1000 && <TrendingBadge loves={image.loves} />}

      {/* Touch love button */}
      <button
        className="absolute top-2 right-2 flex flex-col items-center gap-0.5 sm:hidden"
        onClick={(e) => { e.stopPropagation(); handleLove(e); }}
      >
        <FaHeart
          size={18}
          className={sparked ? "text-[#E8000D]" : "text-white/60"}
          style={{ transition: "color 200ms ease, transform 200ms ease" }}
        />
        <span className="text-white/60 text-xs">{sparked ? "Loving" : "Love"}</span>
      </button>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Top action bar */}
      <div
        className="absolute top-3 right-3 flex gap-2 opacity-0"
        style={{ transform: "translateY(-6px)", transition: "all 250ms ease" }}
        ref={(el) => {
          if (!el) return;
          const card = el.closest(".group");
          const show = () => { el.style.transform = "translateY(0)"; el.style.opacity = "1"; };
          const hide = () => { el.style.transform = "translateY(-6px)"; el.style.opacity = "0"; };
          card.addEventListener("mouseenter", show);
          card.addEventListener("mouseleave", hide);
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setShowSaveModal(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-black/70 hover:bg-white transition-colors"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
        >
          <FaBookmark size={10} /> Save
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleLove(e); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            sparked ? "bg-[#E8000D] text-white" : "bg-white text-[#E8000D]"
          }`}
          style={{
            transition:
              "background 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), color 250ms ease, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: sparked
              ? "0 0 12px rgba(232,0,13,0.45)"
              : "0 2px 8px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            if (!sparked) { e.currentTarget.style.background = "#E8000D"; e.currentTarget.style.color = "white"; }
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            if (!sparked) { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#E8000D"; }
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <FaHeart size={10} />
          {sparked ? "I'm loving it" : "Love it"}
        </button>
      </div>

      {/* Bottom info bar */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-3 opacity-0"
        style={{ transform: "translateY(8px)", transition: "all 250ms ease" }}
        ref={(el) => {
          if (!el) return;
          const card = el.closest(".group");
          const show = () => { el.style.transform = "translateY(0)"; el.style.opacity = "1"; };
          const hide = () => { el.style.transform = "translateY(8px)"; el.style.opacity = "0"; };
          card.addEventListener("mouseenter", show);
          card.addEventListener("mouseleave", hide);
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={image.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${image.author}`}
              alt={image.author}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full object-cover border-2 border-white/60"
              style={{ transition: "border-color 300ms ease, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.95)";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
            {image.authorLevel && <LevelBadge level={image.authorLevel} />}
          </div>
          <div className="flex flex-col items-end min-w-0">
            <p className="text-white text-xs font-semibold truncate max-w-[120px]">{image.title}</p>
            <p className="text-neutral-400 text-xs">@{image.author}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <FaEye size={10} /> {fmt(localViews)}
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <FaHeart size={10} /> {fmt(localLoves)}
          </span>
        </div>
      </div>

      {showSaveModal &&
        createPortal(
          <SaveToCollectionModal
            spark={image}
            onClose={() => setShowSaveModal(false)}
          />,
          document.body,
        )}
    </div>
  );
});

export default ImageCard;
