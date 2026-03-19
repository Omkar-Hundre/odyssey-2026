// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";



export default function Footer() {
  const { currentUser } = useAuth();
  return (
    <footer className="relative border-t border-neon-blue/10 bg-dark-800">
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #00d4ff44, #9b59ff44, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
             <Link to="/" className="flex items-center group">
            <motion.img
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
              src="/odysseyLogo.png"
              alt="Odyssey Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
              <span className="font-display font-bold text-lg tracking-widest neon-text">ODYSSEY 2026</span>
            </div>
           
            <div className="mt-4">
              <span className="tag text-xs">Jain College Of Engineering, Belagavi</span>
            </div>
          </div>



         
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-white/20">
            © 2026 ODYSSEY — All rights reserved
          </p>
          <p className="font-mono text-xs text-white/20">
           Built with passion, for the passionate
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            <span className="font-mono text-xs text-white/20">
              System Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
