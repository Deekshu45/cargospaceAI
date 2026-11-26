import { useBookings } from "./BookingContext.jsx";
import { useState } from "react";
import ContainerForm from "./ContainerForm.jsx";
import "./ProviderDashboard.css";

function ProviderDashboard({ onLogout }) {
  const [showContainerForm, setShowContainerForm] = useState(false);
  const [containers, setContainers] = useState([]);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const {
  bookings,
  updateBookingStatus,
  feedbackMessages,
  sendFeedback,
} = useBookings();


  // Calculate total available volume
  const totalAvailableVolume = containers.reduce(
    (total, container) =>
      total + Number(container.availableVolume || 0),
    0
  );

  // Calculate total available weight
  const totalAvailableWeight = containers.reduce(
    (total, container) =>
      total + Number(container.availableWeight || 0),
    0
  );

  // Publish a new container
  const handlePublish = (newContainer) => {
    setContainers((previous) => [
      ...previous,
      {
        ...newContainer,
        id: Date.now()
      }
    ]);

    setShowContainerForm(false);
  };

  // Delete a container
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this container listing?"
    );

    if (confirmDelete) {
      setContainers((previous) =>
        previous.filter((container) => container.id !== id)
      );
    }
  };

  // Scroll to published containers
  const handleViewContainers = () => {
    document
      .getElementById("published-containers")
      ?.scrollIntoView({ behavior: "smooth" });
  };

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

        {/* Welcome Section */}
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
            <p>Space available to share</p>
          </div>

          <div className="provider-stat-card">
            <h3>Booking Requests</h3>
            <h2>
              
            {bookings.filter((booking) => booking.bookingStatus === "Pending").length}

            </h2>
            <p>Requests to review</p>
          </div>

        </section>

        {/* Provider Actions */}
        <section className="provider-actions">

          {/* Publish Container */}
          <div className="provider-action-card">
            <h2>Publish Container Space</h2>

            <p>
              List your unused container capacity and connect
              with exporters looking for cargo space.
            </p>

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
          </div>

          {/* Manage Containers */}
          <div className="provider-action-card">
            <h2>Manage Containers</h2>

            <p>
              View your published containers and update their
              available capacity.
            </p>

            <button
              type="button"
              onClick={handleViewContainers}
            >
              View My Containers
            </button>
          </div>

        </section>

        {/* Container Form */}
        {showContainerForm && (
          <ContainerForm
            onClose={() => setShowContainerForm(false)}
            onPublish={handlePublish}
          />
        )}

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
              <div
                key={container.id}
                className="listing-card"
              >
                <h3>
                  {container.origin} → {container.destination}
                </h3>

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

                <p>
                  Departure: {container.departureDate}
                </p>

                <p>
                  Total Capacity: {container.totalCapacity} CBM
                </p>

                <p>
                  Available Volume: {container.availableVolume} CBM
                </p>

                <p>
                  Available Weight: {container.availableWeight} KG
                </p>

                <p>
                  Estimated Price: ₹{container.price}
                </p>

                <p>
                  Restrictions: {container.restrictions || "None specified"}
                </p>

                <button
                  type="button"
                  onClick={() => handleDelete(container.id)}
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

        {/* Booking Requests */}
        
<section className="provider-bookings">
  <h2>Booking Requests</h2>

  {bookings.length === 0 ? (
    <p>You don't have any booking requests yet.</p>
  ) : (
    bookings.map((booking) => (
      <div className="listing-card" key={booking.id}>
        <h3>
          {booking.origin} → {booking.destination}
        </h3>

        <p>Cargo Type: {booking.cargoType}</p>
        <p>Volume: {booking.volume} CBM</p>
        <p>Weight: {booking.weight} KG</p>
        <p>Agreed Price: ₹{booking.agreedPrice}</p>
        <p>Booking Status: {booking.bookingStatus}</p>

        {booking.bookingStatus === "Pending" && (
          <>
            <button
              type="button"
              className="booking-accept-btn"
              onClick={() =>
                updateBookingStatus(booking.id, "Accepted")
              }
            >
              Accept Booking
            </button>

            <button
              type="button"
              className="booking-reject-btn"
              onClick={() =>
                updateBookingStatus(booking.id, "Rejected")
              }
            >
              Reject Booking
            </button>
          </>
        )}
       {booking.bookingStatus === "Accepted" && (
  <button
    type="button"
    className="booking-accept-btn"
    onClick={() =>
      updateBookingStatus(booking.id, "Shipped")
    }
  >
    Mark as Shipped 🚚
  </button>
)} 
<div className="booking-feedback">
  <h3>Messages from Exporter</h3>

  {feedbackMessages
    .filter(
      (message) =>
        message.bookingId === booking.id &&
        message.receiver === "Provider"
    )
    .map((message) => (
      <p key={message.id}>
        <strong>Exporter:</strong> {message.message}
        <br />
        <small>{message.date}</small>
      </p>
    ))}

  <h3>Reply to Exporter</h3>

  <textarea
    value={feedbackDrafts[booking.id] || ""}
    onChange={(e) =>
      setFeedbackDrafts((previous) => ({
        ...previous,
        [booking.id]: e.target.value,
      }))
    }
    placeholder="Write a reply to the exporter..."
    rows={3}
  />

  <button
    type="button"
    disabled={!(feedbackDrafts[booking.id] || "").trim()}
    onClick={() => {
      sendFeedback(
        booking.id,
        "Provider",
        "Exporter",
        feedbackDrafts[booking.id]
      );

      setFeedbackDrafts((previous) => ({
        ...previous,
        [booking.id]: "",
      }));
    }}
  >
    Send Reply
  </button>
</div>
      </div>
    ))
  )}
</section>


      </main>
    </div>
  );
}

export default ProviderDashboard;
