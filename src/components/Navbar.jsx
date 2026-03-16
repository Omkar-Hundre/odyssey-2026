// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Events", path: "/events" },
  { label: "Dashboard", path: "/dashboard" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "py-3 glass-card border-b border-neon-blue/20"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <defs>
                  <linearGradient id="navLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#9b59ff" />
                  </linearGradient>
                </defs>
                <polygon
                  points="20,2 38,11 38,29 20,38 2,29 2,11"
                  fill="url(#navLogo)"
                  opacity="0.9"
                />
                <text
                  x="20"
                  y="25"
                  fontFamily="Orbitron"
                  fontSize="13"
                  fontWeight="bold"
                  fill="white"
                  textAnchor="middle"
                >
                  JCE
                </text>
              </svg>
            </motion.div>
            <div>
              <span className="font-display font-bold text-xl tracking-widest neon-text">
                ODYSSEY
              </span>
              <span className="font-mono text-xs text-white/30 block -mt-1 tracking-[0.3em]">
                2025
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.filter(link => link.path !== "/dashboard" || currentUser).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-body font-semibold text-sm tracking-widest uppercase transition-colors duration-300 ${
                  location.pathname === link.path
                    ? "text-neon-blue text-glow-blue"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, #00d4ff, #9b59ff)" }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth button */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-white/40 tracking-wider">
                  {currentUser.displayName || currentUser.email?.split("@")[0]}
                </span>
                <button onClick={handleLogout} className="btn-neon text-xs py-2 px-5">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-neon text-xs py-2 px-5">
                  Login
                </Link>
                <Link to="/register" className="btn-neon-filled text-xs py-2 px-5">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-px bg-neon-blue"
                animate={{
                  width: mobileOpen
                    ? i === 1
                      ? "0px"
                      : "24px"
                    : "24px",
                  rotate:
                    mobileOpen
                      ? i === 0
                        ? 45
                        : i === 2
                        ? -45
                        : 0
                      : 0,
                  y: mobileOpen ? (i === 0 ? 8 : i === 2 ? -8 : 0) : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-30 glass-card border-b border-neon-blue/20 py-6 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.filter(link => link.path !== "/dashboard" || currentUser).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-body font-semibold tracking-widest uppercase text-sm py-2 border-b border-white/5 ${
                    location.pathname === link.path
                      ? "text-neon-blue"
                      : "text-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-2">
                {currentUser ? (
                  <button
                    onClick={handleLogout}
                    className="btn-neon text-xs py-2 flex-1"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="btn-neon text-xs py-2 flex-1 text-center">
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn-neon-filled text-xs py-2 flex-1 text-center"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
