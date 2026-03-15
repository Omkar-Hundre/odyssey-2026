// src/pages/Admin.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
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

  const [editingEvent, setEditingEvent] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "AI/ML",
    description: "",
    date: "",
    time: "",
    venue: "",
    registrationFee: "",
    coordinatorName: "",
    coordinatorPhone: "",
    minTeamSize: 1,
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



  async function updatePaymentStatus(regId, status) {

    try {

      const refDoc = doc(db, "registrations", regId);

      await updateDoc(refDoc, {
        paymentStatus: status
      });

      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === regId ? { ...r, paymentStatus: status } : r
        )
      );

    } catch (err) {

      console.error(err);
      alert("Failed to update payment status");

    }

  }



  function handleFormChange(e) {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

  }



  function handleEditEvent(event) {

    setEditingEvent(event);

    setForm({
      title: event.title || "",
      category: event.category || "AI/ML",
      description: event.description || "",
      date: event.date || "",
      time: event.time || "",
      venue: event.venue || "",
      registrationFee: event.registrationFee || "",
      coordinatorName: event.coordinatorName || "",
      coordinatorPhone: event.coordinatorPhone || "",
      minTeamSize: event.minTeamSize || 1,
      maxTeamSize: event.maxTeamSize || 1,
      maxRegistrations: event.maxRegistrations || 100,
    });

    setActiveTab("create");

  }
  async function handleDeleteEvent(eventId) {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "events", eventId));

      setEvents((prev) =>
        prev.filter((event) => event.id !== eventId)
      );

    } catch (err) {

      alert("Failed to delete event");

    }

  }



  async function handleCreateEvent(e) {

    e.preventDefault();
    setCreating(true);

    try {

      let posterUrl = null;

      if (posterFile) {

        const data = new FormData();
        data.append("file", posterFile);
        data.append("upload_preset", "fest_uploads");
        data.append("folder", "fest/posters");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dnuhu8ucx/image/upload",
          {
            method: "POST",
            body: data
          }
        );

        const file = await res.json();
        posterUrl = file.secure_url;

      }

      if (editingEvent) {

        const refDoc = doc(db, "events", editingEvent.id);

        await updateDoc(refDoc, {
          ...form,
          minTeamSize: Number(form.minTeamSize),
          maxTeamSize: Number(form.maxTeamSize),
          maxRegistrations: Number(form.maxRegistrations),
          poster: posterUrl || editingEvent.poster
        });

        setEditingEvent(null);

      } else {

        await addDoc(collection(db, "events"), {
          ...form,
          minTeamSize: Number(form.minTeamSize),
          maxTeamSize: Number(form.maxTeamSize),
          maxRegistrations: Number(form.maxRegistrations),
          poster: posterUrl,
          registrations: 0,
          createdAt: new Date().toISOString()
        });

      }

      setForm({
        title: "",
        category: "AI/ML",
        description: "",
        date: "",
        time: "",
        venue: "",
        registrationFee: "",
        coordinatorName: "",
        coordinatorPhone: "",
        maxTeamSize: 1,
        maxRegistrations: 100
      });

      setPosterFile(null);

      setSuccessMsg("Event saved successfully!");

      setTimeout(() => setSuccessMsg(""), 3000);

      await loadData();

    } catch (err) {

      alert("Error: " + err.message);

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

    <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12 grid-bg">

      <div className="w-full max-w-7xl">

        <h1 className="font-display text-3xl neon-text mb-8 text-center">
          Admin Console
        </h1>



        {/* Tabs */}

        <div className="flex gap-3 justify-center mb-10">

          {TABS.map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-xs font-mono tracking-widest border ${activeTab === tab
                ? "border-neon-blue text-neon-blue"
                : "border-white/20 text-white/40"
                }`}
            >
              {tab.toUpperCase()}
            </button>

          ))}

        </div>



        {/* EVENTS */}

        {activeTab === "events" && (

          <div className="grid md:grid-cols-3 gap-6">

            {events.map((ev) => (

              <div
                key={ev.id}
                className="glass-card p-6"
              >

                <p className="text-xs font-mono text-white/40 mb-2">
                  {ev.category}
                </p>

                <h3 className="text-white text-lg font-display mb-2">
                  {ev.title}
                </h3>

                <p className="text-white/40 text-sm mb-3">
                  {ev.description?.substring(0, 90)}...
                </p>

                <p className="text-white/50 text-xs">
                  {formatDate(ev.date)}
                </p>

                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() => handleEditEvent(ev)}
                    className="btn-neon-filled w-full py-2"
                    style={{ background: "linear-gradient(135deg,#9b59ff,#00d4ff)" }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="border border-red-500 text-red-400 w-full py-2"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}



        {/* CREATE / EDIT EVENT */}

        {activeTab === "create" && (

          <div className="flex justify-center">

            <form
              onSubmit={handleCreateEvent}
              className="glass-card p-10 w-full max-w-xl space-y-4"
            >

              <h2 className="font-display text-xl text-center mb-6">
                {editingEvent ? "Edit Event" : "Create Event"}
              </h2>

              <input
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="Event Title"
                className="input-neon w-full"
                required
              />

              <input
                name="venue"
                value={form.venue}
                onChange={handleFormChange}
                placeholder="Venue"
                className="input-neon w-full"
              />
              <input
                name="minTeamSize"
                type="number"
                value={form.minTeamSize}
                onChange={handleFormChange}
                placeholder="Min Team Size"
                className="input-neon w-full"
              />

              <input
                name="maxTeamSize"
                type="number"
                value={form.maxTeamSize}
                onChange={handleFormChange}
                placeholder="Max Team Size"
                className="input-neon w-full"
              />

              <input
                name="registrationFee"
                type="number"
                value={form.registrationFee}
                onChange={handleFormChange}
                placeholder="Registration Fee"
                className="input-neon w-full"
              />

              <input
                name="coordinatorName"
                value={form.coordinatorName}
                onChange={handleFormChange}
                placeholder="Coordinator Name"
                className="input-neon w-full"
              />

              <input
                name="coordinatorPhone"
                value={form.coordinatorPhone}
                onChange={handleFormChange}
                placeholder="Coordinator Phone"
                className="input-neon w-full"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Event Description"
                className="input-neon w-full"
              />

              <input
                type="file"
                onChange={(e) => setPosterFile(e.target.files[0])}
                className="text-white/40 text-xs"
              />

              <button
                type="submit"
                disabled={creating}
                className="btn-neon-filled w-full py-3"
                style={{
                  background:
                    "linear-gradient(135deg,#9b59ff,#00d4ff)"
                }}
              >
                {creating
                  ? "Saving..."
                  : editingEvent
                    ? "Update Event"
                    : "Create Event"}
              </button>

              {successMsg && (
                <p className="text-green-400 text-center">
                  {successMsg}
                </p>
              )}

            </form>

          </div>

        )}



        {/* REGISTRATIONS */}

        {activeTab === "registrations" && (

          <div className="glass-card p-6 overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="text-white/40 border-b border-white/10">

                  <th className="p-3 text-left">Event Name</th>
                  <th className="p-3 text-left">Team Name</th>
                  <th className="p-3 text-left">Leader</th>
                  <th className="p-3 text-left">Leader ID</th>
                  <th className="p-3 text-left">Team Members</th>
                  <th className="p-3 text-left">UTR</th>
                  <th className="p-3 text-left">Payment</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>

              </thead>

              <tbody>

                {registrations.map((r) => (

                  <tr key={r.id} className="border-b border-white/5">

                    <td className="p-3 text-white/70">
                      {r.eventName}
                    </td>

                    <td className="p-3 text-purple-400">
                      {r.teamName || "-"}
                    </td>

                    <td className="p-3 text-white/60">
                      {r.leaderName}
                    </td>

                    <td className="p-3 text-cyan-400">
                      {r.leaderFestId}
                    </td>

                    <td className="p-3 text-xs text-white/60">
                      {r.teamMembers && r.teamMembers.length > 0 ? (
                        r.teamMembers.map((m, i) => (
                          <div key={i}>
                            {m.name} ({m.festID})
                          </div>
                        ))
                      ) : (
                        <span className="text-white/30">No members</span>
                      )}
                    </td>

                    <td className="p-3 text-white/50">
                      {r.utr}
                    </td>

                    <td className="p-3">
                      {r.paymentScreenshot ? (
                        <a
                          href={r.paymentScreenshot}
                          target="_blank"
                          className="text-neon-blue underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-white/30">No proof</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={
                          r.paymentStatus === "confirmed"
                            ? "text-green-400"
                            : r.paymentStatus === "rejected"
                              ? "text-red-400"
                              : "text-yellow-400"
                        }
                      >
                        {r.paymentStatus || "pending"}
                      </span>
                    </td>

                    <td className="p-3 flex gap-2">

                      <button
                        onClick={() => updatePaymentStatus(r.id, "confirmed")}
                        className="text-green-400 text-xs"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => updatePaymentStatus(r.id, "rejected")}
                        className="text-red-400 text-xs"
                      >
                        Reject
                      </button>

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