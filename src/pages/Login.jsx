// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/helpers";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.code;
      if (msg === "auth/user-not-found") setError("No account found with this email.");
      else if (msg === "auth/wrong-password") setError("Incorrect password.");
      else if (msg === "auth/invalid-credential") setError("Invalid email or password.");
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12 relative overflow-hidden grid-bg">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,212,255,0.05) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div
          className="glass-card p-8 md:p-10"
          style={{
            clipPath: "polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)",
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-blue/60" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-blue/60" />

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <svg viewBox="0 0 40 40" className="w-12 h-12">
              <defs>
                <linearGradient id="loginLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#9b59ff" />
                </linearGradient>
              </defs>
              <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="url(#loginLogo)" opacity="0.9" />
              <text x="20" y="25" fontFamily="Orbitron" fontSize="13" fontWeight="bold" fill="white" textAnchor="middle">JCE</text>
            </svg>
          </div>

          <h1 className="font-display font-bold text-2xl text-center text-white tracking-wider mb-1">
            Access Terminal
          </h1>
          <p className="font-mono text-xs text-white/30 text-center tracking-widest mb-8">
            ODYSSEY 2025 — LOGIN
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="font-mono text-xs text-white/40 tracking-widest uppercase block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="input-neon w-full"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-mono text-xs text-white/40 tracking-widest uppercase block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-neon w-full"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 py-2 px-3 border border-red-500/30 bg-red-500/10"
              >
                <span className="text-red-400 text-xs font-mono">⚠ {error}</span>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-neon-filled w-full py-3 mt-2 relative"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border border-white/60 border-t-white rounded-full block"
                  />
                  Authenticating...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-body text-sm text-white/30">
              No account?{" "}
              <Link to="/register" className="text-neon-blue hover:text-neon-cyan transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
