import { useState, useRef, useEffect } from "react";
import { useRotatingPlaceholder } from "../hooks/useRotatingPlaceholder";

// Dati fake per MVP — verranno dal backend
const FAKE_RESULTS = [
  {
    id: 1,
    title: "La Notte Stellata",
    author: "vangogh_fan",
    url: "https://picsum.photos/seed/starrynight/40/40",
  },
  {
    id: 2,
    title: "Mona Lisa",
    author: "louvre_official",
    url: "https://picsum.photos/seed/monalisa/40/40",
  },
  {
    id: 3,
    title: "L'Urlo",
    author: "munch_archive",
    url: "https://picsum.photos/seed/scream/40/40",
  },
  {
    id: 4,
    title: "Ragazza con l'Orecchino di Perla",
    author: "vermeer_studio",
    url: "https://picsum.photos/seed/girlpearl/40/40",
  },
  {
    id: 5,
    title: "La Creazione di Adamo",
    author: "michelangelo_study",
    url: "https://picsum.photos/seed/sistine/40/40",
  },
  {
    id: 6,
    title: "Ninfee",
    author: "monet_impressions",
    url: "https://picsum.photos/seed/waterlilies/40/40",
  },
  {
    id: 7,
    title: "Ofelia",
    author: "millais_preraffaelliti",
    url: "https://picsum.photos/seed/ophelia/40/40",
  },
  {
    id: 8,
    title: "La Persistenza della Memoria",
    author: "dali_surreal",
    url: "https://picsum.photos/seed/persistence/40/40",
  },
  {
    id: 9,
    title: "La Grande Onda di Kanagawa",
    author: "hokusai_prints",
    url: "https://picsum.photos/seed/greattwave/40/40",
  },
  {
    id: 10,
    title: "Proserpina",
    author: "rossetti_preraffaelliti",
    url: "https://picsum.photos/seed/proserpine/40/40",
  },
  {
    id: 11,
    title: "La Nascita di Venere",
    author: "botticelli_archive",
    url: "https://picsum.photos/seed/birthvenus/40/40",
  },
  {
    id: 12,
    title: "Las Meninas",
    author: "velazquez_royal",
    url: "https://picsum.photos/seed/lasmeninas/40/40",
  },
];

export default function SearchBar() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const { placeholder, visible } = useRotatingPlaceholder(3000);
  const containerRef = useRef(null);

  // Filtra i risultati in base al testo inserito
  const results =
    value.trim().length === 0
      ? []
      : FAKE_RESULTS.filter(
          (r) =>
            r.title.toLowerCase().includes(value.toLowerCase()) ||
            r.author.toLowerCase().includes(value.toLowerCase()),
        );

  const showDropdown = focused && results.length > 0;
  const showPlaceholder = value.length === 0;

  // Chiudi dropdown cliccando fuori
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
      {/* Barra */}
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
          className="
            w-full text-sm text-white
            bg-transparent border-none outline-none
            ring-0 shadow-none appearance-none
            placeholder-transparent
          "
        />

        {/* Placeholder rotante */}
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

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl z-50">
          {results.map((item) => (
            <div
              key={item.id}
              onMouseDown={(e) => e.preventDefault()} // evita blur prima del click
              onClick={() => {
                setValue(item.title);
                setFocused(false);
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors"
            >
              {/* Thumbnail */}
              <img
                src={item.url}
                alt={item.title}
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
              />
              {/* Testo */}
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
