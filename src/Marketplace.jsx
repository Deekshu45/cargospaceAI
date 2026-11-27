
import { useState, useEffect } from "react";

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

function Marketplace() {

  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [containers, setContainers] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState("");
  const [error, setError] = useState("");

  // Get logged-in exporter
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();

  }, []);

  // Load available containers
  useEffect(() => {

    if (!currentUser) {
      setContainers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const containerQuery = query(
      collection(db, "containers"),
      where("status", "==", "Available")
    );

    const unsubscribe = onSnapshot(
      containerQuery,

      (snapshot) => {

        const containerData = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data()
        }));

        setContainers(
          containerData.filter(
            (container) =>
              Number(container.availableVolume) > 0
          )
        );

        setLoading(false);

      },

      (error) => {
        console.error("Marketplace loading error:", error);
        setError("Unable to load available containers.");
        setLoading(false);
      }
    );

    return () => unsubscribe();

  }, [currentUser]);

  // Load existing booking requests
  useEffect(() => {

    if (!currentUser) {
      setBookingRequests([]);
      return;
    }

    const bookingQuery = query(
      collection(db, "bookingRequests"),
      where("exporterId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      bookingQuery,

      (snapshot) => {

        const requests = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data()
        }));

        setBookingRequests(requests);

      },

      (error) => {
        console.error("Booking loading error:", error);
      }
    );

    return () => unsubscribe();

  }, [currentUser]);

  // Request container booking
  async function handleBookingRequest(container) {

    if (!currentUser) {
      alert("Please login first!");
      return;
    }

    const alreadyRequested = bookingRequests.some(
      (request) =>
        request.containerId === container.id &&
        request.status !== "Rejected"
    );

    if (alreadyRequested) {
      alert("You have already requested this container!");
      return;
    }

    try {

      setBookingLoading(container.id);

      await addDoc(collection(db, "bookingRequests"), {

        containerId: container.id,

        providerId: container.providerId,

        exporterId: currentUser.uid,

        origin: container.origin,

        destination: container.destination,

        departureDate: container.departureDate,

        volume: container.availableVolume,

        weight: container.availableWeight,

        price: container.price,

        status: "Pending",

        createdAt: serverTimestamp()

      });

      alert("Booking request sent successfully!");

    } catch (error) {

      console.error("Booking request error:", error);

      alert("Failed to send booking request: " + error.message);

    } finally {

      setBookingLoading("");

    }
  }

  // Check booking status
  function getBookingStatus(containerId) {

    return bookingRequests.find(
      (request) =>
        request.containerId === containerId &&
        request.status !== "Rejected"
    );

  }

  return (

    <div className="marketplace-container">

      <h1>Available Cargo Space</h1>

      <p>
        Discover available container space and connect with logistics providers.
      </p>

      {!currentUser && (
        <p>Please login as an exporter to view and request cargo space.</p>
      )}

      {loading && (
        <p>Loading available containers...</p>
      )}

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {!loading && currentUser && !error && containers.length === 0 && (
        <p>No available container listings right now.</p>
      )}

      <div className="marketplace-list">

        {containers.map((container) => {

          const existingRequest = getBookingStatus(container.id);

          return (

            <div
              key={container.id}
              className="listing-card"
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                margin: "15px 0",
                borderRadius: "12px",
                background: "#ffffff"
              }}
            >

              <h2>
                {container.origin} → {container.destination}
              </h2>

              <p>
                <strong>Departure Date:</strong>{" "}
                {container.departureDate || "Not specified"}
              </p>

              <p>
                <strong>Total Capacity:</strong>{" "}
                {container.totalCapacity} CBM
              </p>

              <p>
                <strong>Available Volume:</strong>{" "}
                {container.availableVolume} CBM
              </p>

              <p>
                <strong>Available Weight:</strong>{" "}
                {container.availableWeight} KG
              </p>

              <p>
                <strong>Estimated Price:</strong>{" "}
                ₹{container.price}
              </p>

              <p>
                <strong>Restrictions:</strong>{" "}
                {container.restrictions || "None"}
              </p>

              {existingRequest ? (

                <p style={{ color: "#087c76", fontWeight: "bold" }}>
                  Booking Status: {existingRequest.status}
                </p>

              ) : (

                <button
                  type="button"
                  disabled={!currentUser || bookingLoading === container.id}
                  onClick={() => handleBookingRequest(container)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#087c76",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  {bookingLoading === container.id
                    ? "Sending..."
                    : "Request Booking"}
                </button>

              )}

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default Marketplace;
