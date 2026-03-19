import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import Tilt from "react-parallax-tilt";
import abhayImg from "../assets/abhay.jpg";

const developers = [
  {
    id: 1,
    name: "Aryan Mehta",
    role: "Lead Web Developer",
    // ❌ caption removed
    image: abhayImg, // ✅ replace with your image path
    featured: true,
    links: { github: "#", linkedin: "#", instagram: "#" },
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Frontend Developer",
    image: "/images/priya.jpg",
    links: { github: "#", linkedin: "#", instagram: "#" },
  },
  {
    id: 3,
    name: "Karan Joshi",
    role: "Backend Developer",
    image: "/images/karan.jpg",
    links: { github: "#", linkedin: "#", instagram: "#" },
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    role: "UI/UX Designer",
    image: "/images/sneha.jpg",
    links: { github: "#", linkedin: "#", instagram: "#" },
  },
];

const socialConfig = [
  { key: "github", Icon: FaGithub },
  { key: "linkedin", Icon: FaLinkedin },
  { key: "instagram", Icon: FaInstagram },
];

function DeveloperCard({ dev, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
        delay: index * 0.1,
      }}
    >
      <Tilt glareEnable glareMaxOpacity={0.15} scale={1.02}>
        <motion.div
          onMouseMove={handleMouseMove}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.97 }}
          className="group relative rounded-2xl p-[1px] h-full overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(167,139,250,0.3), rgba(236,72,153,0.2))",
          }}
        >
          {/* Shine */}
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 group-hover:left-[120%] transition-all duration-700" />

          <div
            className="relative h-full rounded-2xl p-6 flex flex-col items-center text-center gap-4"
            style={{
              background:
                "radial-gradient(circle at var(--x) var(--y), rgba(167,139,250,0.15), transparent 40%), linear-gradient(160deg, rgba(18,12,48,0.95), rgba(25,15,55,0.98))",
            }}
          >
            <img
              src={dev.image}
              alt={dev.name}
              className="w-24 h-24 rounded-full border border-purple-500/30 object-cover"
            />

            <h3 className="text-lg font-bold text-white">{dev.name}</h3>

            <p className="text-xs uppercase text-purple-300 tracking-widest">
              {dev.role}
            </p>

            {/* ❌ Caption removed */}

            <div className="flex gap-4 mt-auto">
              {socialConfig.map(({ key, Icon }) =>
                dev.links[key] ? (
                  <a
                    key={key}
                    href={dev.links[key]}
                    className="text-slate-500 hover:text-white transition"
                  >
                    {/* 🔼 Bigger icons */}
                    <Icon size={22} />
                  </a>
                ) : null
              )}
            </div>
          </div>
        </motion.div>
      </Tilt>
    </motion.div>
  );
}

export default function Developer() {
  const featured = developers.find((d) => d.featured);
  const others = developers.filter((d) => !d.featured);

  return (
    <section className="min-h-screen bg-[#050210] py-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h1
            className="text-5xl md:text-7xl font-black leading-none mb-4"
            style={{
              fontFamily: "'Syne', sans-serif",
              background:
                "linear-gradient(135deg, #ffffff 0%, #c4b5fd 40%, #f472b6 80%, #ffffff 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 6s ease infinite",
            }}
          >
            Meet Our
            <br />
            Developers
          </h1>
        </div>

        {/* Featured */}
        {featured && (
          <div className="mb-8 flex justify-center">
            <div className="w-full max-w-sm">
              <DeveloperCard dev={featured} index={0} />
            </div>
          </div>
        )}

        {/* Others */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {others.map((dev, i) => (
            <DeveloperCard key={dev.id} dev={dev} index={i + 1} />
          ))}
        </div>

      </div>
    </section>
  );
}