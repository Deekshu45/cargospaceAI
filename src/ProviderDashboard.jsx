
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

function ProviderDashboard({ onLogout }) {

  const [showContainerForm, setShowContainerForm] = useState(false);
  const [containers, setContainers] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [bookingRequests, setBookingRequests] = useState([]);

  // Get logged-in provider
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Load provider containers
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

  // Load booking requests for this provider
  useEffect(() => {
    if (!currentUser) {
      setBookingRequests([]);
      return;
    }

    const bookingQuery = query(
      collection(db, "bookingRequests"),
      where("providerId", "==", currentUser.uid)
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
        console.error("Booking requests error:", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Publish container
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

  // Update container
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

  // Delete container
  async function handleDeleteContainer(containerId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this container listing?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "containers", containerId));
      alert("Container deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete container: " + error.message);
    }
  }

  // Accept or reject booking request
  async function handleBookingStatus(requestId, newStatus) {
    try {
      await updateDoc(
        doc(db, "bookingRequests", requestId),
        {
          status: newStatus
        }
      );

      alert("Booking request " + newStatus.toLowerCase() + "!");
    } catch (error) {
      console.error("Booking update error:", error);
      alert("Failed to update booking: " + error.message);
    }
  }

  const totalAvailableVolume = containers.reduce(
    (total, container) =>
      total + Number(container.availableVolume || 0),
    0
  );

  const totalAvailableWeight = containers.reduce(
    (total, container) =>
      total + Number(container.availableWeight || 0),
    0
  );

  const pendingRequests = bookingRequests.filter(
    (request) => request.status === "Pending"
  ).length;

  return (
    <div className="provider-dashboard">

      {/* Navigation */}
      <nav className="provider-navbar">
        <button type="button" onClick={onLogout}>
          Logout
        </button>

        <h2>CargoShare AI</h2>
        <span>Logistics Provider Dashboard</span>
      </nav>

      <main className="provider-content">

        {/* Welcome */}
        <section className="provider-welcome">
          <h1>Welcome, Logistics Provider!</h1>
          <p>
            Manage your container capacity, publish available
            cargo space and connect with exporters.
          </p>
        </section>

        {/* Statistics */}
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
          </div>

          <div className="provider-stat-card">
            <h3>Booking Requests</h3>
            <h2>{pendingRequests}</h2>
            <p>Pending requests</p>
          </div>

        </section>

        {/* Provider Actions */}
        <section className="provider-actions">

          <div className="provider-action-card">
            <h2>Publish Container Space</h2>
            <p>
              List your unused container capacity and connect
              with exporters.
            </p>

            <button
              type="button"
              onClick={() => setShowContainerForm(true)}
            >
              Add Container Listing
            </button>
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
                document.getElementById("published-containers")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View My Containers
            </button>
          </div>

        </section>

        {/* Published Containers */}
        <section
          className="provider-bookings"
          id="published-containers"
        >
          <h2>My Published Containers</h2>

          {containers.length === 0 ? (
            <p>No containers published yet.</p>
          ) : (
            containers.map((container) => (
              <div key={container.id} className="listing-card">

                <h3>
                  {container.origin} → {container.destination}
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
                >
                  Edit Listing
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteContainer(container.id)}
                >
                  Delete Listing
                </button>

              </div>
            ))
          )}
        </section>

        {/* Booking Requests */}
        <section className="provider-bookings">
          <h2>Booking Requests</h2>

          {bookingRequests.length === 0 ? (
            <p>You don't have any booking requests yet.</p>
          ) : (
            bookingRequests.map((request) => (
              <div key={request.id} className="listing-card">

                <h3>
                  {request.origin} → {request.destination}
                </h3>

                <p>Exporter ID: {request.exporterId}</p>
                <p>Booking Status: {request.status}</p>

                {request.status === "Pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleBookingStatus(request.id, "Accepted")
                      }
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleBookingStatus(request.id, "Rejected")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

              </div>
            ))
          )}
        </section>

        {/* Add Container Form */}
        {showContainerForm && (
          <ContainerForm
            onClose={() => setShowContainerForm(false)}
            onPublish={handlePublishContainer}
          />
        )}

        {/* Edit Container Form */}
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

      </main>
    </div>
  );
}

export default ProviderDashboard;
