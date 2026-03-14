
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/firebase-config";
import { useAuth } from "../context/AuthContext";
import { formatDate, DEMO_EVENTS } from "../utils/helpers";

export default function Admin() {

  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [activeTab, setActiveTab] = useState("events");
  const [loading, setLoading] = useState(true);

  const [posterFile, setPosterFile] = useState(null);
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "AI/ML",
    description: "",
    date: "",
    time: "",
    venue: "",
    prize: "",
    maxTeamSize: 1,
    maxRegistrations: 100,
  });

  const TABS = ["events", "create", "registrations"];

  useEffect(() => {

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (userProfile?.role === "admin") {
      setIsAdmin(true);
      loadData();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }

  }, [currentUser, userProfile]);



  async function loadData() {

    try {

      const [eventsSnap, regSnap] = await Promise.all([
        getDocs(collection(db, "events")),
        getDocs(collection(db, "registrations"))
      ]);

      const eventsData = eventsSnap.empty
        ? DEMO_EVENTS
        : eventsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

      const regData = regSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setEvents(eventsData);
      setRegistrations(regData);

    } catch (err) {

      console.log(err);
      setEvents(DEMO_EVENTS);
      setRegistrations([]);

    } finally {

      setLoading(false);

    }
  }



  function handleFormChange(e) {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

  }



  async function handleCreateEvent(e) {

    e.preventDefault();
    setCreating(true);

    try {

      let posterUrl = null;

      if (posterFile) {

        const storageRef = ref(
          storage,
          `posters/${Date.now()}_${posterFile.name}`
        );

        await uploadBytes(storageRef, posterFile);

        posterUrl = await getDownloadURL(storageRef);

      }

      await addDoc(collection(db, "events"), {
        ...form,
        maxTeamSize: Number(form.maxTeamSize),
        maxRegistrations: Number(form.maxRegistrations),
        poster: posterUrl,
        registrations: 0,
        createdAt: new Date().toISOString()
      });

      setForm({
        title: "",
        category: "AI/ML",
        description: "",
        date: "",
        time: "",
        venue: "",
        prize: "",
        maxTeamSize: 1,
        maxRegistrations: 100
      });

      setPosterFile(null);

      setSuccessMsg("Event created successfully!");

      setTimeout(() => setSuccessMsg(""), 3000);

      await loadData();

    } catch (err) {

      alert("Error creating event: " + err.message);

    } finally {

      setCreating(false);

    }

  }



  if (loading) {

    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <p className="text-white/40">Loading admin console...</p>
      </div>
    );

  }



  if (!isAdmin) {

    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <p className="text-red-400">Access Denied</p>
      </div>
    );

  }



  return (

    <div className="min-h-screen pt-28 pb-20 px-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl text-white mb-6">
          Admin Panel
        </h1>



        {/* Tabs */}

        <div className="flex gap-3 mb-8">

          {TABS.map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm ${activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "border border-white/20 text-white/50"
                }`}
            >
              {tab}
            </button>

          ))}

        </div>



        {/* EVENTS TAB */}

        {activeTab === "events" && (

          <div className="grid md:grid-cols-3 gap-6">

            {events.map((ev) => (

              <div
                key={ev.id}
                className="border border-white/10 p-5 rounded"
              >

                <p className="text-xs text-white/40 mb-2">
                  {ev.category}
                </p>

                <h3 className="text-white text-lg mb-2">
                  {ev.title}
                </h3>

                <p className="text-white/40 text-sm mb-3">
                  {ev.description?.substring(0, 80)}...
                </p>

                <p className="text-white/50 text-xs">
                  {formatDate(ev.date)}
                </p>

                <p className="text-cyan-400 text-sm mt-2">
                  Prize: {ev.prize}
                </p>

              </div>

            ))}

          </div>

        )}



        {/* CREATE EVENT TAB */}

        {activeTab === "create" && (

          <form
            onSubmit={handleCreateEvent}
            className="max-w-xl space-y-4"
          >

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              placeholder="Event Title"
              className="w-full p-2 bg-black border border-white/20"
              required
            />

            <input
              type="text"
              name="venue"
              value={form.venue}
              onChange={handleFormChange}
              placeholder="Venue"
              className="w-full p-2 bg-black border border-white/20"
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleFormChange}
              className="w-full p-2 bg-black border border-white/20"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Description"
              className="w-full p-2 bg-black border border-white/20"
            />

            <input
              type="file"
              onChange={(e) => setPosterFile(e.target.files[0])}
            />

            <button
              type="submit"
              disabled={creating}
              className="bg-blue-500 px-6 py-2 text-white"
            >
              {creating ? "Creating..." : "Create Event"}
            </button>

            {successMsg && (
              <p className="text-green-400">{successMsg}</p>
            )}

          </form>

        )}



        {/* REGISTRATIONS TAB */}

        {activeTab === "registrations" && (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-white/10 text-white/40 text-sm">

                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Event</th>
                  <th className="p-3 text-left">Leader</th>
                  <th className="p-3 text-left">Fest ID</th>
                  <th className="p-3 text-left">UTR</th>
                  <th className="p-3 text-left">Payment</th>

                </tr>

              </thead>

              <tbody>
                {registrations.map((r, i) => (
                  <tr key={r.id} className="border-b border-white/5">

                    <td className="p-3 text-white/30">
                      {i + 1}
                    </td>

                    <td className="p-3 text-white/70">
                      {r.eventId}
                    </td>

                    <td className="p-3 text-white/60">
                      {r.leaderName}
                    </td>

                    <td className="p-3 text-cyan-400">
                      {r.leaderFestId}
                    </td>

                    <td className="p-3 text-white/50">
                      {r.utr}
                    </td>

                    <td className="p-3">
                      {r.paymentScreenshot ? (
                        <a href={r.paymentScreenshot} target="_blank" className="text-blue-400 underline">
                          View
                        </a>
                      ) : (
                        <span className="text-white/30">No proof</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}

