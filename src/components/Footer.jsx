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

      <div>
        <div className="flex items-center justify-center gap-3 mb-4 mt-5">
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

        <div className="mt-4 flex justify-center">
          <span className="tag text-xs">Jain College Of Engineering, Belagavi</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* EVENT INFO */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-white mb-3">
              EVENT INFO
            </h3>
            <div className="w-10 h-[2px] bg-neon-cyan mb-4" />
            <a
              href="https://drive.google.com/file/d/1F2UPdhmeuprSyw-UsxQ59TYDATHwN-EH/view?usp=sharing"
              className="text-sm text-white/60 hover:text-neon-cyan transition"
            >
              RULEBOOK ODYSSEY – Download
            </a>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-white mb-3">
              ACADEMIC TEAM
            </h3>
            <div className="w-10 h-[2px] bg-neon-cyan mb-4" />

            <div className="space-y-3 text-sm text-white/60">
              <div>
                <p className="text-white">Dr. J. Shivakumar</p>
                <p className="text-xs text-white/40">Principal & Director</p>
              </div>

              <div>
                <p className="text-white">Dr. S. Rohitraj </p>
                <p className="text-xs text-white/40">Convenor</p>
              </div>

              <div>
                <p className="text-white">Prof. Varsha Gokak</p>
                <p className="text-xs text-white/40">Event Coordinator</p>
              </div>
              <div>
                <p className="text-white">Prof. Shahak Patil</p>
                <p className="text-xs text-white/40">SEC coordinator</p>
              </div>
            </div>
          </div>

          {/* DEVELOPERS */}
          {/* DEVELOPERS */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-white mb-3">
              DEVELOPERS
            </h3>
            <div className="w-10 h-[2px] bg-neon-cyan mb-4" />

            <div className="space-y-2 text-sm text-white/60">

              <Link to="/developers" className="hover:text-neon-cyan transition block">
                Abhay Patange
              </Link>

              <Link to="/developers" className="hover:text-neon-cyan transition block">
                Omkar Hundre
              </Link>

              <Link to="/developers" className="hover:text-neon-cyan transition block">
                Bhuvan
              </Link>

              <Link to="/developers" className="hover:text-neon-cyan transition block">
                Kishan
              </Link>

              <Link to="/developers" className="hover:text-neon-cyan transition block">
                Vivek
              </Link>

            </div>
          </div>

          {/* ACADEMIC TEAM */}


          {/* CONTACT */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-white mb-3">
              CONTACT
            </h3>
            <div className="w-10 h-[2px] bg-neon-cyan mb-4" />

            <div className="space-y-2 text-sm text-white/60">
              <p>Jain College Of Engineering, Belagavi</p>
              <p>+91 8412411192</p>
              <a
                href="https://odyssey-2k25.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neon-cyan transition"
              >
                Info@Jainbgm.in
              </a>
            </div>


          </div>
          {/* Brand */}





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
    </footer >
  );
}
