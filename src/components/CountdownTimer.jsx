// src/components/CountdownTimer.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTimeRemaining } from "../utils/helpers";

const FEST_DATE = "2025-03-15T10:00:00";

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-16 md:w-20 h-16 md:h-20 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm"
      >
        <motion.span
          key={value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-display text-2xl md:text-3xl font-bold text-white"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="mt-3 font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
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
      <div className="py-2 px-6 bg-neon-blue/10 border border-neon-blue/20 rounded-full">
        <motion.p
          className="font-display text-lg font-bold text-neon-blue tracking-widest"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ODYSSEY IS LIVE NOW
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 md:gap-8">
      <TimeBlock value={time.days} label="Days" />
      <div className="text-white/20 font-bold text-xl pt-1">:</div>
      <TimeBlock value={time.hours} label="Hours" />
      <div className="text-white/20 font-bold text-xl pt-1">:</div>
      <TimeBlock value={time.minutes} label="Minutes" />
      <div className="text-white/20 font-bold text-xl pt-1">:</div>
      <TimeBlock value={time.seconds} label="Seconds" />
    </div>
  );
}
