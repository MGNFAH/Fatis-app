import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { FaHeart } from "react-icons/fa";

export default function Navbar({ sparkCount }) {
    const [bump, setBump] = useState(false)
  const prevCount = useRef(sparkCount)

  useEffect(() => {
    if (sparkCount > prevCount.current) {
      setBump(true)
      setTimeout(() => setBump(false), 400)
      prevCount.current = sparkCount
    }
  }, [sparkCount])
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-black text-white">
      {/* SINISTRA — Logo + link */}
      <div className="flex items-center gap-3">
        <Link to="/" className="bg-white rounded-full p-2">
          {/* Logo — sostituisci con il tuo */}
          <div className="w-6 h-6 bg-black rounded-full"></div>
        </Link>
        <div className="flex items-center gap-1 bg-neutral-800 rounded-full px-4 py-2">
          <Link to="/explore" className="text-white font-semibold text-sm">
            Explore
          </Link>
          <span className="text-neutral-500 text-sm px-1">|</span>
          <Link to="#" className="text-neutral-400 text-sm">
            Careers
          </Link>
        </div>
      </div>

      {/* CENTRO — Barra di ricerca */}
      <div className="flex items-center bg-neutral-800 rounded-full px-4 py-2 w-96">
        <span className="text-neutral-400 mr-2">🔍</span>
        <input
          type="text"
          placeholder="Search Fatis..."
          className="bg-transparent text-white text-sm outline-none w-full placeholder-neutral-500"
        />
      </div>

      {/* DESTRA — Icone + auth */}
      <div className="flex items-center gap-3">
        <button className="text-neutral-400 hover:text-white">📷</button>
        <button className="text-neutral-400 hover:text-white">🌈</button>
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
      {/* Spark counter */}
      <div className="flex items-center gap-2 text-neutral-300 text-sm">
        <div className="relative">
          <FaHeart
            className={`text-[#E8000D] text-lg transition-transform ${bump ? "scale-150" : "scale-100"}`}
            style={{
              transition: "transform 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
            }}
          />
          {sparkCount > 0 && (
            <span
              className={`absolute -top-2 -right-2 bg-[#E8000D] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center
                ${bump ? "scale-125" : "scale-100"}`}
              style={{
                transition:
                  "transform 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
              }}
            >
              {sparkCount}
            </span>
          )}
        </div>
        <span>
          {sparkCount === 0 ? "Nessun love" : `${sparkCount} loved `}
        </span>
      </div>
    </nav>
  );
}
