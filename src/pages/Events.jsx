import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import { DEMO_EVENTS } from "../utils/helpers";

const CATEGORIES = ["All", "Hackathon", "AI/ML", "Workshop", "Robotics", "Gaming"];

export default function Events() {

  const { currentUser } = useAuth();

  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH EVENTS (REALTIME)
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

  // FETCH USER REGISTRATIONS (REALTIME)
  useEffect(() => {

    if (!currentUser?.festId) return;

    const q = query(
      collection(db, "registrations"),
      where("festId", "==", currentUser.festId)
    );

    const unsubscribe = onSnapshot(q, (snap) => {

      const events = snap.docs.map((doc) => doc.data().eventId);

      setRegisteredEvents(events);

    });

    return () => unsubscribe();

  }, [currentUser]);

  // FILTER EVENTS
  useEffect(() => {

    let result = events;

    if (activeCategory !== "All") {
      result = result.filter((e) => e.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);

  }, [activeCategory, search, events]);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >

          <span className="tag text-xs mb-4 inline-block">ODYSSEY 2026</span>

          <h1 className="section-title mb-4">Events</h1>

          <p className="font-body text-white/50 text-lg max-w-2xl">
            Explore competitions, workshops and challenges.
          </p>

        </motion.div>


        {/* Filters */}

        <div className="flex flex-col md:flex-row gap-4 mb-10">

          <div className="flex flex-wrap gap-2">

            {CATEGORIES.map((cat) => (

              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 font-mono text-xs tracking-widest uppercase ${
                  activeCategory === cat
                    ? "bg-neon-blue text-dark-900 font-bold"
                    : "border border-white/10 text-white/40"
                }`}
              >
                {cat}
              </motion.button>

            ))}

          </div>


          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-neon md:ml-auto w-full md:w-64"
          />

        </div>


        {/* GRID */}

        {loading ? (

          <p className="text-white/40">Loading events...</p>

        ) : filtered.length === 0 ? (

          <p className="text-white/40">No events found</p>

        ) : (

          <AnimatePresence>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filtered.map((event) => (

                <EventCard
                  key={event.id}
                  event={event}
                  registeredEvents={registeredEvents}
                />

              ))}

            </motion.div>

          </AnimatePresence>

        )}

      </div>
    </div>
  );
}
