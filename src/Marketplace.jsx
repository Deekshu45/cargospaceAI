
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

import { useBookings } from "./BookingContext.jsx";
import { useShipments } from "./ShipmentContext";
import { useState } from "react";
import "./Marketplace.css";

const sampleListings = [
  {
    id: 1,
    origin: "Mumbai",
    destination: "Singapore",
    capacity: 12,
    price: 15000,
    container: "40 ft",
    date: "2026-12-15"
  },
  {
    id: 2,
    origin: "Chennai",
    destination: "Dubai",
    capacity: 8,
    price: 11000,
    container: "20 ft",
    date: "2026-12-18"
  },
  {
    id: 3,
    origin: "Bengaluru",
    destination: "Singapore",
    capacity: 15,
    price: 18000,
    container: "40 ft",
    date: "2026-12-22"
  }
];

function Marketplace({ onNavigate, navigation }) {
  const { shipments } = useShipments();
  const { addBooking } = useBookings();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");


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

  const handleBookingRequest = (event) => {
    event.preventDefault();

    const cleanedPhone = phoneNumber.trim();

    if (!/^[0-9+() -]{7,20}$/.test(cleanedPhone)) {
      setMessage("Please enter a valid phone number.");
      return;
    }

    addBooking({
      listingId: selectedListing.id,
      origin: selectedListing.origin,
      destination: selectedListing.destination,
      cargoType: "Electronics",
      volume: 5,
      weight: 1200,
      agreedPrice: selectedListing.price,
      phoneNumber: cleanedPhone,
    });

    setMessage(
      "Demo booking request submitted successfully! Status: Pending."
    );
    setPhoneNumber("");
  };

  return (

    <div className="marketplace-page">
      {navigation}

      <main className="marketplace-container">
        <section className="marketplace-heading">
          <h1>Find Shared Cargo Space</h1>
          <p>
            Discover available container space and make
            your shipping more affordable.
          </p>
        </section>

        <section className="marketplace-search">
          <h2>Search Available Space</h2>

          <div className="search-grid">
            <div>
              <label>Origin</label>
              <input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Enter origin city"
              />
            </div>


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

            <div>
              <label>Maximum Price (₹)</label>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Enter budget"
              />
            </div>
          </div>
        </section>

        <section className="marketplace-listings">
          <h2>Available Shipments</h2>

          {shipments.length === 0 ? (
            <p>No shipments available yet.</p>
          ) : (
            shipments.map((item) => (
              <div className="listing-card" key={item.id}>
                <h3>
                  {item.origin} → {item.destination}
                </h3>

                <p>Cargo Type: {item.cargoType}</p>
                <p>Departure: {item.departureDate}</p>
                <p>Weight: {item.weight} kg</p>
                <p>Volume: {item.volume} CBM</p>

                <span>{item.status}</span>
              </div>
            ))
          )}
        </section>


      {!loading && currentUser && !error && containers.length === 0 && (
        <p>No available container listings right now.</p>
      )}

      <div className="marketplace-list">

        {containers.map((container) => {

          const existingRequest = getBookingStatus(container.id);


          return (

                <div className="container-info">
                  <p>
                    Capacity: <strong>{item.capacity} CBM</strong>
                  </p>
                  <p>
                    Container: <strong>{item.container}</strong>
                  </p>
                  <p>
                    Departure: <strong>{item.date}</strong>
                  </p>
                </div>


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

                  className="marketplace-button"
                  onClick={() => {
                    setSelectedListing(item);
                    setPhoneNumber("");
                    setMessage("");

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
            ))}
          </div>

          {filteredListings.length === 0 && (
            <p className="no-results">
              No matching cargo listings found.
              Try changing your search.
            </p>
          )}
        </section>

        {selectedListing && (
          <div className="listing-details">
            <h2>Container Details</h2>

            <p>
              Route: {selectedListing.origin} →
              {" "}{selectedListing.destination}
            </p>

            <p>
              Available capacity: {selectedListing.capacity} CBM
            </p>

            <p>
              Estimated price: ₹
              {selectedListing.price.toLocaleString("en-IN")}
            </p>

            <form onSubmit={handleBookingRequest}>
              <div className="booking-phone-field">
                <label htmlFor="booking-phone">
                  Contact Phone Number *
                </label>

                <input
                  id="booking-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setMessage("");
                  }}
                  placeholder="Enter your contact number"
                  maxLength={20}
                  required
                />
              </div>

              <button
                type="submit"
                className="marketplace-button"
              >
                Request Cargo Space
              </button>
            </form>

            {message && <p>{message}</p>}

            <button
              className="close-button"
              onClick={() => {
                setSelectedListing(null);
                setMessage("");
              }}
            >
              Close Details
            </button>
          </div>
        )}
      </main>

    </div>

  );

}

export default Marketplace;
