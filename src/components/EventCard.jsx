import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatDate, getCategoryStyle } from "../utils/helpers";

export default function EventCard({ event, registeredEvents = [] }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const catStyle = getCategoryStyle(event.category);

  const fillPercent = Math.round(
    (event.registrations / event.maxRegistrations) * 100
  );

  // Check if user already registered for this event
  const alreadyRegistered = registeredEvents.includes(event.id);

  function handleRegister() {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (alreadyRegistered) return;

    navigate(`/register-event/${event.id}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full relative overflow-hidden"
      style={{
        background: "rgba(8, 15, 24, 0.7)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(0, 212, 255, 0.12)",
        clipPath:
          "polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)",
      }}
    >
      {/* Poster */}
      <div className="relative h-44 overflow-hidden bg-dark-800 flex-shrink-0">
        {event.poster ? (
          <img
            src={event.poster}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
            NO_POSTER
          </div>
        )}

        {/* Category */}
        <div
          className="absolute top-3 left-3 px-3 py-1 text-xs font-mono uppercase"
          style={{
            background: catStyle.bg,
            border: `1px solid ${catStyle.border}`,
            color: catStyle.text,
          }}
        >
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        <h3 className="font-bold text-white">{event.title}</h3>

        <p className="text-sm text-white/50 flex-1">
          {event.description?.length > 100
            ? event.description.substring(0, 100) + "..."
            : event.description}
        </p>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-2 text-xs text-white/40">
          <div>📅 {formatDate(event.date)}</div>
          <div>🕐 {event.time}</div>
          <div>📍 {event.venue}</div>
          <div>🏆 {event.prize}</div>
        </div>

        {/* Registration bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/30">Registrations</span>
            <span className="text-neon-blue">
              {event.registrations}/{event.maxRegistrations}
            </span>
          </div>

          <div className="h-1 bg-dark-600 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
            />
          </div>
        </div>

        {/* Register Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleRegister}
          disabled={
            alreadyRegistered ||
            event.registrations >= event.maxRegistrations
          }
          className={`mt-2 w-full py-2.5 text-xs font-semibold uppercase tracking-widest ${
            alreadyRegistered
              ? "border border-green-500 text-green-400"
              : event.registrations >= event.maxRegistrations
              ? "border border-white/10 text-white/20 cursor-not-allowed"
              : "btn-neon-filled"
          }`}
        >
          {alreadyRegistered
            ? "REGISTERED"
            : event.registrations >= event.maxRegistrations
            ? "FULL"
            : "Register Now"}
        </motion.button>

      </div>
    </motion.div>
  );
}
