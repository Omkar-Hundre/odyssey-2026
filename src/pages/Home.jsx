// src/pages/Home.jsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import CountdownTimer from "../components/CountdownTimer";

// Animated background grid with particles
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? "#00d4ff" : "#9b59ff",
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// Hexagon grid decoration
function HexGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute bottom-0 right-0 w-96 h-96 opacity-5"
        viewBox="0 0 400 400"
      >
        {[...Array(30)].map((_, i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          const x = 35 + col * 60 + (row % 2 === 0 ? 0 : 30);
          const y = 35 + row * 52;
          return (
            <polygon
              key={i}
              points={`${x},${y - 28} ${x + 24},${y - 14} ${x + 24},${y + 14} ${x},${y + 28} ${x - 24},${y + 14} ${x - 24},${y - 14}`}
              fill="none"
              stroke="#00d4ff"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
}

const features = [
  {
    icon: "◈",
    title: "AI/ML Competitions",
    desc: "Compete with the nation's best in machine learning challenges with real-world datasets.",
  },
  {
    icon: "⬡",
    title: "48hr Hackathon",
    desc: "Build, break, and innovate. Turn your ideas into prototypes with industry mentors.",
  },
  {
    icon: "◎",
    title: "Expert Workshops",
    desc: "Hands-on sessions led by engineers from Google DeepMind, OpenAI, and ISRO.",
  },
  {
    icon: "◆",
    title: "₹5L+ in Prizes",
    desc: "Massive prize pool across all events, plus internship offers and cloud credits.",
  },
];

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        <ParticleField />
        <HexGrid />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,212,255,0.06) 0%, rgba(155,89,255,0.04) 40%, transparent 70%)",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          {/* Top label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neon-blue" />
            <span className="tag text-xs">Jain College Of Engineering ,Belagavi</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-neon-blue" />
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className="font-display font-black tracking-[0.15em] leading-none mb-4">
              <span className="block text-6xl md:text-8xl lg:text-9xl text-white/10 select-none absolute left-1/2 -translate-x-1/2 blur-sm">
                ODYSSEY
              </span>
              <span
                className="relative block text-6xl md:text-8xl lg:text-9xl"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #00d4ff 40%, #9b59ff 70%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ODYSSEY
              </span>
            </h1>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-neon-blue/50" />
              <p className="font-mono text-neon-blue/80 text-sm tracking-[0.5em] uppercase">
                NATIONAL LEVEL TECHNO CULTURAL FEST
              </p>
              <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-neon-blue/50" />
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-lg md:text-xl text-white/50 max-w-2xl mx-auto mt-8 leading-relaxed"
          >
            Where intelligence meets innovation. Three days of competitions, workshops,
            and ideas that will define the next decade of technology.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Link to="/events" className="btn-neon-filled text-sm w-48 text-center">
              View Events
            </Link>
            <Link to="/register" className="btn-neon text-sm w-48 text-center">
              Register Now
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center justify-center gap-8 mt-14"
          >
            {[
              { value: "20+", label: "Events" },
              { value: "5000+", label: "Participants" },
              { value: "₹5L", label: "Prize Pool" },
              { value: "3", label: "Days" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-bold text-2xl md:text-3xl neon-text">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-white/30 tracking-widest uppercase mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs text-white/20 tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-neon-blue/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section className="relative py-20 border-t border-white/5 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="tag text-xs mb-6 inline-block">Event Begins In</span>
            <h2 className="font-display text-3xl font-bold text-white mb-10 tracking-wider">
              The Countdown is Live
            </h2>
            <div className="flex justify-center">
              <CountdownTimer targetDate="2025-03-15T10:00:00" />
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono text-white/30">📅</span>
                <span className="font-body text-white/50">March 15–17, 2025</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="font-mono text-white/30">📍</span>
                <span className="font-body text-white/50">Jain College Of Engineering</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="tag text-xs mb-4 inline-block">What Awaits</span>
            <h2 className="section-title">Experience ODYSSEY</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-card p-6 group cursor-default"
                style={{
                  clipPath: "polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)",
                }}
              >
                <div
                  className="text-3xl mb-4 font-display font-bold neon-text group-hover:text-glow-blue transition-all duration-300"
                >
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-sm tracking-wider text-white mb-3 uppercase">
                  {f.title}
                </h3>
                <p className="font-body text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(155,89,255,0.06) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-wider mb-6">
              Ready to compete?
            </h2>
            <p className="font-body text-white/50 text-lg mb-10">
              Join thousands of students from across India. Registrations close February 28.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-neon-filled text-sm w-full sm:w-48 text-center">
                Register Free
              </Link>
              <Link to="/events" className="btn-neon text-sm w-full sm:w-48 text-center">
                Browse Events
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
