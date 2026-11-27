import { useState, useEffect } from "react";
import ShipmentForm from "./ShipmentForm.jsx";
import Marketplace from "./Marketplace.jsx";
import "./Dashboard.css";

import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "firebase/auth";
import AICargoAssistant from "./AICargoAssistant.jsx";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";


function ExporterDashboard({ onLogout,user }) {

  const [showShipmentForm, setShowShipmentForm] = useState(false);
const [showEditForm, setShowEditForm] = useState(false);
  const [shipments, setShipments] = useState([]);
const [containers, setContainers] = useState([]);
const [bookingRequests, setBookingRequests] = useState([]);
const [showContainers, setShowContainers] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const [currentUser, setCurrentUser] = useState(user || auth.currentUser || null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [showAIAssistant, setShowAIAssistant] = useState(false);
const [aiDescription, setAiDescription] = useState("");
const [showAIChat, setShowAIChat] = useState(false);

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
// Load booking requests for logged-in exporter
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
      console.error("Exporter booking error:", error);
    }
  );

  return () => unsubscribe();

}, [currentUser]);

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

} catch (error) {
  console.error("Delete error:", error);
  alert("Failed to delete shipment: " + error.message);
}
}
    

  return (

    <div className="dashboard">

      {/* Navigation */}

      <nav className="dashboard-nav">

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

           <h2>
  {bookingRequests.filter(
    (request) => request.status === "Pending"
  ).length}
</h2>

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
          <div className="action-card">

  <h2>AI Cargo Assistant</h2>

  <p>
    Get intelligent assistance with cargo,
    shipping routes and logistics.
  </p>

  <button
    type="button"
    onClick={() => setShowAIAssistant(true)}
  >
    AI Cargo Description
  </button>

  <button
    type="button"
    onClick={() => setShowAIChat(true)}
  >
    Chat with AI
  </button>

</div>
    </div>
</div>        

{/* Available Container Listings */}
{showContainers && (
  <div className="recent-activity">

    <h2>Available Container Space</h2>

    <button
      type="button"
      onClick={() => setShowContainers(false)}
    >
      Close
    </button>

    {containers.length === 0 ? (
      <p>No container listings available right now.</p>
    ) : (
      <div className="shipment-list">

        {containers.map((container) => (
          <div className="shipment-card" key={container.id}>

            <h3>
              {container.origin} → {container.destination}
            </h3>

            <p>
              <strong>Departure Date:</strong>{" "}
              {container.departureDate}
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
              <strong>Price:</strong> ₹{container.price}
            </p>

            <p>
              <strong>Restrictions:</strong>{" "}
              {container.restrictions || "None"}
            </p>

            <button
              type="button"
              onClick={() => handleBookingRequest(container)}
            >
              Request Booking
            </button>

          </div>
        ))}

      </div>
    )}

  </div>
)}



        {/* Shipment List */}
        {/* Recent Shipments */}
        <div className="recent-activity">

{/* My Booking Requests */}

<section className="recent-activity">

  <h2>My Booking Requests</h2>

  {bookingRequests.length === 0 ? (

    <p>You have not made any booking requests yet.</p>

  ) : (

    <div className="shipment-list">

      {bookingRequests.map((request) => (

        <div className="shipment-card" key={request.id}>

          <h3>
            {request.origin} → {request.destination}
          </h3>

          <p>
            <strong>Booking ID:</strong> {request.id}
          </p>

          <p>
          <strong>Booking Status:</strong>

<span className="shipment-status">
  {request.status === "Accepted"
    ? "Booking Accepted ✅"
    : request.status === "Rejected"
    ? "Booking Rejected ❌"
    : "Waiting for Provider ⏳"}
</span>

          </p>

          <p>
            <strong>Departure Date:</strong>
            {" "}
            {request.departureDate || "Not specified"}
          </p>

        </div>

      ))}

    </div>

  )}

</section>

          <h2>My Shipments</h2>

          {loading ? (

            <p>Loading shipments...</p>

          ) : error ? (

            <p>{error}</p>

          ) : shipments.length === 0 ? (

            <div>

              <p>You don't have any shipments yet.</p>

              <p>Your shipment activity will appear here.</p>

            </div>

          ) : (

            <div className="shipment-list">

              {shipments.map((shipment, index) => (
                

               <div className="shipment-card" key={shipment.id}>

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
    setSelectedShipment(shipment);
    setShowEditForm(true);
  }}
>
  Edit Shipment
</button>
  
                <button
                    type="button"
      onClick={() => handleDeleteShipment(shipment.id)}             
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
  onClick={() => handleDeleteShipment(selectedShipment.id)}
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
     {showAIChat && (
  <AICargoAssistant
    onClose={() => setShowAIChat(false)}
  />
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