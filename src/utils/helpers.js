//src/utils/helpers.js

/**
 * Format date to display string
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Calculate time remaining until a target date
 */
export function getTimeRemaining(targetDate) {
  const total = Date.parse(targetDate) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 120) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "…" : text;
}

/**
 * Generate a random hex ID
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

export function generateFestID() {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(10000 + Math.random() * 90000);
  return `ODY${year}${random}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Get color for event category tag
 */
export const categoryColors = {
  "Central Events": { bg: "rgba(155,89,255,0.1)", border: "rgba(155,89,255,0.4)", text: "#9b59ff" },
  "CSE Dept.": { bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.4)", text: "#00d4ff" },
  "AI/ML Dept.": { bg: "rgba(0,255,240,0.1)", border: "rgba(0,255,240,0.4)", text: "#00fff0" },
  "Civil Dept.": { bg: "rgba(255,0,110,0.1)", border: "rgba(255,0,110,0.4)", text: "#ff006e" },
  "ECE Dept.": { bg: "rgba(255,165,0,0.1)", border: "rgba(255,165,0,0.4)", text: "#ffa500" },
  "EEE Dept.": { bg: "rgba(50,205,50,0.1)", border: "rgba(50,205,50,0.4)", text: "#32cd32" },
  "Mechanical Dept.": { bg: "rgba(255,69,0,0.1)", border: "rgba(255,69,0,0.4)", text: "#ff4500" },
  "MBA": { bg: "rgba(255,20,147,0.1)", border: "rgba(255,20,147,0.4)", text: "#ff1493" },
  "MCA": { bg: "rgba(138,43,226,0.1)", border: "rgba(138,43,226,0.4)", text: "#8a2be2" },
  "default": { bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.4)", text: "#00d4ff" },
};

export function getCategoryStyle(category) {
  return categoryColors[category] || categoryColors["default"];
}

/**
 * Default events (used if Firestore is empty / not configured)
 */
export const DEMO_EVENTS = [
  {
    id: "evt001",
    title: "Neural Networks Hackathon",
    category: "Central Events",
    description: "36-hour hackathon challenging you to build real-world AI solutions. Compete solo or in teams of up to 4. Prizes worth ₹2,00,000.",
    date: "2025-03-15",
    time: "10:00 AM",
    venue: "Innovation Hub, Block A",
    maxTeamSize: 4,
    prize: "₹2,00,000",
    poster: null,
    registrations: 87,
    maxRegistrations: 200,
    whatsappLink: "",
  },
  {
    id: "evt002",
    title: "Generative AI Workshop",
    category: "CSE Dept.",
    description: "Hands-on workshop with industry experts from Google DeepMind. Explore LLMs, Diffusion models, and multimodal AI systems.",
    date: "2025-03-16",
    time: "2:00 PM",
    venue: "Seminar Hall 2",
    maxTeamSize: 1,
    prize: "Certificates + Internship Opportunities",
    poster: null,
    registrations: 45,
    maxRegistrations: 100,
    whatsappLink: "",
  },
  {
    id: "evt003",
    title: "Autonomous Robotics Showdown",
    category: "ECE Dept.",
    description: "Build an autonomous bot capable of navigating maze environments. Open to all engineering students. Technical specs provided 1 week prior.",
    date: "2025-03-17",
    time: "9:00 AM",
    venue: "Robotics Lab, Block C",
    maxTeamSize: 3,
    prize: "₹75,000",
    poster: null,
    registrations: 32,
    maxRegistrations: 60,
    whatsappLink: "",
  },
  {
    id: "evt004",
    title: "ML Model Olympiad",
    category: "AI/ML Dept.",
    description: "Compete head-to-head to train the most accurate model on a secret dataset. Results judged on accuracy, efficiency, and interpretability.",
    date: "2025-03-15",
    time: "12:00 PM",
    venue: "Computer Lab 4 & 5",
    maxTeamSize: 2,
    prize: "₹50,000 + Cloud Credits",
    poster: null,
    registrations: 63,
    maxRegistrations: 120,
    whatsappLink: "",
  },
  {
    id: "evt005",
    title: "AI Gaming Championship",
    category: "MCA",
    description: "Program AI bots to compete in strategy games. Bots are evaluated in tournament brackets. Python SDK provided.",
    date: "2025-03-16",
    time: "11:00 AM",
    venue: "Gaming Arena, Block B",
    maxTeamSize: 2,
    prize: "₹30,000",
    poster: null,
    registrations: 55,
    maxRegistrations: 80,
    whatsappLink: "",
  },
  {
    id: "evt006",
    title: "Prompt Engineering Masterclass",
    category: "MBA",
    description: "Learn advanced prompt engineering techniques from AI practitioners. Explore chain-of-thought, RAG pipelines, and agent orchestration.",
    date: "2025-03-17",
    time: "3:00 PM",
    venue: "Auditorium",
    maxTeamSize: 1,
    prize: "Certificates + Goodies",
    poster: null,
    registrations: 120,
    maxRegistrations: 300,
    whatsappLink: "",
  },
];
