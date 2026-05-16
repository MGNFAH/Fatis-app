import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"; import { FaHeart, FaEye } from "react-icons/fa";
import { useHeartSound } from "../hooks/useHeartSound";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";


function LevelBadge({ level }) {
  return (
    <span className="absolute -bottom-1 -right-1 text-[9px] font-bold leading-none bg-[#E8000D] text-white rounded-full w-4 h-4 flex items-center justify-center border border-black/40">
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
      <span className="text-[9px] leading-tight text-right" style={{ color: "rgba(255,255,255,0.35)" }}>
        Sii il primo ❤
      </span>
    );
  return (
    <div className="flex items-center justify-end gap-1">
      <div className="flex -space-x-1">
        {lovers.slice(0, 3).map((name, i) => (
          <img key={i} src={`https://picsum.photos/seed/${name}/20/20`} alt={name}
            className="w-3.5 h-3.5 rounded-full object-cover"
            style={{ border: "1px solid rgba(0,0,0,0.5)", zIndex: 3 - i }}
          />
        ))}
      </div>
      <span className="text-[9px] leading-tight" style={{ color: "rgba(255,255,255,0.4)" }}>
        and more
      </span>
    </div>
  );
}

function TrendingBadge({ loves }) {
  if (loves < 1000) return null;
  const tier =
    loves >= 10000 ? { label: "🔥 Hot", bg: "rgba(232,0,13,0.85)" }
    : loves >= 5000 ? { label: "🔥 Trending", bg: "rgba(200,60,0,0.82)" }
    : { label: "✦ Popular", bg: "rgba(30,30,30,0.78)" };
  return (
    <span style={{
      background: tier.bg, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
      border: "1px solid rgba(255,255,255,0.12)", color: "white", fontSize: "9px",
      fontWeight: 700, letterSpacing: "0.04em", padding: "2px 7px", borderRadius: "999px",
      lineHeight: 1.4,
      boxShadow: loves >= 5000 ? "0 0 10px rgba(232,0,13,0.4)" : "0 1px 4px rgba(0,0,0,0.4)",
      pointerEvents: "none", userSelect: "none",
    }}>
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
  const [viewBouncing, setViewBouncing] = useState(false);
  const { playLove, playUnlove } = useHeartSound();
  const sparkedRef = useRef(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const localLoves = sparked ? image.loves + 1 : image.loves;
  const localLovers = sparked ? ["tu", ...(image.lovers || [])] : image.lovers || [];
  const localViews = viewed ? image.views + 1 : image.views;

  useEffect(() => {
    setImgError(false);
  }, [image.url]);

  const handleLove = (e) => {
    e?.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    } 
      if (!sparkedRef.current) {
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
      sparkedRef.current = !sparkedRef.current;
      setSparked(sparkedRef.current);
    }
  ;

  // Espone handleLove a MasonryGrid tramite ref
  useImperativeHandle(ref, () => ({ triggerLove: handleLove }));

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-lg"
      style={{
        transform: "translateZ(0)",
        boxShadow: glowing
          ? "0 0 0 2px rgba(232,0,13,0.7), 0 0 28px rgba(232,0,13,0.3)"
          : "0 0 0 0px transparent",
        transition: "box-shadow 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      onMouseEnter={() => {
        if (!viewed) {
          setViewed(true);
          setViewBouncing(true);
          setTimeout(() => setViewBouncing(false), 500);
        }
      }}
    >
      {imgError && (
        <div
          className="w-full rounded-lg flex flex-col items-center justify-center text-center px-4 py-10"
          style={{
            minHeight: 220,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="mb-3 rounded-full flex items-center justify-center"
            style={{
              width: 42,
              height: 42,
              background: "rgba(232,0,13,0.12)",
              color: "#E8000D",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            !
          </div>
          <p className="text-white text-sm font-semibold">
            Immagine non disponibile
          </p>
          <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
            Il sito potrebbe bloccare l'hotlinking.
          </p>
        </div>
      )}

      {!imgError && (
        <img
          src={image.url}
          alt={image.title}
          className="w-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
          onLoad={() => setImgError(false)}
          style={{
            transition: "transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            pointerEvents: "none",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.04)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      )}
      

      {image.loves >= 1000 && (
        <div
          className="absolute top-2 left-2 z-10"
          style={{
            opacity: 0,
            transform: "translateY(-4px)",
            animation:
              "badge-enter 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms forwards",
          }}
        >
          <TrendingBadge loves={image.loves} />
        </div>
      )}
      {/* Cuore fisso — visibile solo su touch device, stesso angolo del pulsante hover */}
      <div
        className="absolute top-2 right-2 z-10 touch-love-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleLove(e);
        }}
      >
        <div
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold
      ${sparked ? "bg-[#E8000D] text-white" : "bg-white/90 text-[#E8000D]"}`}
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            boxShadow: sparked
              ? "0 0 12px rgba(232,0,13,0.45)"
              : "0 2px 8px rgba(0,0,0,0.25)",
            transition:
              "background 250ms ease, box-shadow 250ms ease, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: animating ? "scale(1.15)" : "scale(1)",
          }}
        >
          <FaHeart
            style={{
              fontSize: "11px",
              transform: animating
                ? "scale(1.4) rotate(-15deg)"
                : "scale(1) rotate(0deg)",
              transition: "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
          {sparked ? "Loving" : "Love"}
        </div>
      </div>
      <div
        className="absolute inset-0 flex flex-col justify-between p-3"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)",
          opacity: 0,
          transition: "opacity 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
      >
        <div
          className="flex justify-end"
          style={{
            transform: "translateY(-6px)",
            opacity: 0,
            transition:
              "transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 320ms ease",
          }}
          ref={(el) => {
            if (!el) return;
            const card = el.closest(".group");
            const show = () => {
              el.style.transform = "translateY(0)";
              el.style.opacity = "1";
            };
            const hide = () => {
              el.style.transform = "translateY(-6px)";
              el.style.opacity = "0";
            };
            card.addEventListener("mouseenter", show);
            card.addEventListener("mouseleave", hide);
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLove(e);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
              ${sparked ? "bg-[#E8000D] text-white" : "bg-white text-[#E8000D]"}`}
            style={{
              transition:
                "background 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), color 250ms ease, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: sparked
                ? "0 0 12px rgba(232,0,13,0.45)"
                : "0 2px 8px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={(e) => {
              if (!sparked) {
                e.currentTarget.style.background = "#E8000D";
                e.currentTarget.style.color = "white";
              }
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              if (!sparked) {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "#E8000D";
              }
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <FaHeart
              style={{
                fontSize: "12px",
                transform: animating
                  ? "scale(1.5) rotate(-15deg)"
                  : "scale(1) rotate(0deg)",
                transition: "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
            {sparked ? "I'm loving it" : "Love it"}
          </button>
        </div>

        <div
          className="flex items-end justify-between gap-2"
          style={{
            transform: "translateY(8px)",
            opacity: 0,
            transition:
              "transform 440ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 340ms ease",
          }}
          ref={(el) => {
            if (!el) return;
            const card = el.closest(".group");
            const show = () => {
              el.style.transform = "translateY(0)";
              el.style.opacity = "1";
            };
            const hide = () => {
              el.style.transform = "translateY(8px)";
              el.style.opacity = "0";
            };
            card.addEventListener("mouseenter", show);
            card.addEventListener("mouseleave", hide);
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={image.avatar}
                alt={image.author}
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full object-cover border-2 border-white/60"
                style={{
                  transition:
                    "border-color 300ms ease, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
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
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate leading-tight">
                {image.title}
              </p>
              <p className="text-neutral-300 text-xs truncate leading-tight">
                @{image.author}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
            <div className="flex items-center gap-1">
              <FaEye className="text-white/40 text-[10px]" />
              <span
                className="text-[10px] tabular-nums"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  display: "inline-block",
                  animation: viewBouncing
                    ? "counter-bounce 500ms cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "none",
                }}
              >
                {fmt(localViews)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FaHeart
                className="text-[#E8000D] text-[10px]"
                style={{
                  transform: animating ? "scale(1.4)" : "scale(1)",
                  transition:
                    "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
              <span
                className="text-white text-[10px] font-semibold tabular-nums"
                style={{
                  display: "inline-block",
                  animation: bouncing
                    ? "counter-bounce 500ms cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "none",
                }}
              >
                {fmt(localLoves)}
              </span>
            </div>
            <div
              style={{
                opacity: sparked ? 1 : 0.85,
                transition: "opacity 300ms ease",
              }}
            >
              <LoversPreview lovers={localLovers} loves={localLoves} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ImageCard;