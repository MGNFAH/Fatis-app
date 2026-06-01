import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { FaFire } from "react-icons/fa";
import LoveGauge from "./LoveGauge";
import SearchBar from "./SearchBar";
import { useAuth } from "../hooks/useAuth";

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
      className="w-8 h-8 rounded-full object-cover"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-[#E8000D] flex items-center justify-center text-white text-xs font-bold">
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
  const streakDays = 3;

  useEffect(() => {
    if (sparkCount > prevCount.current) {
      setStreakBump(true);
      setTimeout(() => setStreakBump(false), 600);
      prevCount.current = sparkCount;
    }
  }, [sparkCount]);

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
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-14"
      style={{
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* LEFT — Logo + links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <FaFire className="text-[#E8000D]" size={18} />
          <span className="text-white font-black text-lg tracking-tight">Fatis</span>
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm text-white/50">
          <Link to="/" className="hover:text-white transition-colors">Explore</Link>
          <span className="text-white/15">|</span>
          <Link to="/" className="hover:text-white transition-colors">Careers</Link>
          <span className="text-white/15">|</span>
          <LoveGauge />
          <span className="text-white/15">|</span>
          {/* 🔥 Streak */}
          <span
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(232,0,13,0.12)",
              color: "#E8000D",
              transform: streakBump ? "scale(1.15)" : "scale(1)",
              transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            🔥 {streakDays} {streakDays === 1 ? "day" : "days"}
          </span>
        </div>
      </div>

      {/* CENTER — Search */}
      <SearchBar onSelectImage={onSelectImage} />

      {/* RIGHT — Auth */}
      <div className="flex items-center gap-3">
        <span className="text-lg cursor-pointer">📷</span>
        <span className="text-lg cursor-pointer">🌈</span>
        {user ? (
          /* ── LOGGED IN: avatar + dropdown ── */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-white/20 transition-all p-0.5"
              aria-label="User menu"
            >
              <NavAvatar user={user} />
            </button>
            {dropdownOpen && (
              <div
                className="absolute right-0 top-12 rounded-2xl overflow-hidden z-50 min-w-[200px]"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                {/* User info */}
                <div
                  className="px-4 py-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-white font-semibold text-sm">{user.name}</p>
                  <p className="text-white/40 text-xs">{user.email}</p>
                </div>
                {/* Profile link */}
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  My profile
                </Link>
                {/* Collections link */}
                <Link
                  to="/collections"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  My collections
                </Link>
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors w-full text-left"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── NOT LOGGED IN: Login + Sign up ── */
          <>
            <Link to="/login" className="text-white/60 hover:text-white text-sm transition-colors">Login</Link>
            <Link
              to="/register"
              className="text-sm font-semibold px-4 py-1.5 rounded-full text-white transition-colors"
              style={{ background: "#E8000D" }}
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
