// src/pages/Home.jsx

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
          style={{ backgroundImage: "url('/backgroundImg.jpeg')" }}
        ></div>

        <div className="absolute inset-0 bg-black/60"></div>

        <ParticleField />

        {!isMobile && <SplineRobot />}

        <div className="absolute top-[110px] w-full text-center z-30">
          <span className="font-mono text-sm tracking-[0.35em] text-[#88b688] uppercase">
            Jain College Of Engineering, Belagavi
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-[200px] md:top-[150px] flex justify-center z-30">
          <h1 className="font-display font-black tracking-[0.30em] text-transparent text-5xl sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text bg-gradient-to-b from-[#7dd3fc] via-[#871da7] to-[#d81d55] drop-shadow-[0_0_45px_rgba(59,130,246,0.95)]">
            ODYSSEY
          </h1>
        </div>

        <div className="absolute top-[260px] w-full flex justify-between px-[22%] z-30">
          <p className="font-mono text-xs tracking-[0.35em] text-white/60 uppercase">
            NATIONAL LEVEL
          </p>

          <p className="font-mono text-xs tracking-[0.35em] text-white/60 uppercase">
            TECHNO CULTURAL FEST
          </p>
        </div>

      </section>


      {/* ITINERARY */}
      <section className="py-28 border-t border-white/5 bg-[#050b14]">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-[0.25em] uppercase">
            Odyssey Schedule
          </h2>

          {/* DAY SWITCHER */}
          <div className="flex justify-center gap-6 mb-20">

            <button
              onClick={() => setActiveDay(1)}
              className={`px-6 py-2 rounded-full border transition ${activeDay === 1
                ? "bg-cyan-500 text-black border-cyan-500"
                : "border-white/20 text-white/70 hover:border-cyan-400"
                }`}
            >
              Day 1
            </button>

            <button
              onClick={() => setActiveDay(2)}
              className={`px-6 py-2 rounded-full border transition ${activeDay === 2
                ? "bg-purple-500 text-black border-purple-500"
                : "border-white/20 text-white/70 hover:border-purple-400"
                }`}
            >
              Day 2
            </button>

          </div>


          {/* ================= DAY 1 ================= */}
          {activeDay === 1 && (
            <div className="relative">

              <div className="absolute left-1/2 -translate-x-1/2 h-full w-[3px] bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500"></div>

              <div className="space-y-20">

                <div className="flex items-center">
                  <div className="w-1/2 pr-12 text-right">
                    <p className="text-xs text-cyan-400 tracking-widest">09:00 AM</p>
                    <h3 className="text-xl font-semibold mt-2">Opening Ceremony</h3>
                  </div>

                  <div className="w-6 h-6 bg-cyan-400 rounded-full border-4 border-[#050b14]"></div>
                  <div className="w-1/2"></div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/2"></div>

                  <div className="w-6 h-6 bg-purple-500 rounded-full border-4 border-[#050b14]"></div>

                  <div className="w-1/2 pl-12">
                    <p className="text-xs text-purple-400 tracking-widest">10:00 AM</p>
                    <h3 className="text-xl font-semibold mt-2">Hackathon Begins</h3>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/2 pr-12 text-right">
                    <p className="text-xs text-pink-400 tracking-widest">02:00 PM</p>
                    <h3 className="text-xl font-semibold mt-2">Technical Events</h3>
                  </div>

                  <div className="w-6 h-6 bg-pink-500 rounded-full border-4 border-[#050b14]"></div>
                  <div className="w-1/2"></div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/2"></div>

                  <div className="w-6 h-6 bg-cyan-400 rounded-full border-4 border-[#050b14]"></div>

                  <div className="w-1/2 pl-12">
                    <p className="text-xs text-cyan-400 tracking-widest">05:30 PM</p>
                    <h3 className="text-xl font-semibold mt-2">Cultural Performances</h3>
                  </div>
                </div>

              </div>
            </div>
          )}


          {/* ================= DAY 2 ================= */}
          {activeDay === 2 && (
            <div className="relative">

              <div className="absolute left-1/2 -translate-x-1/2 h-full w-[3px] bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-400"></div>

              <div className="space-y-20">

                <div className="flex items-center">
                  <div className="w-1/2 pr-12 text-right">
                    <p className="text-xs text-purple-400 tracking-widest">09:30 AM</p>
                    <h3 className="text-xl font-semibold mt-2">Gaming Tournament</h3>
                  </div>

                  <div className="w-6 h-6 bg-purple-500 rounded-full border-4 border-[#050b14]"></div>
                  <div className="w-1/2"></div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/2"></div>

                  <div className="w-6 h-6 bg-pink-500 rounded-full border-4 border-[#050b14]"></div>

                  <div className="w-1/2 pl-12">
                    <p className="text-xs text-pink-400 tracking-widest">11:30 AM</p>
                    <h3 className="text-xl font-semibold mt-2">Workshops</h3>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/2 pr-12 text-right">
                    <p className="text-xs text-cyan-400 tracking-widest">03:00 PM</p>
                    <h3 className="text-xl font-semibold mt-2">Hackathon Finals</h3>
                  </div>

                  <div className="w-6 h-6 bg-cyan-400 rounded-full border-4 border-[#050b14]"></div>
                  <div className="w-1/2"></div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/2"></div>

                  <div className="w-6 h-6 bg-purple-500 rounded-full border-4 border-[#050b14]"></div>

                  <div className="w-1/2 pl-12">
                    <p className="text-xs text-purple-400 tracking-widest">06:00 PM</p>
                    <h3 className="text-xl font-semibold mt-2">Closing Ceremony</h3>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </section>
      {/* LOCATION */}
      <section className="py-28 border-t border-white/5 bg-[#020617]">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-[0.25em] uppercase">
            Find Us
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Address Info */}
            <div className="space-y-6">

              <h3 className="text-xl font-semibold text-cyan-400">
                Jain College of Engineering, Belagavi
              </h3>

              <p className="text-white/70 leading-relaxed">
                Odyssey is hosted at Jain College of Engineering, located in the
                southern part of Belagavi. The campus is well connected by road
                and easily accessible from the city center.
              </p>

              <div className="space-y-2 text-white/70 text-sm">

                <p>📍 Jain College of Engineering</p>
                <p>Tipu Sultan Nagar, Hunchanatti Cross</p>
                <p>Udyambag Industrial Area</p>
                <p>Belagavi, Karnataka 590008</p>
                <p>India</p>

              </div>

              <a
                href="https://maps.app.goo.gl/VN6HMdWjDRcpKQuf9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold hover:scale-105 transition"
              >
                Open in Google Maps
              </a>

            </div>
            {/* Google Map */}
            <div className="rounded-xl border border-white/10 shadow-xl hover:scale-[1.02] transition">

              <iframe
                title="Jain College of Engineering Belagavi Map"
                src="https://www.google.com/maps?q=Jain+College+of+Engineering+Belagavi+Tipu+Sultan+Nagar+Hunchanatti+Cross&output=embed"
                width="100%"
                height="350"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

            </div>

          </div>

        </div>

      </section>
    </div>
  );
}