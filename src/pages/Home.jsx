// src/pages/Home.jsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import CountdownTimer from "../components/CountdownTimer";


// Robot Model Configuration
const ROBOT_SCALE = 1.5; // Increase for zoom (1.0 is default)
const ROBOT_Y_OFFSET = "160px"; // Adjust vertical position (e.g. -100px to move up)

// 3D Robot Model from splinetool using web component
function SplineRobot() {
  const viewerRef = useRef(null);

  useEffect(() => {
    // Add the spline-viewer script dynamically
    const scriptId = "spline-viewer-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "module";
      script.src = "https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js";
      document.head.appendChild(script);
    }

    // Mouse event forwarding logic
    let rafPending = false;
    let pendingEvent = null;

    const dispatchToSpline = () => {
      rafPending = false;
      if (!pendingEvent || !viewerRef.current) return;
      const e = pendingEvent;
      pendingEvent = null;

      const viewer = viewerRef.current;
      // Spline usually listens on the canvas inside the shadow DOM
      const target = viewer.shadowRoot?.querySelector('canvas');
      if (!target) return;

      // Create and dispatch a new mousemove event exactly as expected by Spline
      const mouseEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        movementX: e.movementX || 0,
        movementY: e.movementY || 0,
        view: window,
      });

      target.dispatchEvent(mouseEvent);
    };

    const handleMouseMove = (e) => {
      pendingEvent = e;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(dispatchToSpline);
      }
    };

    const handleTouchMove = (e) => {
      const t = e.touches[0] || (e.changedTouches && e.changedTouches[0]);
      if (!t) return;
      pendingEvent = {
        clientX: t.clientX,
        clientY: t.clientY,
        screenX: t.screenX,
        screenY: t.screenY
      };
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(dispatchToSpline);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Attempt to remove watermarks if possible
    const removeWatermark = () => {
      const v = viewerRef.current;
      if (v && v.shadowRoot) {
        const logo = v.shadowRoot.querySelector('#logo') || v.shadowRoot.querySelector('a[href*="spline"]');
        if (logo) logo.style.display = 'none';
      }
    };

    const interval = setInterval(removeWatermark, 1000);
    setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    
  <div className="absolute inset-0 w-full h-full z-20 overflow-hidden flex justify-center items-center opacity-40 blur-sm lg:opacity-100 lg:blur-none pointer-events-none">
    
    <div className="w-full lg:w-[60%] h-full relative flex items-center justify-center">

      {/* Blue Glow Behind Robot */}
<div className="absolute w-[700px] h-[700px] bg-blue-500/20 blur-[180px] rounded-full -z-10"></div>
      <spline-viewer
        ref={viewerRef}
        url="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        loading-anim-type="spinner-small-dark"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          transform: `scale(${ROBOT_SCALE}) translateY(${ROBOT_Y_OFFSET})`,
          transformOrigin: "center center",
          pointerEvents: "auto"
        }}
      ></spline-viewer>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #080f18 100%)"
        }}
      ></div>

    </div>

  </div>
);
}

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
    <div className="min-h-screen bg-[#020617] text-white">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#020617]">
        <ParticleField />
        <SplineRobot />

        {/* Glowing ODYSSEY title behind the robot */}
<div className="pointer-events-none absolute inset-x-0 top-[220px] md:top-[150px] flex justify-center z-10">          <h1 className="font-display font-black tracking-[0.35em] text-transparent text-5xl sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text bg-gradient-to-b from-[#7dd3fc] via-[#60a5fa] to-[#1d4ed8] drop-shadow-[0_0_45px_rgba(59,130,246,0.95)]">
            ODYSSEY
          </h1>
        </div>

        <div className="flex items-center justify-center h-screen">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="w-full max-w-xl lg:max-w-2xl pt-24 lg:pt-0 mx-auto lg:mx-0"
          >
            {/* Top label */}
            {/* College Name Above ODYSSEY */}
            <div className="pointer-events-none absolute inset-x-0 top-28 flex justify-center z-20">
              <span className="font-mono text-[20px] md:text-sm
tracking-[0.4em] text-cyan-300 uppercase">
                Jain College Of Engineering, Belagavi
              </span>
            </div>
            {/* Main title (screen-reader only, visual title rendered behind robot) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1 className="sr-only">
                ODYSSEY – National Level Techno Cultural Fest
              </h1>
              {/* Left Text */}
              <div className="absolute left-[34%] top-64 z-20 text-left">
                <p className="font-mono text-[10px] md:text-xs tracking-[0.35em] text-white/60 uppercase">
                  NATIONAL LEVEL
                </p>
              </div>

              {/* Right Text */}
              <div className="absolute right-[30%] top-64 z-20 text-right">
                <p className="font-mono text-[10px] md:text-xs tracking-[0.35em] text-white/60 uppercase">
                  TECHNO CULTURAL FEST
                </p>
              </div>
            </motion.div>

            {/* Subtitle */}


            {/* CTA Buttons */}

            {/* Stats */}

          </motion.div>
        </div>

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
      <section className="relative py-24 border-t border-white/5 overflow-hidden bg-[#050b14]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
              <div className="h-px w-6 bg-white/10" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase">Registration Status</span>
              <div className="h-px w-6 bg-white/10" />
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-10 tracking-[0.25em] uppercase">
              The Countdown is Live
            </h2>

            <div className="flex justify-center mb-12 scale-110 md:scale-125">
              <CountdownTimer targetDate="2025-03-15T10:00:00" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">📅</span>
                <div className="text-left">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">Dates</p>
                  <p className="font-body text-sm text-white/70">March 15–17, 2025</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/5" />
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">📍</span>
                <div className="text-left">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">Location</p>
                  <p className="font-body text-sm text-white/70">Jain College Of Engineering</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 border-t border-white/5 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="tag text-xs mb-4 inline-block tracking-[0.25em] uppercase text-cyan-300">
              What Awaits
            </span>
            <h2 className="section-title text-white tracking-[0.25em] uppercase">
              Experience ODYSSEY
            </h2>
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
                className="glass-card p-6 group cursor-default rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md"
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
      <section className="py-20 border-t border-white/5 relative overflow-hidden bg-[#020617]">
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
