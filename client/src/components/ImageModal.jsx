import { useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function ImageModal({ image, onClose }) {
  const [loved, setLoved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 rounded-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Immagine sinistra */}
        <div className="md:w-1/2 bg-black flex items-center justify-center">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-contain max-h-[92vh]"
          />
        </div>

        {/* Info destra */}
        <div className="md:w-1/2 p-6 flex flex-col gap-5 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold">@{image.author}</p>
            <div className="flex items-center gap-2">
              {/* Menu "..." */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-neutral-400 hover:text-white px-2 py-1 rounded-lg hover:bg-neutral-800 transition"
                >
                  •••
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-neutral-800 rounded-xl shadow-lg z-10 overflow-hidden text-sm">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(image.source);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-white transition flex items-center gap-2"
                    >
                      🔗 Condividi spark
                    </button>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-neutral-300 transition flex items-center gap-2"
                    >
                      👤 Vedi profilo di @{image.author}
                    </button>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-red-400 transition flex items-center gap-2"
                    >
                      🚩 Segnala contenuto
                    </button>
                  </div>
                )}
              </div>

              {/* Chiudi */}
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white px-2 py-1 rounded-lg hover:bg-neutral-800 transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Titolo */}
          <h2 className="text-white text-xl font-bold">{image.title}</h2>

          {/* Caption */}
          {image.caption && (
            <p className="text-neutral-300 text-sm leading-relaxed">
              {image.caption}
            </p>
          )}

          {/* Source */}
          {image.source && (
            <div className="text-sm">
              <span className="text-neutral-500 font-medium uppercase tracking-wider text-xs">
                Source
              </span>
              <a
                href={image.source}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-yellow-400 hover:text-yellow-300 truncate mt-1 transition"
              >
                {image.source}
              </a>
            </div>
          )}

          <div className="border-t border-neutral-700" />

          {/* Stats */}
          <div className="flex gap-6 text-sm text-neutral-400">
            <span>
              👁{" "}
              <strong className="text-white">
                {image.views?.toLocaleString()}
              </strong>{" "}
              visualizzazioni
            </span>
            <span>
              <FaHeart className="inline text-[#E8000D] mr-1" />
              <strong className="text-white">
                {loved ? image.loves + 1 : image.loves}
              </strong>{" "}
              I'm loving it
            </span>
          </div>

          {/* Pulsante */}
          <button
            onClick={() => setLoved(!loved)}
            className={`mt-auto px-6 py-3 rounded-full font-semibold text-sm transition-all
              ${loved ? "bg-[#E8000D] text-white scale-95" : "bg-white text-[#E8000D] hover:bg-[#E8000D] hover:text-white"}`}
          >
            {loved ? "❤️ I'm loving it!" : "🤍 Love it"}
          </button>
        </div>
      </div>
    </div>
  );
}
