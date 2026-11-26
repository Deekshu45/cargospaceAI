import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function testFirestoreConnection() {
  try {
    const docRef = await addDoc(collection(db, "connectionTests"), {
      message: "CargoShare AI Firebase connection successful",
      createdAt: serverTimestamp()
    });

    console.log("Firestore connected! Document ID:", docRef.id);
  } catch (error) {
    console.error("Firestore connection failed:", error);
  }
}