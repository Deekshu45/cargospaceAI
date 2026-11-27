
import { useState, useEffect } from "react";
import { useShipments } from "./ShipmentContext";
import { useBookings } from "./BookingContext.jsx";

import ShipmentForm from "./ShipmentForm.jsx";
import Marketplace from "./Marketplace.jsx";
import PaymentPage from "./PaymentPage.jsx";

import "./Dashboard.css";

function ExporterDashboard({ onLogout }) {
  // Shipment context
  const {
    shipments,
    addShipment,
    deleteShipment,
  } = useShipments();

  // Booking context
  const {
    bookings,
    updatePaymentStatus,
    feedbackMessages,
    sendFeedback,
  } = useBookings();

  // Dashboard states
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Payment states
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [reminderBooking, setReminderBooking] = useState(null);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});

  // AI Assistant states
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiDescription, setAiDescription] = useState("");

  // Find upcoming payment reminders
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

      return (
        timeLeft > 0 &&
        timeLeft <= 2 * 24 * 60 * 60 * 1000
      );
    });

    setReminderBooking(upcomingPayment || null);
  }, [bookings]);

  // Add shipment
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

  // Update shipment using existing context functions
  function handleUpdateShipment(updatedShipment) {
    if (!selectedShipment) {
      return;
    }

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

  // Delete shipment
  function handleDeleteShipment(shipmentId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shipment?"
    );

    if (!confirmDelete) {
      return;
    }

    deleteShipment(shipmentId);
    setSelectedShipment(null);

    alert("Shipment deleted successfully!");
  }

  // Payment page
  if (showPaymentPage) {
    return (
      <PaymentPage
        bookings={bookings}
        updatePaymentStatus={updatePaymentStatus}
        onBack={() => setShowPaymentPage(false)}
      />
    );
  }

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

        {/* Logged-in User */}
        <p>Welcome to your CargoShare AI dashboard.</p>

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

                <div
                  key={booking.id}
                  className="payment-card"
                >

                  <h3>
                    {booking.origin} → {booking.destination}
                  </h3>

                  {booking.bookingStatus === "Shipped" ? (

                    <p className="payment-accepted-message">
                      🚚 Your goods have been shipped by the logistics provider.
                    </p>

                  ) : (

                    <p className="payment-accepted-message">
                      ✓ The provider has accepted your request!
                    </p>

                  )}

                  <p>Amount: ₹{booking.agreedPrice}</p>

                  <p>
                    Payment Status: {booking.paymentStatus}
                  </p>

                  {booking.paymentStatus === "Unpaid" &&
                    booking.paymentDueDate && (

                      <>
                        <p>
                          <strong>Payment Due:</strong>{" "}
                          {new Date(
                            booking.paymentDueDate
                          ).toLocaleDateString()}
                        </p>

                        <p className="payment-countdown">

                          {new Date(booking.paymentDueDate) >= new Date()
                            ? `⏳ ${
                                Math.ceil(
                                  (
                                    new Date(
                                      booking.paymentDueDate
                                    ).getTime() - Date.now()
                                  ) /
                                  (1000 * 60 * 60 * 24)
                                )
                              } days remaining to pay.`
                            : "⚠️ Payment overdue! Please complete your payment."}

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
                          updatePaymentStatus(
                            booking.id,
                            "Paid (Demo)"
                          );
                        }
                      }}
                    >
                      Pay Now
                    </button>

                  )}

                  {/* Feedback */}
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
                      disabled={
                        !(feedbackDrafts[booking.id] || "").trim()
                      }
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
              {bookings.filter(
                (booking) => booking.bookingStatus === "Pending"
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
              onClick={() =>
                document.getElementById("marketplace")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
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
                      onClick={() =>
                        handleDeleteShipment(shipment.id)
                      }
                    >
                      Delete Shipment
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* Marketplace */}
        <section id="marketplace">

          <Marketplace />

        </section>

      </div>

      {/* Shipment Details Modal */}
      {selectedShipment && !showEditForm && (

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
              onClick={() => setShowEditForm(true)}
            >
              Edit Shipment
            </button>

            <button
              type="button"
              onClick={() =>
                handleDeleteShipment(selectedShipment.id)
              }
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

      {/* AI Assistant */}
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
                marginTop: "15px",
              }}
            />

            <button
              type="button"
              disabled={!aiDescription.trim()}
              onClick={() =>
                alert(
                  "AI integration will be connected separately."
                )
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
