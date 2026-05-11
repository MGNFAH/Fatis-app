import { Link } from "react-router";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* ── Colonna sinistra: brand panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a0002 0%, #0d0d0d 60%, #1a0002 100%)",
        }}
      >
        {/* Glow decorativo */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(232,0,13,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Logo + claim */}
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-2xl"
              style={{ background: "#E8000D" }}
            >
              F
            </div>
            <span className="text-white text-3xl font-black tracking-tight">
              FATIS
            </span>
          </Link>

          <p className="text-neutral-400 text-lg leading-relaxed max-w-sm">
            Trova ispirazione, condividi il tuo lavoro,
            <br />
            connettiti con altri artisti.
          </p>

          {/* Tre pillole decorative */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {[
              "#oilpainting",
              "#pleinair",
              "#napoli",
              "#inspiration",
              "#artcommunity",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full text-neutral-400"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Colonna destra: form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {/* Logo mobile (visibile solo sotto lg) */}
        <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg"
            style={{ background: "#E8000D" }}
          >
            F
          </div>
          <span className="text-white text-xl font-black tracking-tight">
            FATIS
          </span>
        </Link>

        {/* Card del form */}
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-white text-2xl font-bold mb-1">{title}</h1>
            <p className="text-neutral-400 text-sm">{subtitle}</p>
          </div>

          {/* Qui dentro arriva il form di Login o Register */}
          {children}
        </div>
      </div>
    </div>
  );
}
