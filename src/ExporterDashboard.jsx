

import { useState,useEffect } from "react";
import { useBookings } from "./BookingContext.jsx";

import { useState, useEffect } from "react";
import { useState } from "react"
import { useShipments } from "./ShipmentContext";
import ShipmentForm from "./ShipmentForm.jsx";
import Marketplace from "./Marketplace.jsx";
import PaymentPage from "./PaymentPage.jsx";
import "./Dashboard.css"

import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
  getDocs
} from "firebase/firestore";


function ExporterDashboard({ onLogout,user }) {

  const [showShipmentForm, setShowShipmentForm] = useState(false);
const [showEditForm, setShowEditForm] = useState(false);
  const [shipments, setShipments] = useState([]);
const [containers, setContainers] = useState([]);
const [showContainers, setShowContainers] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const [currentUser, setCurrentUser] = useState(user || auth.currentUser || null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // Get logged-in exporter
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    const activeUser=firebaseUser || user ||auth.currentUser;
     
     setCurrentUser(activeUser);

      if (!activeUser) {
        setShipments([]);
        setLoading(false);
      }

    });

    return () => unsubscribe();

  }, [user]);


  // Load shipments from Firestore
  useEffect(() => {

    if (!currentUser) {
      return;
    }

    setLoading(true);
    setError("");

    const shipmentQuery = query(
      collection(db, "shipments"),
      where("exporterId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      shipmentQuery,

      (snapshot) => {

        const shipmentData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setShipments(shipmentData);

        setLoading(false);

      },

      (error) => {

        console.error("Loading shipments error:", error);

        setError("Unable to load shipments.");

        setLoading(false);

      }
    );

    return () => unsubscribe();

  }, [currentUser]);
// Load available containers from Firestore
useEffect(() => {

  const containerQuery = query(
    collection(db, "containers")
  );

  const unsubscribe = onSnapshot(
    containerQuery,
    (snapshot) => {

      const containerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setContainers(containerData);

    },
    (error) => {
      console.error("Loading containers error:", error);
    }
  );

  return () => unsubscribe();

}, []);

  // Submit shipment to Firestore
  async function handleShipmentSubmit(newShipment) {

    try {

      if (!currentUser) {
        alert("Please login first!");
        return;
      }

      const shipmentData = {

        exporterId: currentUser.uid,

        origin: newShipment.origin || "",

        destination: newShipment.destination || "",

        shippingDate: newShipment.shippingDate || "",

        cargoType: newShipment.cargoType || "",

        description:
          newShipment.description ||
          newShipment.cargoDescription ||
          "",

        volume: Number(newShipment.volume) || 0,

        weight: Number(newShipment.weight) || 0,

        specialRequirements:
          newShipment.specialRequirements ||
          newShipment.specialHandling ||
          "",

        status: "Submitted",

        createdAt: serverTimestamp()

      };


      await addDoc(
        collection(db, "shipments"),
        shipmentData
      );

      alert("Shipment saved successfully!");

      setShowShipmentForm(false);

    } catch (error) {

      console.error("Shipment submission error:", error);

      alert("Failed to save shipment: " + error.message);
    }
  }
// Send booking request to provider
async function handleBookingRequest(container) {

  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  try {

    await addDoc(collection(db, "bookingRequests"), {
      containerId: container.id,
      providerId: container.providerId,
      exporterId: currentUser.uid,
      origin: container.origin,
      destination: container.destination,
      status: "Pending",
      createdAt: serverTimestamp()
    });

    alert("Booking request sent successfully!");

  } catch (error) {
    console.error("Booking request error:", error);
    alert("Failed to send booking request: " + error.message);
  }
}
  // Update shipment in Firebase
  async function handleUpdateShipment(updatedShipment) {
    try {
      if (!currentUser || !selectedShipment) {
        alert("Please select a shipment first!");
        return;
      }

      const shipmentRef = doc(db, "shipments", selectedShipment.id);

      await updateDoc(shipmentRef, {
        origin: updatedShipment.origin || "",
        destination: updatedShipment.destination || "",
        shippingDate: updatedShipment.shippingDate || "",
        cargoType: updatedShipment.cargoType || "",
        description: updatedShipment.description || "",
        volume: Number(updatedShipment.volume) || 0,
        weight: Number(updatedShipment.weight) || 0,
        specialRequirements:
          updatedShipment.specialRequirements || ""
      });

      alert("Shipment updated successfully!");
      setSelectedShipment(null);
setShowEditForm(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update shipment: " + error.message);
    }
  }
// Delete shipment from Firebase
async function handleDeleteShipment(shipmentId) {
  try {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shipment?"
    );

    if (!confirmDelete) return;

    const shipmentRef = doc(db, "shipments", shipmentId);

    await deleteDoc(shipmentRef);

    alert("Shipment deleted successfully!");

    setSelectedShipment(null);
function ExporterDashboard({ onLogout }) {
  const { shipments, addShipment, deleteShipment } = useShipments();
  const {
  bookings,
  updatePaymentStatus,
  feedbackMessages,
  sendFeedback,
} = useBookings();
const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [reminderBooking, setReminderBooking] = useState(null);

useEffect(() => {
  const upcomingPayment = bookings.find((booking) => {
    if (
      booking.paymentStatus !== "Unpaid" ||
      !booking.paymentDueDate
    ) {
      return false;
    }

    const daysLeft =
      new Date(booking.paymentDueDate).getTime() - Date.now();

    return daysLeft > 0 && daysLeft <= 2 * 24 * 60 * 60 * 1000;
  });

  setReminderBooking(upcomingPayment || null);
}, [bookings]);

  const [selectedShipment, setSelectedShipment] = useState(null);

  const [showAIAssistant, setShowAIAssistant] = useState(false);
const [aiDescription, setAiDescription] = useState("");


function handleShipmentSubmit(newShipment) {
  const shipmentWithDetails = {
    ...newShipment,
    status: "Pending",
    id: Date.now()
  };

  addShipment(shipmentWithDetails);
  setShowShipmentForm(false);
}
if (showPaymentPage) {
  return (
    <PaymentPage
      bookings={bookings}
      updatePaymentStatus={updatePaymentStatus}
      onBack={() => setShowPaymentPage(false)}
    />
  );
}


  } catch (error) {
    console.error("Delete error:", error);
    alert("Failed to delete shipment: " + error.message);
  }
}

  return (

    <div className="dashboard">
    
{reminderBooking && (
  <div className="payment-reminder-overlay">
    <div className="payment-reminder-popup">
      <h2>🔔 Payment Reminder!</h2>

      <p>
        Your payment deadline is approaching!
      </p>

      <p>
        <strong>
          {reminderBooking.origin} → {reminderBooking.destination}
        </strong>
      </p>

      <p>
        Please complete your payment soon to avoid delays.
      </p>

      <button
        type="button"
        className="pay-now-btn"
        onClick={() => {
          const confirmPayment = window.confirm(
            "Confirm this simulated demo payment?"
          );

          if (confirmPayment) {
            updatePaymentStatus(reminderBooking.id, "Paid (Demo)");
            setReminderBooking(null);
          }
        }}
      >
        Pay Now
      </button>

      <button
        type="button"
        onClick={() => setReminderBooking(null)}
      >
        Remind Me Later
      </button>
    </div>
  </div>
)}
  

      {/* Navigation */}

      <nav className="dashboard-nav">

  <h2>CargoShare AI</h2>
  <span>Exporter Dashboard</span>

  <button
    type="button"
    onClick={() => setShowPaymentPage(true)}
  >
    My Payments
  </button>

  <button type="button" onClick={onLogout}>
    Logout
  </button>
</nav>


        <h2>CargoShare AI</h2>

        <span>Exporter Dashboard</span>

        <button
          type="button"
          onClick={onLogout}
        >
          Logout
        </button>

      </nav>



      <div className="dashboard-content">

        {/* Welcome */}

        <div className="dashboard-welcome">

          <h1>Welcome, Exporter!</h1>

          <p>
            Manage your shipments and discover affordable cargo space.
          </p>

          </div>

{/* Payments Section */}
<section className="dashboard-card payment-section">
  <h2>My Payments</h2>

{bookings.filter(
  (booking) =>
    booking.bookingStatus === "Accepted" ||
    booking.bookingStatus === "Shipped"
).length === 0 ? (
  <p>No accepted bookings available for payment yet.</p>
) : (
  bookings
    .filter(
      (booking) =>
        booking.bookingStatus === "Accepted" ||
        booking.bookingStatus === "Shipped"
    )
    .map((booking) => (
      <div key={booking.id} className="payment-card">
        <h3>
          {booking.origin} → {booking.destination}
        </h3>

        {booking.bookingStatus === "Shipped" ? (
          <p className="payment-accepted-message">
            🚚 Great news! Your goods have been shipped by the logistics provider.
          </p>
        ) : (
          <p className="payment-accepted-message">
            ✓ The provider has accepted your request!
          </p>
        )}

        <p>Amount: ₹{booking.agreedPrice}</p>
        <p>Payment Status: {booking.paymentStatus}</p>
        
{booking.paymentStatus === "Unpaid" && booking.paymentDueDate && (
  <>
    <p>
      <strong>Payment Due:</strong>{" "}
      {new Date(booking.paymentDueDate).toLocaleDateString()}
    </p>

    <p className="payment-countdown">
      {new Date(booking.paymentDueDate) >= new Date() ? (
        `⏳ ${
          Math.ceil(
            (new Date(booking.paymentDueDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        } days remaining to pay.`
      ) : (
        "⚠️ Payment overdue! Please complete your payment."
      )}
    </p>
  </>
)}


        {booking.paymentStatus === "Unpaid" && (
          <button
            type="button"
            className="pay-now-btn"
            onClick={() => {
              const confirmPayment = window.confirm(
                "Confirm this simulated demo payment?"
              );

              if (confirmPayment) {
                updatePaymentStatus(booking.id, "Paid (Demo)");
              }
            }}
          >
            Pay Now
          </button>
        )}
               <div className="booking-feedback">
          <h3>Feedback to Logistics Provider</h3>

          <textarea
            value={feedbackDrafts[booking.id] || ""}
            onChange={(e) =>
              setFeedbackDrafts((previous) => ({
                ...previous,
                [booking.id]: e.target.value,
              }))
            }
            placeholder="Write a message to your logistics provider..."
            rows={3}
          />

          <button
            type="button"
            disabled={!(feedbackDrafts[booking.id] || "").trim()}
            onClick={() => {
              sendFeedback(
                booking.id,
                "Exporter",
                "Provider",
                feedbackDrafts[booking.id]
              );

              setFeedbackDrafts((previous) => ({
                ...previous,
                [booking.id]: "",
              }));
            }}
          >
            Send Feedback
          </button>

          <h4>Messages from Provider</h4>

          {feedbackMessages
            .filter(
              (message) =>
                message.bookingId === booking.id &&
                message.receiver === "Exporter"
            )
            .map((message) => (
              <p key={message.id}>
                <strong>Provider:</strong> {message.message}
                <br />
                <small>{message.date}</small>
              </p>
            ))}
        </div> 
      </div>
    ))
)}


</section>



          {currentUser && (
            <p>
              Logged in as: {currentUser.email}
            </p>
          )}

        </div>



        {/* Statistics */}
        {/* Dashboard Statistics */}

        {/* Statistics */}
 
        <div className="dashboard-stats">

          <div className="dashboard-card">

            <h3>My Shipments</h3>

            <h2>{shipments.length}</h2>

            <p>Total shipments</p>

          </div>


          <div className="dashboard-card">

            <h3>Booking Requests</h3>

            <h2>0</h2>

            <p>Pending requests</p>

          </div>


          <div className="dashboard-card">

            <h3>Potential Savings</h3>

            <h2>₹0</h2>

            <p>Estimated savings</p>

          </div>

        </div>


        {/* Dashboard Actions */}

        <div className="dashboard-actions">


          <div className="action-card">

            <h2>Find Cargo Space</h2>

            <p>
              Search for available container space matching
              your shipping route and cargo requirements.
            </p>
<button
  type="button"
  onClick={() => setShowContainers(true)}
>
  Find Cargo Space
</button>
          </div>


          <div className="action-card">

            <h2>Add a Shipment</h2>

            <p>
              Enter your cargo details to find suitable
              shipping opportunities.
            </p>

            <button
              type="button"
              onClick={() => setShowShipmentForm(true)}
            >
              Add Shipment
            </button>

       
          </div>


          <div className="action-card">

            <h2>AI Cargo Assistant</h2>

            <p>
              Describe your cargo in simple language and
              let AI help organise your shipment details.
            </p>
            <button
              type="button"
              onClick={() => alert("AI Assistant coming soon!")}
            >
              Try AI Assistant
            </button>
           <button
  type="button"
  onClick={() => setShowAIAssistant(true)}
>
  Try AI Assistant
</button>


          </div>

        </div>



        {/* Shipment List */}
        {/* Recent Shipments */}
        <div className="recent-activity">

          <h2>My Shipments</h2>

          {loading ? (

            <p>Loading shipments...</p>

          ) : error ? (

            <p>{error}</p>

          ) : shipments.length === 0 ? (

          {shipments.length === 0 ? (

            <div>

              <p>You don't have any shipments yet.</p>

              <p>Your shipment activity will appear here.</p>

            </div>

          ) : (

            <div className="shipment-list">

              {shipments.map((shipment, index) => (

                <div
                  className="shipment-card"
                  key={shipment.id}
                >

                  <p className="shipment-reference">

                    Shipment ID: {shipment.id}

                <div className="shipment-card" key={index}>

                  <p className="shipment-reference">
                    Shipment ID: CS-{1001 + index}
                  </p>


                  <h3>

                    {shipment.origin} → {shipment.destination}

                  </h3>


                  <p>
                    <strong>Shipping Date:</strong>{" "}
                    {shipment.shippingDate}
                  </p>


                  <p>
                    <strong>Cargo Type:</strong>{" "}
                    {shipment.cargoType}
                  </p>


                  <p>
                    <strong>Description:</strong>{" "}
                    {shipment.description || shipment.cargoDescription}
                  </p>


                  <p>
                    <strong>Volume:</strong>{" "}
                    {shipment.volume} CBM
                  </p>


                  <p>
                    <strong>Weight:</strong>{" "}
                    {shipment.weight} KG
                  </p>


                  <p>
                    <strong>Special Requirements:</strong>{" "}
                    {shipment.specialRequirements ||
                     shipment.specialHandling ||
                     "None"}
                  </p>


                  <span className="shipment-status">


                    {shipment.status}

                    {shipment.status || "Submitted"}
                  </span>


                  <button
                    type="button"
                    onClick={() => setSelectedShipment(shipment)}
                    style={{
                      backgroundColor: "#087c76",
                      color: "#ffffff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginTop: "12px"
                    }}
                  >

                    View Details

                  </button>
                 
                <button
                    type="button"
                    onClick={() => {
                       const confirmDelete = window.confirm(
                       "Are you sure you want to delete this shipment?"
      );

                   if (confirmDelete) {
                         deleteShipment(shipment.id);
                         setSelectedShipment(null);
  }
}}
  style={{
    backgroundColor: "#dc3545",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "12px",
    marginLeft: "10px"
  }}
>
  Delete Shipment
</button>


                </div>
                

              ))}

            </div>

          )}

        </div>


        {/* Shipment Form */}

        {showShipmentForm && (

          <ShipmentForm

            onCancel={() => setShowShipmentForm(false)}

            onSubmit={handleShipmentSubmit}

          />

        )}

      </div>
        

      </div>

      
{/* Shipment Form */}
{showShipmentForm && (
  <ShipmentForm
    onCancel={() => setShowShipmentForm(false)}
    onSubmit={handleShipmentSubmit}
  />
)}



{/* Marketplace */}
<section>
  <Marketplace />
</section>

      {/* Shipment Details Modal */}

      {selectedShipment && (

        <div className="shipment-modal-overlay">

          <div className="shipment-modal">

            <h2>Shipment Details</h2>


            <p>
              <strong>Origin:</strong>{" "}
              {selectedShipment.origin}
            </p>


            <p>
              <strong>Destination:</strong>{" "}
              {selectedShipment.destination}
            </p>


            <p>
              <strong>Cargo Type:</strong>{" "}
              {selectedShipment.cargoType}
            </p>


            <p>
              <strong>Description:</strong>{" "}
              {selectedShipment.description ||
               selectedShipment.cargoDescription}
            </p>


            <p>
              <strong>Volume:</strong>{" "}
              {selectedShipment.volume} CBM
            </p>


            <p>
              <strong>Weight:</strong>{" "}
              {selectedShipment.weight} KG
            </p>


            <p>
              <strong>Shipping Date:</strong>{" "}
              {selectedShipment.shippingDate}
            </p>


            <p>
              <strong>Special Requirements:</strong>{" "}
              {selectedShipment.specialRequirements ||
               selectedShipment.specialHandling ||
               "None"}
            </p>
           
<button
  type="button"
  onClick={() => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shipment?"
    );

    if (confirmDelete) {
      deleteShipment(selectedShipment.id);

      setSelectedShipment(null);
    }
  }}
  style={{
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px"
  }}
>
  Delete Shipment
</button>

<button
  type="button"
  onClick={() => setSelectedShipment(null)}
>
  Close
</button>
 

          </div>

        </div>

      )}

    
 
      {showAIAssistant && (
        <div className="shipment-modal-overlay">
          <div className="shipment-modal">
            <h2>AI Cargo Assistant</h2>

            <p>
              Describe your cargo in simple language.
              The assistant will help organise your shipment details.
            </p>

            <button
  type="button"
  onClick={() => setShowEditForm(true)}
>
  Edit Shipment
</button>
<button
  type="button"
  onClick={() => handleDeleteShipment(selectedShipment.id)}
>
  Delete Shipment
</button>
<button
  type="button"
  onClick={() => setSelectedShipment(null)}
>
  Close
</button> 
            <textarea
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              placeholder="Example: Ship 500 kg of electronics from Mumbai to Singapore."
              rows={5}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "15px"
              }}
              />
             <button
                type="button"
                disabled={!aiDescription.trim()}
                onClick={() => alert("AI integration will be connected by Member 2.")}
             >  
                Generate Shipment Details
            </button>
            <button
                 type="button"
                 onClick={() => setAiDescription("")}
            >
                 Clear Description
            </button>
            
            <button
              type="button"
              onClick={() => setShowAIAssistant(false)}
            >
              Close Assistant
            </button>
          </div>
        </div>

          )}

      )}
{showEditForm && selectedShipment && (
  <ShipmentForm
    initialData={selectedShipment}
    submitLabel="Update Shipment"
    onSubmit={handleUpdateShipment}
    onCancel={() => setShowEditForm(false)}
  />
)}

    </div>

  );

}


export default ExporterDashboard;