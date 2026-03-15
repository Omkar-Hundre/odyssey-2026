
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase/firebase-config";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/helpers";

import QRCode from "react-qr-code";

export default function Dashboard() {

  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    if (!currentUser || !userProfile?.festID) return;

    const q = query(
      collection(db, "registrations"),
      where("teamFestIds", "array-contains", userProfile.festID)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {

      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRegisteredEvents(events);
      setLoading(false);

    });

    return () => unsubscribe();

  }, [currentUser, userProfile]);



  async function handleLogout() {
    await logout();
    navigate("/");
  }



  const displayName =
    userProfile?.name ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const college = userProfile?.college || "—";
  const email = currentUser?.email || "";
  const emailVerified = currentUser?.emailVerified;
  const festID = userProfile?.festID || "Generating...";



  return (

    <div className="min-h-screen pt-28 pb-20 px-6 grid-bg">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end mb-12"
        >

          <div>

            <span className="tag text-xs mb-3 inline-block">
              Participant Portal
            </span>

            <h1 className="text-3xl text-white">
              Welcome <span className="neon-text">{displayName}</span>
            </h1>

            <p className="text-xs text-white/30">{email}</p>

          </div>

          <button
            onClick={handleLogout}
            className="btn-neon text-xs py-2 px-6"
          >
            Logout
          </button>

        </motion.div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PROFILE CARD */}

          <div className="glass-card p-6">

            <h2 className="text-xs text-white/30 mb-6">
              Profile
            </h2>

            <div className="space-y-4">

              <p><b>ODYSSEY ID:</b> {festID}</p>
              <p><b>Name:</b> {displayName}</p>
              <p><b>College:</b> {college}</p>
              <p><b>Email:</b> {email}</p>

              {festID && (

                <div className="mt-6 flex flex-col items-center">

                  <span className="text-xs text-white/30 mb-2">
                    ENTRY QR CODE
                  </span>

                  <div className="bg-white p-3 rounded">
                    <QRCode value={festID} size={120} />
                  </div>

                </div>

              )}

              <div>

                <span className="text-xs text-white/30 block mb-1">
                  Email Status
                </span>

                <span className={emailVerified ? "text-green-400" : "text-yellow-400"}>
                  {emailVerified ? "Verified" : "Pending"}
                </span>

              </div>

            </div>

          </div>



          {/* REGISTERED EVENTS */}

          <div className="lg:col-span-2">

            <div className="flex justify-between mb-6">

              <h2 className="text-xs text-white/30">
                Registered Events
              </h2>

              <Link to="/events" className="text-xs text-neon-blue">
                Browse events →
              </Link>

            </div>



            {loading ? (

              <p className="text-white/40">Loading...</p>

            ) : registeredEvents.length === 0 ? (

              <div className="glass-card p-8 text-center">

                <p className="text-white/30 mb-4">
                  No registrations yet
                </p>

                <Link to="/events" className="btn-neon text-xs py-2">
                  Explore Events
                </Link>

              </div>

            ) : (

              <div className="space-y-4">

                {registeredEvents.map((event, i) => (

                  <div
                    key={event.id}
                    className="glass-card p-5 flex justify-between"
                  >

                    <div>

                      <h3 className="text-white text-sm">
                        {event.eventName || event.title}
                      </h3>

                      <p className="text-xs text-purple-400 mt-1">
                        Team: {event.teamName || "Individual"}
                      </p>

                    </div>

                    <span
                      className={`text-xs ${event.paymentStatus === "confirmed"
                        ? "text-green-400"
                        : event.paymentStatus === "rejected"
                          ? "text-red-400"
                          : "text-yellow-400"
                        }`}
                    >
                      {event.paymentStatus === "confirmed"
                        ? "Confirmed"
                        : event.paymentStatus === "rejected"
                          ? "Payment Rejected"
                          : "Payment Processing"}
                    </span>

                  </div>

                ))}

              </div>

            )}



            {/* STATS */}

            <div className="grid grid-cols-3 gap-4 mt-6">

              <div className="glass-card p-4 text-center">
                <div className="text-2xl neon-text">
                  {registeredEvents.length}
                </div>
                <div className="text-xs text-white/30">
                  Events Joined
                </div>
              </div>

              <div className="glass-card p-4 text-center">
                <div className="text-2xl neon-text">
                  —
                </div>
                <div className="text-xs text-white/30">
                  Days Until Fest
                </div>
              </div>

              <div className="glass-card p-4 text-center">
                <div className="text-2xl neon-text">
                  {registeredEvents.filter(e => e.maxTeamSize > 1).length}
                </div>
                <div className="text-xs text-white/30">
                  Team Events
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>


  );

}

