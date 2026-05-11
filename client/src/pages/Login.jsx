import { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // reset errore quando l'utente scrive
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validazione minima
    if (!form.email || !form.password) {
      setError("Compila tutti i campi.");
      return;
    }

    setIsLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/"); // redirect alla home dopo login
    } catch (err) {
      setError("Email o password non corretti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Bentornato" subtitle="Accedi al tuo account Fatis">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="la-tua@email.com"
            autoComplete="email"
            className="w-full bg-neutral-900 text-white text-sm rounded-xl px-4 py-3 outline-none placeholder-neutral-600 transition"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(232,0,13,0.5)")}
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.08)")
            }
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              className="text-neutral-500 hover:text-neutral-300 text-xs transition"
            >
              Password dimenticata?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-neutral-900 text-white text-sm rounded-xl px-4 py-3 pr-11 outline-none placeholder-neutral-600 transition"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(232,0,13,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.08)")
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition text-xs"
            >
              {showPassword ? "Nascondi" : "Mostra"}
            </button>
          </div>
        </div>

        {/* Errore */}
        {error && (
          <p
            className="text-sm px-4 py-3 rounded-xl"
            style={{
              background: "rgba(232,0,13,0.1)",
              border: "1px solid rgba(232,0,13,0.2)",
              color: "#ff4d4d",
            }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all"
          style={{
            background: isLoading ? "rgba(232,0,13,0.5)" : "#E8000D",
            transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {isLoading ? "Accesso in corso..." : "Accedi"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-neutral-600 text-xs">oppure</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Link a Register */}
        <p className="text-center text-neutral-500 text-sm">
          Non hai un account?{" "}
          <Link
            to="/register"
            className="font-semibold transition"
            style={{ color: "#E8000D" }}
          >
            Registrati
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
