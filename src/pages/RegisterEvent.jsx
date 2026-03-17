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
    const [isRegistered, setIsRegistered] = useState(false);

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
            alert("Enter UTR number, Transaction Number, Unique Transaction ID");
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

            setIsRegistered(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });

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

                    {existingRegistration || isRegistered ? (
                        <div className="text-center p-8 border border-green-500/30 bg-green-500/10 rounded">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <span className="text-2xl text-green-400">✔</span>
                            </motion.div>
                            <h3 className="text-green-400 font-bold mb-2 text-lg">
                                {isRegistered ? "Registration Successful!" : "You are already registered!"}
                            </h3>
                            <p className="text-white/70 text-sm mb-6 leading-relaxed">
                                Your registration has been received. Please join the official WhatsApp group for event updates and communication.
                            </p>

                            {event?.whatsappLink && (
                                <div className="mb-8">
                                    <a
                                        href={event.whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-neon-filled w-full py-3 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white border-none shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:scale-105 transition-transform"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        Join WhatsApp Group
                                    </a>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                    className="btn-neon flex-1 py-3 text-sm"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
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
                                placeholder="UTR number, Transaction Number, Unique Transaction ID"
                                value={utr}
                                onChange={(e) => setUtr(e.target.value)}
                                className="input-neon w-full text-sm"
                                required
                            />

                            <div className="space-y-1">
                                <label className="text-xs text-white/40 block ml-1">
                                    Upload payment screenshot
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setScreenshot(e.target.files[0])}
                                    className="text-white text-sm"
                                    required
                                />
                            </div>

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
