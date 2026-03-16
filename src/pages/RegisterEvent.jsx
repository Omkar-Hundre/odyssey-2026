import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

import { db } from "../firebase/firebase-config";

import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    getDoc
} from "firebase/firestore";

export default function RegisterEvent() {

    const { eventId } = useParams();
    const { userProfile } = useAuth();
    const navigate = useNavigate();

    const leader = userProfile;

    const [event, setEvent] = useState(null);

    const [teamName, setTeamName] = useState("");
    const [teamFestIds, setTeamFestIds] = useState([]);
    const [teamDetails, setTeamDetails] = useState([]);

    const [utr, setUtr] = useState("");
    const [screenshot, setScreenshot] = useState(null);

    const [loading, setLoading] = useState(false);
    const [existingRegistration, setExistingRegistration] = useState(null);

    if (!leader) return null;

    useEffect(() => {
        async function checkRegistration() {
            try {
                const q = query(
                    collection(db, "registrations"),
                    where("eventId", "==", eventId),
                    where("teamFestIds", "array-contains", leader.festID)
                );
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setExistingRegistration(snap.docs[0].data());
                }
            } catch (err) {
                console.error(err);
            }
        }
        if (eventId && leader?.festID) {
            checkRegistration();
        }
    }, [eventId, leader]);

    useEffect(() => {

        async function fetchEvent() {

            const eventRef = doc(db, "events", eventId);
            const eventSnap = await getDoc(eventRef);

            if (eventSnap.exists()) {

                const data = eventSnap.data();
                setEvent(data);

                const slots = (data.maxTeamSize || 1) - 1;

                setTeamFestIds(Array(slots).fill(""));
                setTeamDetails(Array(slots).fill(null));

            }

        }

        fetchEvent();

    }, [eventId]);

    async function fetchTeamMember(index, festId) {

        if (!festId) {
            alert("Enter Fest ID first");
            return;
        }

        if (festId === leader.festID) {
            alert("Leader cannot be added as team member");
            return;
        }

        const q = query(
            collection(db, "users"),
            where("festID", "==", festId)
        );

        const snap = await getDocs(q);

        if (!snap.empty) {

            const data = snap.docs[0].data();

            const updated = [...teamDetails];
            updated[index] = data;

            setTeamDetails(updated);

        } else {

            alert("Fest ID not found");

        }

    }

    function handleFestIdChange(index, value) {

        const updated = [...teamFestIds];
        updated[index] = value;
        setTeamFestIds(updated);

    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (!event) return;

        if (!teamName.trim()) {
            alert("Enter team name");
            return;
        }

        const validMembers = teamDetails.filter(Boolean).length;
        const totalTeamSize = validMembers + 1;

        const minSize = event.minTeamSize || 1;
        const maxSize = event.maxTeamSize || 1;

        if (totalTeamSize < minSize) {
            alert(`Minimum team size is ${minSize}`);
            return;
        }

        if (totalTeamSize > maxSize) {
            alert(`Maximum team size is ${maxSize}`);
            return;
        }

        if (!utr) {
            alert("Enter UTR number");
            return;
        }

        if (!screenshot) {
            alert("Upload payment screenshot");
            return;
        }

        setLoading(true);

        try {

            const formData = new FormData();
            formData.append("file", screenshot);
            formData.append("upload_preset", "odyssey_upload");

            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dnuhu8ucx/image/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!data.secure_url) {
                alert("Image upload failed");
                setLoading(false);
                return;
            }

            const imageURL = data.secure_url;

            const q = query(
                collection(db, "registrations"),
                where("eventId", "==", eventId),
                where("leaderFestId", "==", leader.festID)
            );

            const snap = await getDocs(q);

            if (!snap.empty) {
                alert("You already registered for this event");
                setLoading(false);
                return;
            }
            const allFestIds = [
                leader.festID,
                ...teamDetails.filter(Boolean).map(member => member.festID)
            ];

            await addDoc(collection(db, "registrations"), {

                eventId: eventId,

                eventName: event.eventName || event.title,
                eventVenue: event.venue,
                registrationFee: event.registrationFee,

                teamName: teamName,

                leaderName: leader.name,
                leaderFestId: leader.festID,
                leaderMobile: leader.mobile || "",

                teamFestIds: allFestIds,   // ⭐ ADD THIS
                

                teamMembers: teamDetails
                    .filter(Boolean)
                    .map(member => ({
                        name: member.name,
                        festID: member.festID,
                        mobile: member.mobile || ""
                    })),

                utr: utr,
                paymentScreenshot: imageURL,

                paymentStatus: "pending",
                checkedIn: false,

                createdAt: new Date()

            });

            alert("Registration successful");
            navigate("/dashboard");

        } catch (error) {

            console.error(error);
            alert("Registration failed");

        }

        setLoading(false);

    }

    return (

        <div
            className="min-h-screen bg-cover bg-center flex justify-center items-start pt-20"
            style={{
                backgroundImage: event ? `url(${event.poster})` : "none"
            }}
        >

            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

            <div className="relative max-w-6xl w-full grid md:grid-cols-2 gap-8">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8"

                >

                    <h2 className="text-xl font-bold mb-6 neon-text">
                        Event Registration
                    </h2>

                    <div className="mb-6 border border-white/10 p-4 text-sm">

                        <p><b>Leader:</b> {leader.name}</p>
                        <p><b>Fest ID:</b> {leader.festID}</p>
                        <p><b>College:</b> {leader.college}</p>

                    </div>

                    {existingRegistration ? (
                        <div className="text-center p-8 border border-green-500/30 bg-green-500/10 rounded">
                            <h3 className="text-green-400 font-bold mb-2">You are already registered!</h3>
                            {existingRegistration.teamName && <p className="text-white/70 text-sm mb-1">Team: {existingRegistration.teamName}</p>}
                            <p className="text-white/70 text-sm mb-4">Status: <span className="text-white font-semibold">{existingRegistration.paymentStatus || "Pending"}</span></p>
                            <p className="text-white/50 text-xs">Return to dashboard to manage your registrations.</p>
                            <button type="button" onClick={() => navigate("/dashboard")} className="btn-neon mt-4 w-full py-2 text-xs">Go to Dashboard</button>
                        </div>
                    ) : (

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            placeholder="Team Name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="input-neon w-full text-sm"
                            required
                        />

                        <p className="text-xs text-yellow-400">
                            Minimum members required: {(event?.minTeamSize ?? 1) - 1}
                        </p>

                        {teamFestIds.map((id, index) => (

                            <div key={index} className="flex flex-col gap-2">

                                <div className="flex gap-2">

                                    <input
                                        placeholder={`Member ${index + 2} Fest ID`}
                                        value={id}
                                        onChange={(e) =>
                                            handleFestIdChange(index, e.target.value)
                                        }
                                        className="input-neon w-full text-sm"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => fetchTeamMember(index, id)}
                                        className="btn-neon px-4 text-sm"

                                    >

                                        Verify </button>

                                </div>

                                {teamDetails[index] && (

                                    <p className="text-xs text-green-400">
                                        ✔ {teamDetails[index].name} — {teamDetails[index].college}
                                    </p>
                                )}

                            </div>
                        ))}

                        <input
                            placeholder="UTR Number"
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                            className="input-neon w-full text-sm"
                            required
                        />

                        <input
                            type="file"
                            onChange={(e) => setScreenshot(e.target.files[0])}
                            className="text-white text-sm"
                            required
                        />

                        <button
                            disabled={loading}
                            className="btn-neon-filled w-full py-3 text-sm"

                        >

                            {loading ? "Submitting..." : "Submit Registration"} </button>

                    </form>
                    )}

                </motion.div>

                <div className="glass-card p-8">

                    {event && (

                        <>

                            <h2 className="text-3xl font-bold neon-text mb-3">
                                {event.eventName || event.title}
                            </h2>

                            <p className="text-sm text-white/70 mb-2">
                                📍 Venue: {event.venue}
                            </p>

                            <p className="text-sm text-white/70 mb-2">
                                💰 Fee: ₹{event.registrationFee}
                            </p>

                            <p className="text-sm text-white/70 mb-4">
                                👥 Team Size: {event.minTeamSize} - {event.maxTeamSize}
                            </p>

                            <p className="text-sm text-white/70 leading-relaxed mb-6">
                                {event.description}
                            </p>

                            <h3 className="text-white/60 text-sm mb-2 mt-4">
                                COORDINATORS
                            </h3>

                            {event.coordinators?.length > 0 ? (
                                event.coordinators.map((coord, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white/10 p-2 rounded mb-2 text-sm"
                                    >
                                        <div className="font-semibold">{coord.name}</div>
                                        <div className="text-blue-400 text-xs">{coord.phone}</div>
                                    </div>
                                ))
                            ) : event.coordinatorName && (

                                <div
                                    className="bg-white/10 p-2 rounded mb-2 text-sm"
                                >
                                    <div className="font-semibold">{event.coordinatorName}</div>
                                    <div className="text-blue-400 text-xs">{event.coordinatorPhone}</div>
                                </div>

                            )}

                        </>

                    )}

                </div>

            </div>

        </div>

    );
}
