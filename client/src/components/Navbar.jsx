import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { FaFire } from "react-icons/fa";
import LoveGauge from "./LoveGauge";
import SearchBar from "./SearchBar";

export default function Navbar({ sparkCount, onSelectImage }) {
  // ← aggiunto onSelectImage
  const [streakBump, setStreakBump] = useState(false);
  const prevCount = useRef(sparkCount);
  const streakDays = 3;

  useEffect(() => {
    if (sparkCount > prevCount.current) {
      setStreakBump(true);
      setTimeout(() => setStreakBump(false), 600);
      prevCount.current = sparkCount;
    }
  }, [sparkCount]);

  return (
    <nav
      className="
      sticky top-0 z-50
      flex items-center justify-between px-6 py-3
      text-white
      bg-black/60 backdrop-blur-md
      border-b border-white/10
      shadow-[0_4px_24px_rgba(0,0,0,0.3)]
    "
    >
      {/* SINISTRA — Logo + pill */}
      <div className="flex items-center gap-3">
        <Link to="/" className="bg-white rounded-full p-2">
          <div className="w-6 h-6 bg-black rounded-full"></div>
        </Link>

        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
          <Link to="/explore" className="text-white font-semibold text-sm">
            Explore
          </Link>
          <span className="text-white/30 text-sm px-1">|</span>
          <Link to="#" className="text-white/60 text-sm">
            Careers
          </Link>
          <span className="text-white/30 text-sm px-1">|</span>

          <LoveGauge sparkCount={sparkCount} />

          <span className="text-white/30 text-sm px-1">|</span>

          {/* 🔥 Streak */}
          <div className="flex items-center gap-1">
            <FaFire
              className="text-orange-400 text-sm"
              style={{
                transform: streakBump ? "scale(1.4)" : "scale(1)",
                transition:
                  "transform 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
                filter: streakBump ? "drop-shadow(0 0 4px #fb923c)" : "none",
              }}
            />
            <span
              className="text-sm font-semibold"
              style={{
                color: streakBump ? "#fb923c" : "rgba(255,255,255,0.6)",
                transition: "color 0.4s ease",
              }}
            >
              {streakDays} {streakDays === 1 ? "giorno" : "giorni"}
            </span>
          </div>
        </div>
      </div>
      {/* CENTRO — Search */}
      <SearchBar onSelectImage={onSelectImage} />{" "}
      {/* ← ora onSelectImage esiste */}
      {/* DESTRA — Auth */}
      <div className="flex items-center gap-3">
        <button className="text-white/40 hover:text-white transition">
          📷
        </button>
        <button className="text-white/40 hover:text-white transition">
          🌈
        </button>
        <Link to="/login" className="text-white text-sm">
          Login
        </Link>
        <Link
          to="/register"
          className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-neutral-200 transition"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
}
