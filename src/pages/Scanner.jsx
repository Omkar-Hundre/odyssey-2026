import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export default function Scanner() {

  async function fetchUser(festID) {
    const q = query(
      collection(db, "users"),
      where("festID", "==", festID)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      const user = snap.docs[0].data();
      console.log(user);

      alert(
        `Name: ${user.name}
College: ${user.college}
Fest ID: ${user.festID}
Events: ${user.registeredEvents?.length || 0}`
      );
    } else {
      alert("Participant not found");
    }
  }

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("Scanned:", decodedText);
        fetchUser(decodedText);
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => scanner.clear();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>QR Scanner</h2>
      <div id="reader" style={{ width: "300px" }}></div>
    </div>
  );
}