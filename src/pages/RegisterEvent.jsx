import { useState } from "react";
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

    const [teamFestIds, setTeamFestIds] = useState(["", "", ""]);
    const [teamDetails, setTeamDetails] = useState([]);

    const [utr, setUtr] = useState("");
    const [screenshot, setScreenshot] = useState(null);

    const [loading, setLoading] = useState(false);

    if (!leader) return null;

    // VERIFY TEAM MEMBER
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

    // SUBMIT REGISTRATION
    async function handleSubmit(e) {

        e.preventDefault();

        if (!screenshot) {
            alert("Upload payment screenshot");
            return;
        }

        setLoading(true);

        try {

            // Upload screenshot
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

            // CHECK DUPLICATE
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

            // GET EVENT DATA
            const eventRef = doc(db, "events", eventId);
            const eventSnap = await getDoc(eventRef);

            console.log("EVENT SNAP:", eventSnap.exists());

            if (!eventSnap.exists()) {
                alert("Event not found");
                return;
            }

            const eventData = eventSnap.data();

            console.log("EVENT DATA:", eventData);
            console.log("EVENT TITLE:", eventData.title);

            // THEN SAVE REGISTRATION
            await addDoc(collection(db, "registrations"), {
                eventId: eventId,
                eventName: eventData.eventName,
                leaderName: leader.name,
                leaderFestId: leader.festID,
                utr: utr,
                paymentScreenshot: imageURL,
                status: "pending",
                createdAt: new Date()
            });
            alert("Registration successful");
            navigate("/dashboard")

        } catch (error) {
            console.error(error);
            alert("Registration failed");
        }

        setLoading(false);
    }


    return (

        <div className="min-h-screen flex justify-center items-center grid-bg">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 w-full max-w-xl"
            >

                <h2 className="text-2xl font-bold mb-6 neon-text">
                    Event Registration
                </h2>

                <div className="mb-6 border border-white/10 p-4">

                    <p><b>Leader:</b> {leader.name}</p>
                    <p><b>Fest ID:</b> {leader.festID}</p>
                    <p><b>College:</b> {leader.college}</p>

                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <h3 className="text-white/70">Team Members</h3>

                    {teamFestIds.map((id, index) => (
                        <div key={index} className="flex flex-col gap-2">

                            <div className="flex gap-2">

                                <input
                                    placeholder={`Member ${index + 2} Fest ID`}
                                    value={id}
                                    onChange={(e) => handleFestIdChange(index, e.target.value)}
                                    className="input-neon w-full"
                                />

                                <button
                                    type="button"
                                    onClick={() => fetchTeamMember(index, id)}
                                    className="btn-neon px-4"
                                >
                                    Verify
                                </button>

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
                        className="input-neon w-full"
                        required
                    />

                    <input
                        type="file"
                        onChange={(e) => setScreenshot(e.target.files[0])}
                        className="text-white"
                        required
                    />

                    <button
                        disabled={loading}
                        className="btn-neon-filled w-full py-3"
                    >
                        {loading ? "Submitting..." : "Submit Registration"}
                    </button>

                </form>

            </motion.div>

        </div>
    );
}

