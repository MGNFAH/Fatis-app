import { useState, useRef, useEffect } from "react";
import { useRotatingPlaceholder } from "../hooks/useRotatingPlaceholder";
import { fakeImages } from "../data/placeholderImages.js"; // ← dati condivisi

export default function SearchBar({ onSelectImage }) {
  // ← prop aggiunta
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const { placeholder, visible } = useRotatingPlaceholder(3000);
  const containerRef = useRef(null);

  const results =
    value.trim().length === 0
      ? []
      : fakeImages.filter(
          (r) =>
            r.title.toLowerCase().includes(value.toLowerCase()) ||
            r.author.toLowerCase().includes(value.toLowerCase()),
        );

  const showDropdown = focused && results.length > 0;
  const showPlaceholder = value.length === 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center rounded-full px-4 py-2 border transition-all duration-300"
        style={{
          width: focused ? "440px" : "384px",
          background: focused
            ? "rgba(255,255,255,0.12)"
            : "rgba(255,255,255,0.08)",
          borderColor: focused
            ? "rgba(255,255,255,0.35)"
            : "rgba(255,255,255,0.1)",
          boxShadow: focused ? "0 0 0 3px rgba(232,0,13,0.15)" : "none",
        }}
      >
        <span
          className="mr-2 flex-shrink-0 transition-all duration-300"
          style={{
            color: focused ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
          }}
        >
          🔍
        </span>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          className="w-full text-sm text-white bg-transparent border-none outline-none ring-0 shadow-none appearance-none placeholder-transparent"
        />

        {showPlaceholder && (
          <span
            className="absolute left-10 text-sm pointer-events-none select-none"
            style={{
              color: "rgba(255,255,255,0.3)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0px)" : "translateY(-4px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            {placeholder}
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl z-50">
          {results.map((item) => (
            <div
              key={item.id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onSelectImage(item); // ← apre il modale con dati completi
                setValue("");
                setFocused(false);
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-white text-sm truncate">{item.title}</p>
                <p className="text-neutral-500 text-xs">@{item.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
