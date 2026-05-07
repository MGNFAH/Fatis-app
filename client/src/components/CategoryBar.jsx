import { useState } from "react";

const categories = [
  "Featured",
  "Pittura",
  "Disegno",
  "Scultura",
  "Fotografia",
  "Arte Digitale",
  "Illustrazione",
  "Grafica",
  "Architettura",
  "Design",
  "Moda",
  "Cinema",
];

export default function CategoryBar() {
  const [active, setActive] = useState("Featured");

  return (
    <div className="flex items-center gap-2 px-6 py-3 bg-black overflow-x-auto scrollbar-hide border-t border-neutral-800">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm transition
            ${
              active === cat
                ? "bg-white text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
