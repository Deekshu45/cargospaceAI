import { useState, useEffect } from "react";
import ContainerForm from "./ContainerForm.jsx";
import "./ProviderDashboard.css";

import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import "./ProviderDashboard.css";

function ProviderDashboard( {onLogout}) {
    const [showContainerForm, setShowContainerForm] = useState(false);
    const[containers,setContainers]=useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
const [selectedContainer, setSelectedContainer] = useState(null);
    const [currentUser, setCurrentUser] = useState(auth.currentUser);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
  });

  return () => unsubscribe();
}, []);
useEffect(() => {
  if (!currentUser) {
    setContainers([]);
    return;
  }

  const q = query(
    collection(db, "containers"),
    where("providerId", "==", currentUser.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const containerList = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data()
    }));

    setContainers(containerList);
  }, (error) => {
    console.error("Error fetching containers:", error);
  });

  return () => unsubscribe();
}, [currentUser]);
// Save container listing to Firebase
async function handlePublishContainer(newContainer) {
  try {
    if (!currentUser) {
      alert("Please login first!");
      return;
    }

    const containerData = {
      providerId: currentUser.uid,
      origin: newContainer.origin || "",
      destination: newContainer.destination || "",
      departureDate: newContainer.departureDate || "",
      totalCapacity: Number(newContainer.totalCapacity) || 0,
      availableVolume: Number(newContainer.availableVolume) || 0,
      availableWeight: Number(newContainer.availableWeight) || 0,
      price: Number(newContainer.price) || 0,
      restrictions: newContainer.restrictions || "",
      status: "Available",
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, "containers"), containerData);

    alert("Container published successfully!");
    setShowContainerForm(false);

  } catch (error) {
    console.error("Container publish error:", error);
    alert("Failed to publish container: " + error.message);
  }
}
async function handleUpdateContainer(updatedContainer) {
  try {
    if (!selectedContainer || !currentUser) {
      alert("Please select a container first!");
      return;
    }

    await updateDoc(
      doc(db, "containers", selectedContainer.id),
      {
        origin: updatedContainer.origin || "",
        destination: updatedContainer.destination || "",
        departureDate: updatedContainer.departureDate || "",
        totalCapacity: Number(updatedContainer.totalCapacity) || 0,
        availableVolume: Number(updatedContainer.availableVolume) || 0,
        availableWeight: Number(updatedContainer.availableWeight) || 0,
        price: Number(updatedContainer.price) || 0,
        restrictions: updatedContainer.restrictions || ""
      }
    );

    alert("Container updated successfully!");
    setShowEditForm(false);
    setSelectedContainer(null);

  } catch (error) {
    console.error("Update error:", error);
    alert("Failed to update container: " + error.message);
  }
}
const totalAvailableVolume = containers.reduce(
  (total, container) => total + Number(container.availableVolume || 0),
  0
);

const totalAvailableWeight = containers.reduce(
  (total, container) => total + Number(container.availableWeight || 0),
  0
);
    return (
    <div className="provider-dashboard">
      <nav className="provider-navbar">
        <button onClick={onLogout}>Logout</button>
        <h2>CargoShare AI</h2>
        <span>Logistics Provider Dashboard</span>
      </nav>

      <main className="provider-content">
        <section className="provider-welcome">
          <h1>Welcome, Logistics Provider!</h1>
          <p>
            Manage your container capacity, publish available
            cargo space and connect with exporters.
          </p>
        </section>

        <section className="provider-stats">
          <div className="provider-stat-card">
            <h3>Total Containers</h3>
            <h2>{containers.length}</h2>
            <p>Published containers</p>
          </div>

          <div className="provider-stat-card">
            <h3>Available Capacity</h3>
            <h2>{totalAvailableVolume} CBM</h2>
            <p>{totalAvailableWeight} KG Available</p>
            <p>Space available to share</p>
          </div>

          <div className="provider-stat-card">
            <h3>Booking Requests</h3>
            <h2>0</h2>
            <p>Requests to review</p>
          </div>
        </section>

        <section className="provider-actions">
          <div className="provider-action-card">
            <h2>Publish Container Space</h2>
            <p>
              List your unused container capacity and connect
              with exporters looking for cargo space.
            </p>
               </div>
               <div>
               
<button
  type="button"
  onClick={() => setShowContainerForm(true)}
  style={{
    backgroundColor: "#B8794E",
    color: "#FFFFFF",
    border: "none",
    padding: "14px 24px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer"
  }}
>
  Add Container Listing
</button>
               {showContainerForm && (
                   <ContainerForm
                        onClose={() => setShowContainerForm(false)}
                        onPublish={handlePublishContainer}
                   />
                )}
               {showEditForm && selectedContainer && (
  <ContainerForm
    initialData={selectedContainer}
    submitLabel="Update Container"
    onPublish={handleUpdateContainer}
    onClose={() => {
      setShowEditForm(false);
      setSelectedContainer(null);
    }}
  />
)}
               </div>

         
 <div className="provider-action-card">
            <h2>Manage Containers</h2>
            <p>
              View your published containers and update their
              available capacity.
            </p>
            <button
  type="button"
  onClick={() => {
    document
      .getElementById("my-published-containers")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
>
  View My Containers
</button>
          </div>
        </section>
        <section className="provider-bookings">
  <h2 id="My Published Containers">My Published Containers</h2>

  {containers.length === 0 ? (
    <p>No containers published yet.</p>
  ) : (
    containers.map((container) => (
      <div key={container.id} className="listing-card">
        <h3>
          {container.origin} → {container.destination}
          <span
  style={{
    backgroundColor: "#D1FAE5",
    color: "#065F46",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
    marginBottom: "12px"
  }}
>
  ● Available
</span>
        </h3>
        <p>Departure: {container.departureDate}</p>
        <p>Total Capacity: {container.totalCapacity} CBM</p>
        <p>Available Volume: {container.availableVolume} CBM</p>
        <p>Available Weight: {container.availableWeight} KG</p>
        <p>Estimated Price: ₹{container.price}</p>
        <p>Restrictions: {container.restrictions || "None specified"}</p>
        <button
  type="button"
  onClick={() => {
    setSelectedContainer(container);
    setShowEditForm(true);
  }}
  style={{
          backgroundColor: "#DC3545",
          color: "white",
          border: "none",
          padding: "10px 18px",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          marginTop: "12px"
         }}
>
Edit Listing
</button>

{/* Delete Listing Button */}
<button
  type="button"
  onClick={async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this container listing?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "containers", container.id)
      );

      alert("Container deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete container: " + error.message);
    }
  }}
  style={{
    backgroundColor: "#DC3545",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "12px"
  }}
>
  Delete Listing
</button>
      </div>
    ))
  )}
</section>
        <section className="provider-bookings">
          <h2>Booking Requests</h2>
          <p>You don't have any booking requests yet.</p>
          <p>New exporter requests will appear here.</p>
        </section>
      </main>
    </div>
  );
}

export default ProviderDashboard;
