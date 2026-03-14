// src/components/Loader.jsx
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900">
      <div className="relative flex flex-col items-center gap-8">
        {/* Hexagon spinner */}
        <div className="relative w-24 h-24">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border border-neon-blue rounded-sm"
              style={{ borderRadius: "4px" }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 2,
                delay: i * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <defs>
                <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#9b59ff" />
                </linearGradient>
              </defs>
              <polygon
                points="20,2 38,11 38,29 20,38 2,29 2,11"
                fill="url(#lg)"
                opacity="0.8"
              />
              <text
                x="20"
                y="26"
                fontFamily="Orbitron"
                fontSize="14"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
              >
                N
              </text>
            </svg>
          </motion.div>
        </div>

        {/* Scanning line */}
        <div className="relative w-48 h-px bg-dark-700 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full w-16"
            style={{
              background: "linear-gradient(90deg, transparent, #00d4ff, transparent)",
            }}
            animate={{ x: [-64, 192] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Text */}
        <motion.p
          className="font-mono text-xs tracking-[0.4em] text-neon-blue uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Initializing ODYSSEY
        </motion.p>
      </div>
    </div>
  );
}
