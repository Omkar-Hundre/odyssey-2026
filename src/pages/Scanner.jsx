import { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export default function Scanner() {

  const scannerRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [participant, setParticipant] = useState(null);
  const [status, setStatus] = useState("");

  async function startScanner() {

    setScanning(true);

    setTimeout(async () => {

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      try {

        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
          alert("Camera not found");
          return;
        }

        const cameraId = cameras[cameras.length - 1].id;

        await scanner.start(
          cameraId,
          { fps: 10, qrbox: 260 },
          async (decodedText) => {

            console.log("QR VALUE:", decodedText);

            await scanner.stop();
            setScanning(false);

            fetchRegistration(decodedText);
          }
        );

      } catch (err) {
        console.error("Scanner error:", err);
        alert("Camera permission denied or scanner failed");
      }

    }, 200); // wait for DOM
  }

  async function fetchRegistration(regId) {

    const docRef = doc(db, "registrations", regId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      setStatus("invalid");
      return;
    }

    const data = snap.data();

    if (data.checkedIn) {
      setParticipant(data);
      setStatus("already");
      return;
    }

    await updateDoc(docRef, {
      checkedIn: true,
      checkedInTime: new Date()
    });

    setParticipant(data);
    setStatus("success");
  }

  function scanNext() {
    setParticipant(null);
    setStatus("");
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-6 text-center text-white/80 uppercase tracking-widest font-display">
        QR Ticket Scanner
      </h2>

      {!scanning && !participant && (
        <button
          onClick={startScanner}
          className="w-full max-w-sm mx-auto block bg-blue-600 text-white py-3 rounded-lg"
        >
          Start Scanning
        </button>
      )}

      {scanning && (
        <div
          id="reader"
          className="w-full max-w-md mx-auto mt-6"
        />
      )}

      {participant && (
        <div className="max-w-md mx-auto mt-6 bg-white shadow rounded-lg p-5">

          {status === "success" && (
            <h2 className="text-green-600 font-bold mb-3">
              Check-In Successful
            </h2>
          )}

          {status === "already" && (
            <h2 className="text-red-600 font-bold mb-3">
              Already Checked In
            </h2>
          )}

          {status === "invalid" && (
            <h2 className="text-yellow-600 font-bold mb-3">
              Invalid QR
            </h2>
          )}

          <p><b>Name:</b> {participant.leaderName}</p>
          <p><b>Fest ID:</b> {participant.leaderFestId}</p>
          <p><b>Event:</b> {participant.eventName}</p>

          <button
            onClick={scanNext}
            className="mt-5 w-full bg-black text-white py-2 rounded-lg"
          >
            Scan Next
          </button>

        </div>
      )}

    </div>
  );
}