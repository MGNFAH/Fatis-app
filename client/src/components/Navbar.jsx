import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { FaFire, FaCamera, FaPalette } from "react-icons/fa";
import LoveGauge from "./LoveGauge";
import SearchBar from "./SearchBar";
import { useAuth } from "../hooks/useAuth";

// Componente avatar riutilizzabile
function NavAvatar({ user }) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return user?.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      className="w-8 h-8 rounded-full object-cover border border-white/20"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-xs font-bold text-white border border-white/20">
      {initials}
    </div>
  );
}

export default function Navbar({ sparkCount, onSelectImage }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [streakBump, setStreakBump] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const prevCount = useRef(sparkCount);
  const dropdownRef = useRef(null);

  // Streak reale dal backend tramite il contesto utente
  const streakDays = user?.streakDays ?? 0;

  // Animazione bump quando sparkCount aumenta
  useEffect(() => {
    if (sparkCount > prevCount.current) {
      setStreakBump(true);
      setTimeout(() => setStreakBump(false), 600);
      prevCount.current = sparkCount;
    }
  }, [sparkCount]);

  // Chiude il dropdown cliccando fuori
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  };

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

          {/* Day Streak */}
          <div className="flex items-center gap-1">
            <FaFire
              className="text-orange-400 text-sm"
              style={{
                transform: streakBump ? "scale(1.4)" : "scale(1)",
                transition: "transform 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
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
              {streakDays} {streakDays === 1 ? "day" : "days"}
            </span>
          </div>
        </div>
      </div>

      {/* CENTRO — Search */}
      <SearchBar onSelectImage={onSelectImage} />

      {/* DESTRA — Auth dinamica */}
      <div className="flex items-center gap-3">
        <button
          className="text-white/40 hover:text-white transition"
          aria-label="Upload image"
        >
          <FaCamera className="text-base" />
        </button>
        <button
          className="text-white/40 hover:text-white transition"
          aria-label="Color palette"
        >
          <FaPalette className="text-base" />
        </button>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-white/20 transition-all p-0.5"
              aria-label="User menu"
            >
              <NavAvatar user={user} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-white/8">
                  <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-white/40 text-xs truncate">{user.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My profile
                </Link>

                <Link
                  to="/collections"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  My collections
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors border-t border-white/8"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="text-white text-sm">Login</Link>
            <Link
              to="/register"
              className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-neutral-200 transition"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
