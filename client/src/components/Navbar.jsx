import { Link } from "react-router";

export default function Navbar() {
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
    </nav>
  );
}
