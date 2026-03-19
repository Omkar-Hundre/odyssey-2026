// src/pages/Home.jsx

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, query, limit, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import { DEMO_EVENTS } from "../utils/helpers";
import homeBg from "../assets/home_bg.mp4";
import introVideo from "../assets/home_bg3.mp4";
import introAudio from "../assets/intro.mp3";

const AI_TOOLS = [
  { name: "ChatGPT", category: "LLM", color: "from-emerald-400 to-cyan-500", logo: "openai.com" },
  { name: "Midjourney", category: "Art", color: "from-purple-500 to-pink-500", logo: "midjourney.com" },
  { name: "Gemini", category: "Multimodal", color: "from-blue-500 to-cyan-400", logo: "google.com" },
  { name: "Claude", category: "Reasoning", color: "from-orange-400 to-red-500", logo: "anthropic.com" },
  { name: "Stable Diffusion", category: "Generative", color: "from-indigo-500 to-purple-400", logo: "stability.ai" },
  { name: "GitHub Copilot", category: "Coding", color: "from-slate-700 to-slate-900", logo: "github.com" },
  { name: "Jasper", category: "Writing", color: "from-blue-400 to-indigo-600", logo: "jasper.ai" },
  { name: "Perplexity", category: "Search", color: "from-cyan-400 to-blue-500", logo: "perplexity.ai" },
  { name: "ElevenLabs", category: "Voice", color: "from-yellow-400 to-orange-500", logo: "elevenlabs.io" },
  { name: "Runway", category: "Video", color: "from-pink-500 to-rose-600", logo: "runwayml.com" },
  { name: "Notion AI", category: "Productivity", color: "from-gray-600 to-black", logo: "notion.so" },
  { name: "DeepL", category: "Translation", color: "from-blue-800 to-blue-900", logo: "deepl.com" },
  { name: "Firefly", category: "Design", color: "from-orange-500 to-red-600", logo: "adobe.com" },
  { name: "Sora", category: "Video", color: "from-cyan-500 to-blue-600", logo: "openai.com" },
  { name: "Mistral", category: "LLM", color: "from-orange-400 to-yellow-500", logo: "mistral.ai" },
  { name: "Cursor", category: "IDE", color: "from-blue-500 to-indigo-600", logo: "cursor.com" },
  { name: "Grammarly", category: "Editing", color: "from-green-500 to-emerald-600", logo: "grammarly.com" },
  { name: "Canva Magic", category: "Design", color: "from-purple-400 to-blue-500", logo: "canva.com" },
  { name: "Otter.ai", category: "Meetings", color: "from-blue-400 to-cyan-400", logo: "otter.ai" },
  { name: "Descript", category: "Audio/Video", color: "from-descript.com", logo: "descript.com" },
  { name: "Murf", category: "TTS", color: "from-purple-600 to-indigo-700", logo: "murf.ai" },
  { name: "Synthesia", category: "Avatars", color: "from-indigo-500 to-blue-600", logo: "synthesia.io" },
  { name: "Phind", category: "Search", color: "from-blue-400 to-emerald-500", logo: "phind.com" },
  { name: "Grok", category: "LLM", color: "from-gray-800 to-black", logo: "x.ai" },
  { name: "Dall-E", category: "Image", color: "from-orange-500 to-yellow-500", logo: "openai.com" },
  { name: "Whisper", category: "Speech", color: "from-cyan-500 to-emerald-500", logo: "openai.com" },
  { name: "Copy.ai", category: "Marketing", color: "from-blue-500 to-indigo-500", logo: "copy.ai" },
  { name: "Fireflies", category: "Productivity", color: "from-cyan-400 to-blue-600", logo: "fireflies.ai" },
  { name: "Tabnine", category: "Coding", color: "from-indigo-600 to-purple-600", logo: "tabnine.com" },
  { name: "Replit Ghost", category: "Coding", color: "from-red-500 to-orange-600", logo: "replit.com" },
];

const CATEGORIES = ["All", "Central Events", "CSE Dept.", "AI/ML Dept.", "ECE Dept.", "Mechanical Dept.", "MBA", "MCA"];

function ToolLogo({ tool }) {
  const [error, setError] = useState(false);
  const logoUrl = `https://logo.clearbit.com/${tool.logo}`;

  if (error || !tool.logo) {
    return (
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
        {tool.name.charAt(0)}
      </div>
    );
  }

  return (
    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300 overflow-hidden shadow-lg shadow-black/20 flex-shrink-0">
      <img
        src={logoUrl}
        alt={tool.name}
        className="w-full h-full object-contain"
        onError={() => setError(true)}
      />
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

const SCHEDULE_DATA = {
  1: [
    { time: "09:00 AM", title: "Opening Ceremony", description: "Grand inauguration of Odyssey 2026 with guest speakers and cultural highlights.", category: "Main Stage" },
    { time: "10:00 AM", title: "Hackathon Begins", description: "24-hour coding marathon kicks off. Teams start building innovative solutions.", category: "Tech Hub" },
    { time: "02:00 PM", title: "Technical Events", description: "Paper presentations, coding challenges, and tech quizzes across multiple venues.", category: "Workshops" },
    { time: "05:30 PM", title: "Cultural Performances", description: "Evening of dance, music, and fashion showcase by students from across the country.", category: "Cultural" },
  ],
  2: [
    { time: "09:30 AM", title: "Gaming Tournament", description: "Competitive esports showdown featuring popular titles. Strategy and skill on display.", category: "Esports Arena" },
    { time: "11:30 AM", title: "Workshops", description: "Hands-on sessions on AI, Blockchain, and Sustainable Engineering by industry experts.", category: "Learning" },
    { time: "03:00 PM", title: "Hackathon Finals", description: "The top teams present their prototypes to an elite panel of judges.", category: "Tech Hub" },
    { time: "06:00 PM", title: "Closing Ceremony", description: "Awards distribution and grand finale to the Odyssey 2026 fest.", category: "Main Stage" },
  ],
};

export default function Home() {
  const { currentUser, userProfile } = useAuth();
  const [activeDay, setActiveDay] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showIntro, setShowIntro] = useState(true);





  const handleVideoEnd = () => {
    sessionStorage.setItem("introPlayed", "true");
    setShowIntro(false);
  };


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollDuration = isMobile ? 25 : 45;
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);

  // Fetch Events
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setEvents(data);
      } else {
        setEvents(DEMO_EVENTS);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (soundOn) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(() => { });
    }

    setSoundOn(!soundOn);
  };

  // FETCH USER REGISTRATIONS (REALTIME)
  useEffect(() => {
    if (!userProfile?.festID) return;
    const q = query(
      collection(db, "registrations"),
      where("teamFestIds", "array-contains", userProfile.festID)
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const regs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegisteredEvents(regs);
    });
    return () => unsubscribe();
  }, [userProfile]);

  // Filter Events
  useEffect(() => {
    let result = events;
    if (activeCategory !== "All") {
      result = result.filter((e) => e.category === activeCategory);
    }
    // Show only first 5 events + room for View More card
    setFilteredEvents(result.slice(0, 5));
  }, [activeCategory, events]);

  return (

    <div className="min-h-screen bg-[#020617] text-white">
      {showIntro && (
        <div className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-700 ${showIntro ? "opacity-100" : "opacity-0 pointer-events-none"}`}>

          {/* VIDEO (always muted) */}
          <video
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
          >
            <source src={introVideo} type="video/mp4" />
          </video>

          {/* AUDIO */}
          <audio ref={audioRef} src={introAudio} loop />

          {/* SOUND TOGGLE */}
          <button
            onClick={toggleSound}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center text-white text-lg hover:bg-white/20 transition"
          >
            {soundOn ? "🔊" : "🔇"}
          </button>

          {/* SKIP */}
          <button
            onClick={handleVideoEnd}
            className="absolute bottom-10 right-10 px-5 py-2 bg-white/10 border border-white/20 text-white text-sm rounded-lg backdrop-blur hover:bg-white/20 transition"
          >
            Skip →
          </button>

        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-screen flex items-start justify-start overflow-hidden">
        <div className="absolute bottom-0 w-full h-[20vh] bg-gradient-to-b from-transparent to-[#050b14] z-40"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover blur-[2px] scale-105"
        >
          <source src={homeBg} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/60"></div>

        <ParticleField />


        {/* CENTRAL CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-startr z-30 text-center pt-20 md:pt-32">

          {/* College Name */}
          <div className="mb-4 md:mb-6 animate-fade-in px-4">
            <span className="font-mono text-[10px] sm:text-xs md:text-sm 
    tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.35em] 
    font-medium uppercase 
    bg-gradient-to-r from-cyan-300 via-indigo-400 to-purple-400 
    bg-clip-text text-transparent 
    opacity-90">
              Jain College Of Engineering, Belagavi
            </span>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: 1,
              y: 0,
              backgroundPosition: ["0% 50%", "100% 50%"]
            }}
            transition={{
              duration: 1,
              backgroundPosition: {
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            style={{ backgroundSize: "200% 200%" }}
            className="tapestry-regular text-transparent 
    text-[14vw] sm:text-6xl md:text-7xl lg:text-9xl 
    bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500
    drop-shadow-[0_0_50px_rgba(99,102,241,0.6)]
    py-2 md:py-4 px-4
    tracking-[0.02em] sm:tracking-[0.05rem] md:tracking-[0.08rem] lg:tracking-[0.12rem]">
            ODYSSEY
          </motion.h1>

          {/* Subtitle */}
          <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-center gap-3 md:gap-16 px-4">

            <div className="flex flex-col items-center">
              <p className="font-mono text-[9px] sm:text-[10px] md:text-xs 
      tracking-[0.25em] md:tracking-[0.5em] uppercase 
      bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 
      bg-clip-text text-transparent">
                NATIONAL LEVEL
              </p>
              <div className="h-[1px] w-6 md:w-8 
      bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent 
      mt-2"></div>
            </div>

            <div className="hidden md:block w-px h-8 
    bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent">
            </div>

            <div className="flex flex-col items-center">
              <p className="font-mono text-[9px] sm:text-[10px] md:text-xs 
      tracking-[0.25em] md:tracking-[0.5em] uppercase 
      bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 
      bg-clip-text text-transparent">
                TECHNO CULTURAL FEST
              </p>
              <div className="h-[1px] w-6 md:w-8 
      bg-gradient-to-r from-transparent via-purple-400/60 to-transparent 
      mt-2"></div>
            </div>

          </div>
          {/* Buttons */}
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up px-4">
            <Link to="/events" className="btn-neon-filled w-full sm:w-auto">
              <span className="relative z-10 font-bold">Register Now</span>
            </Link>
            <button className="btn-neon w-full sm:w-auto">
              <span className="relative z-10 font-bold">Rule Book</span>
            </button>
          </div>

          {/* AI Tools Marquee */}
          <div className="mt-20 w-full overflow-hidden py-10 relative">

            {/* Softer Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-10 md:w-20 bg-gradient-to-r from-[#020617] to-transparent z-20"></div>
            <div className="absolute right-0 top-0 bottom-0 w-10 md:w-20 bg-gradient-to-l from-[#020617] to-transparent z-20"></div>

            {/* TOP ROW */}
            <div className="marquee">
              <div className="marquee-track-left">
                {[...AI_TOOLS, ...AI_TOOLS].map((tool, idx) => (
                  <div key={idx} className="marquee-item group">
                    <ToolLogo tool={tool} />
                    <div>
                      <div className="text-[10px] font-mono uppercase text-white/40">
                        {tool.category}
                      </div>
                      <div className="text-sm md:text-base font-semibold text-white/90">
                        {tool.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="marquee mt-6">
              <div className="marquee-track-right">
                {[...AI_TOOLS, ...AI_TOOLS].map((tool, idx) => (
                  <div key={idx} className="marquee-item glow group">
                    <ToolLogo tool={tool} />
                    <div>
                      <div className="text-[10px] font-mono uppercase text-white/40">
                        {tool.category}
                      </div>
                      <div className="text-sm md:text-base font-semibold text-white">
                        {tool.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* EVENTS CATEGORIZED */}
      <section className="py-24 bg-[#050b14] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">
                Explore the <span className="text-cyan-400">Odyssey</span>
              </h2>
              <p className="text-white/50 max-w-xl font-mono text-sm uppercase tracking-widest">
                Discover events filtered by your area of interest
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all duration-300 ${activeCategory === cat
                    ? "bg-cyan-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    : "bg-white/5 text-white/40 border border-white/10 hover:border-cyan-400/50 hover:text-white"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="col-span-full py-20 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 mx-auto mb-4"></div>
                  <p className="text-white/30 font-mono text-xs uppercase tracking-widest">Initialising Grid...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-white/10 italic text-white/30">
                  No events found in this category yet.
                </div>
              ) : (
                <>
                  {filteredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <EventCard event={event} registeredEvents={registeredEvents} />
                    </motion.div>
                  ))}

                  {/* View More Card */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex"
                  >
                    <Link
                      to="/events"
                      className="group relative w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-500 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 w-16 h-16 rounded-full bg-cyan-400/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      <h3 className="relative z-10 text-2xl font-bold text-white mb-2 tracking-tight">View All Events</h3>
                      <p className="relative z-10 text-cyan-400/60 font-mono text-[10px] uppercase tracking-widest">Explore 50+ competitions</p>
                    </Link>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-32 border-t border-white/5 bg-[#020617] relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 inline-block mb-4">
              Find Us
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Address Information Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-cyan-400">Jain College of Engineering</span>
                  </h3>
                  <p className="text-white/60 leading-relaxed text-lg">
                    Odyssey 2026 is hosted at the prestigious Jain College of Engineering, Belagavi. A hub of innovation and cultural excellence.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 text-cyan-400">
                      📍
                    </div>
                    <div>
                      <p className="text-white font-semibold">Address</p>
                      <p className="text-white/60 text-sm md:text-base">
                        Tipu Sultan Nagar, Hunchanatti Cross,<br />
                        Udyambag Industrial Area, Belagavi,<br />
                        Karnataka 590008, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400">
                      📧
                    </div>
                    <div>
                      <p className="text-white font-semibold">Contact</p>
                      <p className="text-white/60 text-sm md:text-base">info@jce.edu.in</p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://maps.app.goo.gl/VN6HMdWjDRcpKQuf9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative w-full inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 overflow-hidden"
                >
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 ease-out group-hover/btn:w-full"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    GET DIRECTIONS
                    <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                  </span>
                </a>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative group p-2">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-[2rem] blur-lg opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative rounded-[1.8rem] overflow-hidden border border-white/20 bg-black aspect-square md:aspect-auto md:h-[500px] shadow-2xl">
                <iframe
                  title="Jain College of Engineering Belagavi Map"
                  src="https://www.google.com/maps?q=Jain+College+of+Engineering+Belagavi+Tipu+Sultan+Nagar+Hunchanatti+Cross&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Decorative Corner Accents */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-2xl pointer-events-none"></div>
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-purple-400/50 rounded-br-2xl pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}