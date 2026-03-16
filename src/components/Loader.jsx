// src/components/Loader.jsx
import { motion } from "framer-motion";

export default function Loader() {
  const letters = "ODYSSEY".split("");
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080f18]">
      <div className="relative flex flex-col items-center">
        
        {/* Animated Geometric Decoration */}
        <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
          {/* Outer rotating frame */}
          <motion.div
            className="absolute inset-0 border-2 border-neon-blue/20"
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
              borderRadius: ["20%", "50%", "20%", "50%", "20%"],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner counter-rotating frame */}
          <motion.div
            className="absolute inset-4 border border-neon-purple/40"
            animate={{ 
              rotate: [360, 270, 180, 90, 0],
              borderRadius: ["50%", "20%", "50%", "20%", "50%"],
              scale: [0.9, 1, 0.9]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center Text */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative font-display font-black text-2xl text-white tracking-widest"
          >
            2K26
          </motion.div>
        </div>

        {/* ODYSSEY Letter Stagger Animation */}
        <div className="flex gap-2 mb-2">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1.5,
                ease: "circOut"
              }}
              className="font-display text-4xl md:text-6xl font-black text-white tracking-tighter"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Scanning status line */}
        <div className="w-48 h-[2px] bg-white/5 mt-8 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_15px_rgba(0,212,255,0.8)]"
            animate={{ x: [-100, 200] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6 font-mono text-[10px] tracking-[0.5em] text-white/30 uppercase"
        >
          Syncing Core Systems
        </motion.p>
      </div>
    </div>
  );
}
