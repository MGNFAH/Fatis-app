import { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Rimuove l'errore del campo appena l'utente inizia a scrivere
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Inserisci il tuo nome.";
    if (!form.username.trim()) newErrors.username = "Scegli un username.";
    else if (form.username.includes(" "))
      newErrors.username = "Lo username non può contenere spazi.";
    if (!form.email.trim()) newErrors.email = "Inserisci la tua email.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email non valida.";
    if (!form.password) newErrors.password = "Inserisci una password.";
    else if (form.password.length < 6)
      newErrors.password = "Minimo 6 caratteri.";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Conferma la password.";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Le password non coincidono.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register(form.name, form.username, form.email);
      navigate("/");
    } catch (err) {
      setErrors({ general: "Errore durante la registrazione. Riprova." });
    } finally {
      setIsLoading(false);
    }
  };

  // Stile input riutilizzabile
  const inputClass =
    "w-full bg-neutral-900 text-white text-sm rounded-xl px-4 py-3 outline-none placeholder-neutral-600 transition";
  const inputStyle = { border: "1px solid rgba(255,255,255,0.08)" };
  const onFocus = (e) => (e.target.style.borderColor = "rgba(232,0,13,0.5)");
  const onBlur = (e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)");

  return (
    <AuthLayout
      title="Crea il tuo account"
      subtitle="Unisciti alla community di artisti Fatis"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Nome */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
            Nome completo
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Mario Rossi"
            autoComplete="name"
            className={inputClass}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {errors.name && (
            <p className="text-xs" style={{ color: "#ff4d4d" }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
              @
            </span>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="mario_art"
              autoComplete="username"
              className={`${inputClass} pl-8`}
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
          {errors.username && (
            <p className="text-xs" style={{ color: "#ff4d4d" }}>
              {errors.username}
            </p>
          )}
        </div>

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
            className={inputClass}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {errors.email && (
            <p className="text-xs" style={{ color: "#ff4d4d" }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`${inputClass} pr-20`}
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition text-xs"
            >
              {showPassword ? "Nascondi" : "Mostra"}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs" style={{ color: "#ff4d4d" }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Conferma Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
            Conferma password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="new-password"
            className={inputClass}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {errors.confirmPassword && (
            <p className="text-xs" style={{ color: "#ff4d4d" }}>
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Errore generale */}
        {errors.general && (
          <p
            className="text-sm px-4 py-3 rounded-xl"
            style={{
              background: "rgba(232,0,13,0.1)",
              border: "1px solid rgba(232,0,13,0.2)",
              color: "#ff4d4d",
            }}
          >
            {errors.general}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white mt-1"
          style={{
            background: isLoading ? "rgba(232,0,13,0.5)" : "#E8000D",
            transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {isLoading ? "Registrazione in corso..." : "Crea account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-neutral-600 text-xs">oppure</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Link a Login */}
        <p className="text-center text-neutral-500 text-sm">
          Hai già un account?{" "}
          <Link
            to="/login"
            className="font-semibold transition"
            style={{ color: "#E8000D" }}
          >
            Accedi
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
