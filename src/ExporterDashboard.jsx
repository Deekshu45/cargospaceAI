
import { useState, useEffect } from "react";
import { useShipments } from "./ShipmentContext.jsx";
import { useBookings } from "./BookingContext.jsx";
import ShipmentForm from "./ShipmentForm.jsx";
import "./Dashboard.css";

function ExporterDashboard({ onNavigate }) {
  const { shipments, addShipment, deleteShipment } = useShipments();

  const {
    bookings,
    updatePaymentStatus,
    feedbackMessages,
    sendFeedback,
  } = useBookings();

  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const [reminderBooking, setReminderBooking] = useState(null);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiDescription, setAiDescription] = useState("");

  // Find upcoming payment reminders.
  useEffect(() => {
    const upcomingPayment = bookings.find((booking) => {
      if (
        booking.paymentStatus !== "Unpaid" ||
        !booking.paymentDueDate
      ) {
        return false;
      }

      const timeLeft =
        new Date(booking.paymentDueDate).getTime() - Date.now();

      return timeLeft > 0 && timeLeft <= 2 * 24 * 60 * 60 * 1000;
    });

    setReminderBooking(upcomingPayment || null);
  }, [bookings]);

  // Add a shipment.
  function handleShipmentSubmit(newShipment) {
    const shipmentWithDetails = {
      ...newShipment,
      id: Date.now(),
      status: "Pending",
    };

    addShipment(shipmentWithDetails);
    setShowShipmentForm(false);

    alert("Shipment added successfully!");
  }

  // Update an existing shipment.
  function handleUpdateShipment(updatedShipment) {
    if (!selectedShipment) return;

    const updatedData = {
      ...updatedShipment,
      id: selectedShipment.id,
      status: selectedShipment.status || "Pending",
    };

    deleteShipment(selectedShipment.id);
    addShipment(updatedData);

    setSelectedShipment(null);
    setShowEditForm(false);

    alert("Shipment updated successfully!");
  }

  // Delete a shipment.
  function handleDeleteShipment(shipmentId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shipment?"
    );

    if (!confirmDelete) return;

    deleteShipment(shipmentId);
    setSelectedShipment(null);
    setShowEditForm(false);

    alert("Shipment deleted successfully!");
  }

  // Send feedback to a logistics provider.
  function handleSendFeedback(bookingId) {
    const message = feedbackDrafts[bookingId] || "";

    if (!message.trim()) return;

    sendFeedback(
      bookingId,
      "Exporter",
      "Provider",
      message
    );

    setFeedbackDrafts((previous) => ({
      ...previous,
      [bookingId]: "",
    }));
  }

  const acceptedBookings = bookings.filter(
    (booking) =>
      booking.bookingStatus === "Accepted" ||
      booking.bookingStatus === "Shipped"
  );

  const pendingBookings = bookings.filter(
    (booking) => booking.bookingStatus === "Pending"
  );

  return (
    <div className="dashboard">
      {/* Payment Reminder */}
      {reminderBooking && (
        <div className="payment-reminder-overlay">
          <div className="payment-reminder-popup">
            <h2>🔔 Payment Reminder!</h2>

            <p>Your payment deadline is approaching!</p>

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
                  updatePaymentStatus(
                    reminderBooking.id,
                    "Paid (Demo)"
                  );

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

      <div className="dashboard-content">
        {/* Dashboard Welcome */}
        <div className="dashboard-welcome">
          <h1>Welcome, Exporter!</h1>
          <p>
            Manage your shipments and discover affordable cargo space.
          </p>
        </div>

        {/* Dashboard Statistics */}
        <div className="dashboard-stats">
          <div className="dashboard-card">
            <h3>My Shipments</h3>
            <h2>{shipments.length}</h2>
            <p>Total shipments</p>
          </div>

          <div className="dashboard-card">
            <h3>Booking Requests</h3>
            <h2>{pendingBookings.length}</h2>
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
              Search for available container space matching your
              shipping route and cargo requirements.
            </p>

            <button
              type="button"
              onClick={() => onNavigate?.("marketplace")}
            >
              Find Cargo Space
            </button>
          </div>

          <div className="action-card">
            <h2>Add a Shipment</h2>
            <p>
              Enter your cargo details to find suitable shipping
              opportunities.
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
              Describe your cargo in simple language and let AI help
              organise your shipment details.
            </p>

            <button
              type="button"
              onClick={() => setShowAIAssistant(true)}
            >
              Try AI Assistant
            </button>
          </div>
        </div>

        {/* Shipment Form */}
        {showShipmentForm && (
          <ShipmentForm
            onCancel={() => setShowShipmentForm(false)}
            onSubmit={handleShipmentSubmit}
          />
        )}

        {/* Recent Shipments */}
        <div className="recent-activity">
          <h2>My Shipments</h2>

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
                  key={shipment.id || index}
                >
                  <p className="shipment-reference">
                    Shipment ID: {shipment.id}
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
                    <strong>Volume:</strong> {shipment.volume} CBM
                  </p>

                  <p>
                    <strong>Weight:</strong> {shipment.weight} KG
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

                  <div className="shipment-actions">
                    <button
                      type="button"
                      onClick={() => setSelectedShipment(shipment)}
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
                    >
                      Delete Shipment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Feedback */}
        <section className="dashboard-card">
          <h2>Booking Feedback</h2>

          {acceptedBookings.length === 0 ? (
            <p>
              Feedback and provider messages will appear here after a
              booking is accepted.
            </p>
          ) : (
            acceptedBookings.map((booking) => (
              <div className="payment-card" key={booking.id}>
                <h3>
                  {booking.origin} → {booking.destination}
                </h3>

                <p>
                  <strong>Booking Status:</strong>{" "}
                  {booking.bookingStatus}
                </p>

                <div className="booking-feedback">
                  <h4>Feedback to Logistics Provider</h4>

                  <textarea
                    value={feedbackDrafts[booking.id] || ""}
                    onChange={(event) =>
                      setFeedbackDrafts((previous) => ({
                        ...previous,
                        [booking.id]: event.target.value,
                      }))
                    }
                    placeholder="Write a message to your logistics provider..."
                    rows={3}
                  />

                  <button
                    type="button"
                    disabled={
                      !(feedbackDrafts[booking.id] || "").trim()
                    }
                    onClick={() => handleSendFeedback(booking.id)}
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
                        <strong>Provider:</strong>{" "}
                        {message.message}
                        <br />
                        <small>{message.date}</small>
                      </p>
                    ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      {/* Shipment Details Modal */}
      {selectedShipment && !showEditForm && (
        <div className="shipment-modal-overlay">
          <div className="shipment-modal">
            <h2>Shipment Details</h2>

            <p>
              <strong>Origin:</strong> {selectedShipment.origin}
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
              <strong>Volume:</strong> {selectedShipment.volume} CBM
            </p>

            <p>
              <strong>Weight:</strong> {selectedShipment.weight} KG
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
          </div>
        </div>
      )}

      {/* Edit Shipment */}
      {showEditForm && selectedShipment && (
        <ShipmentForm
          initialData={selectedShipment}
          submitLabel="Update Shipment"
          onSubmit={handleUpdateShipment}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      {/* AI Cargo Assistant */}
      {showAIAssistant && (
        <div className="shipment-modal-overlay">
          <div className="shipment-modal">
            <h2>AI Cargo Assistant</h2>

            <p>
              Describe your cargo in simple language. The assistant
              will help organise your shipment details.
            </p>

            <textarea
              value={aiDescription}
              onChange={(event) =>
                setAiDescription(event.target.value)
              }
              placeholder="Example: Ship 500 kg of electronics from Mumbai to Singapore."
              rows={5}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "15px",
              }}
            />

            <button
              type="button"
              disabled={!aiDescription.trim()}
              onClick={() =>
                alert("AI integration will be connected separately.")
              }
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
    </div>
  );
}

export default ExporterDashboard;
