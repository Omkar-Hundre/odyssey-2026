// src/components/CountdownTimer.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTimeRemaining } from "../utils/helpers";

const FEST_DATE = "2025-03-15T10:00:00";

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Background card */}
        <div
          className="w-16 md:w-20 h-16 md:h-20 flex items-center justify-center"
          style={{
            background: "rgba(13, 24, 41, 0.8)",
            border: "1px solid rgba(0, 212, 255, 0.2)",
            clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
          }}
        >
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl md:text-3xl font-bold text-neon-blue text-glow-blue"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-blue/60" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-blue/60" />
      </div>
      <span className="mt-2 font-mono text-xs tracking-[0.2em] uppercase text-white/30">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ targetDate = FEST_DATE }) {
  const [time, setTime] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      const t = getTimeRemaining(targetDate);
      setTime(t);
      if (t.total <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (time.total <= 0) {
    return (
      <div className="text-center">
        <motion.p
          className="font-display text-2xl font-bold neon-text"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ODYSSEY IS LIVE NOW
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 md:gap-5">
      <TimeBlock value={time.days} label="Days" />
      <div className="flex flex-col gap-2 pt-4">
        <motion.span
          className="block w-1 h-1 rounded-full bg-neon-blue"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.span
          className="block w-1 h-1 rounded-full bg-neon-blue"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
      </div>
      <TimeBlock value={time.hours} label="Hours" />
      <div className="flex flex-col gap-2 pt-4">
        <motion.span
          className="block w-1 h-1 rounded-full bg-neon-blue"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.span
          className="block w-1 h-1 rounded-full bg-neon-blue"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
      </div>
      <TimeBlock value={time.minutes} label="Minutes" />
      <div className="flex flex-col gap-2 pt-4">
        <motion.span
          className="block w-1 h-1 rounded-full bg-neon-blue"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.span
          className="block w-1 h-1 rounded-full bg-neon-blue"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
      </div>
      <TimeBlock value={time.seconds} label="Seconds" />
    </div>
  );
}
