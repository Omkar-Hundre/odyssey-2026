// src/pages/Home.jsx

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CountdownTimer from "../components/CountdownTimer";

/* eslint-disable react/no-unknown-property */

function SplineRobot() {
  const viewerRef = useRef(null);

  useEffect(() => {
    const scriptId = "spline-viewer-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "module";
      script.src =
        "https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js";

      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">

      {/* Glow */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-400/30 blur-[180px] rounded-full -z-10"></div>

      <spline-viewer
        ref={viewerRef}
        url="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        loading-anim-type="spinner-small-dark"
        style={{
          width: "100%",
          height: "90%",
          maxWidth: "900px",
          transform: "scale(1.2) translateY(120px)",
          transformOrigin: "center center",
        }}
      ></spline-viewer>
    </div>
  );
}

function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,212,255,0.6)";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.35 }}
    />
  );
}

export default function Home() {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
          style={{ backgroundImage: "url('/backgroundImg.jpeg')" }}
        ></div>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/60"></div>

        <ParticleField />

        {!isMobile && <SplineRobot />}

        {/* COLLEGE NAME */}
        <div className="absolute top-[110px] w-full text-center z-30">
          <span className="font-mono text-sm tracking-[0.35em] text-[#88b688] uppercase">
            Jain College Of Engineering, Belagavi
          </span>
        </div>

        {/* ODYSSEY TITLE */}
        <div className="pointer-events-none absolute inset-x-0 top-[200px] md:top-[150px] flex justify-center z-30">
          <h1 className="font-display font-black tracking-[0.30em] text-transparent text-5xl sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text bg-gradient-to-b from-[#7dd3fc] via-[#871da7] to-[#d81d55] drop-shadow-[0_0_45px_rgba(59,130,246,0.95)]">
            ODYSSEY
          </h1>
        </div>

        {/* SIDE TEXT */}
        <div className="absolute top-[260px] w-full flex justify-between px-[22%] z-30">
          <p className="font-mono text-xs tracking-[0.35em] text-white/60 uppercase">
            NATIONAL LEVEL
          </p>

          <p className="font-mono text-xs tracking-[0.35em] text-white/60 uppercase">
            TECHNO CULTURAL FEST
          </p>
        </div>

      </section>


      {/* COUNTDOWN */}
      <section className="py-24 border-t border-white/5 bg-[#050b14]">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-10 tracking-[0.25em] uppercase">
            The Countdown is Live
          </h2>

          <div className="flex justify-center mb-12">
            <CountdownTimer targetDate="2025-03-15T10:00:00" />
          </div>

          <div className="flex justify-center gap-10">

            <div>
              <p className="text-xs text-white/40 uppercase">Dates</p>
              <p className="text-white/80">March 15–17, 2025</p>
            </div>

            <div>
              <p className="text-xs text-white/40 uppercase">Location</p>
              <p className="text-white/80">JCE Belagavi</p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}