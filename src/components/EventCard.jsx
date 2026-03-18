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
  const registration = registeredEvents.find(
    (r) => r.eventId === event.id
  );

  const alreadyRegistered = !!registration;

  function handleRegister() {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    navigate(`/register-event/${event.id}`);
  }

  return (
    <motion.div
      onClick={handleRegister}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full relative overflow-hidden cursor-pointer"
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

        <div className="flex items-center justify-between mt-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">

  {/* Team Size */}
  <div className="flex items-center gap-1 text-white/80">
    <span className="text-base">👥</span>
    <span>
      {event.minTeamSize === event.maxTeamSize
        ? `${event.minTeamSize}`
        : `${event.minTeamSize}-${event.maxTeamSize}`}
    </span>
  </div>

  {/* Fee */}
  <div className="px-2 py-1 rounded-md bg-white/10 text-white font-semibold">
    ₹{event.registrationFee || 0}
  </div>

</div>



        {/* Register Button */}
        {alreadyRegistered ? (

          <div
            className="mt-2 w-full py-3 text-center border border-green-500 text-green-400 text-xs hover:bg-green-500/10 transition-colors"
          >
            VIEW DETAILS (REGISTERED)

            {registration?.teamName && (
              <div className="text-white/60 text-xs mt-1">
                Team: {registration.teamName}
              </div>
            )}

          </div>

        ) : (

          <motion.button
            className="btn-neon-filled mt-2 w-full py-2.5 text-xs font-semibold uppercase tracking-widest"
          >
            Register Now
          </motion.button>

        )}
      </div>
    </motion.div>
  );
}
