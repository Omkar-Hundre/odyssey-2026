// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/helpers";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", college: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Please enter your full name.");
    if (!isValidEmail(form.email)) return setError("Enter a valid email.");
    if (!/^\d{10}$/.test(form.mobile)) return setError("Mobile number must be exactly 10 digits.");
    if (!form.college.trim()) return setError("Please enter your college name.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      await register(form.email, form.password, form.name, form.college, form.mobile);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      if (err.code === "auth/email-already-in-use")
        setError("This email is already registered. Try logging in.");
      else if (err.code === "auth/weak-password")
        setError("Password is too weak. Use at least 6 characters.");
      else setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Aryan Sharma" },
    { name: "email", label: "Email Address", type: "email", placeholder: "aryan@iit.ac.in" },
    { name: "mobile", label: "Mobile Number", type: "tel", placeholder: "9876543210", pattern: "[0-9]{10}" },
    { name: "college", label: "College / Institution", type: "text", placeholder: "NIT Trichy" },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
    { name: "confirm", label: "Confirm Password", type: "password", placeholder: "••••••••" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12 relative overflow-hidden grid-bg">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(155,89,255,0.05) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {success ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-10 text-center"
            style={{
              clipPath: "polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)",
            }}
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <motion.span 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="text-4xl text-green-400"
              >
                ✓
              </motion.span>
            </div>
            
            <h2 className="font-display text-2xl font-bold text-white mb-3 tracking-wider">
              Verification Required
            </h2>
            <p className="font-body text-white/50 text-sm mb-8 leading-relaxed">
              We've sent a verification link to <br/>
              <span className="text-neon-blue font-bold">{form.email}</span>. <br/>
              Please verify your email address to complete registration.
            </p>

            <div className="space-y-4">
              <a 
                href="https://mail.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-neon-filled w-full py-3 block text-center"
                style={{ background: "linear-gradient(135deg, #4285F4, #34A853)" }}
              >
                Go to Gmail
              </a>
              
              <Link 
                to="/login" 
                className="text-white/30 hover:text-white text-xs font-mono uppercase tracking-[0.2em] block transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </motion.div>
        ) : (
          <div
            className="glass-card p-8 md:p-10"
            style={{
              clipPath: "polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)",
            }}
          >
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-purple/60" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-purple/60" />

            <div className="flex justify-center mb-6">
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <defs>
                  <linearGradient id="regLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9b59ff" />
                    <stop offset="100%" stopColor="#00d4ff" />
                  </linearGradient>
                </defs>
                <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="url(#regLogo)" opacity="0.9" />
                <text x="20" y="25" fontFamily="Orbitron" fontSize="13" fontWeight="bold" fill="white" textAnchor="middle">JCE</text>
              </svg>
            </div>

            <h1 className="font-display font-bold text-2xl text-center text-white tracking-wider mb-1">
              Create Account
            </h1>
            <p className="font-mono text-xs text-white/30 text-center tracking-widest mb-8">
              ODYSSEY 2026 — REGISTRATION
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="font-mono text-xs text-white/40 tracking-widest uppercase block mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="input-neon w-full"
                    required
                  />
                </div>
              ))}

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 py-2 px-3 border border-red-500/30 bg-red-500/10"
                >
                  <span className="text-red-400 text-xs font-mono">⚠ {error}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-neon-filled w-full py-3 mt-2"
                style={{ background: "linear-gradient(135deg, #9b59ff, #00d4ff)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border border-white/60 border-t-white rounded-full block"
                    />
                    Creating account...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-body text-sm text-white/30">
                Already registered?{" "}
                <Link to="/login" className="text-neon-blue hover:text-neon-cyan transition-colors">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
