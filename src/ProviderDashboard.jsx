
import { useState } from "react";
import ContainerForm from "./ContainerForm.jsx";
import "./ProviderDashboard.css";
import { useBookings } from "./BookingContext.jsx";

function ProviderDashboard({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showContainerForm, setShowContainerForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});

  const {
    bookings,
    updateBookingStatus,
    feedbackMessages,
    sendFeedback
  } = useBookings();

  // Container calculations
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

  // Earnings calculations
  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "Paid (Demo)"
  );

  const pendingPayments = bookings.filter(
    (booking) =>
      booking.bookingStatus === "Accepted" &&
      booking.paymentStatus !== "Paid (Demo)"
  );

  const totalEarnings = paidBookings.reduce(
    (total, booking) =>
      total + Number(booking.agreedPrice || 0),
    0
  );

  const totalPendingAmount = pendingPayments.reduce(
    (total, booking) =>
      total + Number(booking.agreedPrice || 0),
    0
  );

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  // Publish container locally
  function handlePublishContainer(newContainer) {
    const containerData = {
      ...newContainer,
      id: Date.now(),
      totalCapacity: Number(newContainer.totalCapacity),
      availableVolume: Number(newContainer.availableVolume),
      availableWeight: Number(newContainer.availableWeight),
      price: Number(newContainer.price),
      status: "Available"
    };

    setContainers((previous) => [
      ...previous,
      containerData
    ]);

    setShowContainerForm(false);
  }

  // Update container locally
  function handleUpdateContainer(updatedContainer) {
    if (!selectedContainer) return;

    setContainers((previous) =>
      previous.map((container) =>
        container.id === selectedContainer.id
          ? {
              ...container,
              ...updatedContainer,
              totalCapacity: Number(updatedContainer.totalCapacity),
              availableVolume: Number(updatedContainer.availableVolume),
              availableWeight: Number(updatedContainer.availableWeight),
              price: Number(updatedContainer.price)
            }
          : container
      )
    );

    setShowEditForm(false);
    setSelectedContainer(null);
  }

  // Delete container locally
  function handleDeleteContainer(containerId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this container listing?"
    );

    if (!confirmDelete) return;

    setContainers((previous) =>
      previous.filter((container) => container.id !== containerId)
    );
  }

  function handleSendFeedback(bookingId) {
    const message = feedbackDrafts[bookingId] || "";

    if (!message.trim()) return;

    sendFeedback(
      bookingId,
      "Provider",
      "Exporter",
      message
    );

    setFeedbackDrafts((previous) => ({
      ...previous,
      [bookingId]: ""
    }));
  }

  return (
    <div className="provider-dashboard">

      {/* Navigation */}
      <nav className="provider-navbar">
        <h2>CargoShare AI</h2>
        <span>Logistics Provider Dashboard</span>

        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </nav>

      <main className="provider-content">

        {/* Welcome */}
        <section className="provider-welcome">
          <h1>
            Welcome, {user?.displayName || "Logistics Provider"}!
          </h1>

          <p>
            Manage your container capacity, publish available
            cargo space and connect with exporters.
          </p>
        </section>

        {/* Dashboard Navigation */}
        <div className="provider-tabs">
          {["Overview", "My Containers", "Booking Requests", "Earnings"].map(
            (tab) => (
              <button
                key={tab}
                type="button"
                className={activeTab === tab ? "provider-tab active" : "provider-tab"}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* OVERVIEW */}
        {activeTab === "Overview" && (
          <>
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
                <h2>
                  {bookings.filter(
                    (booking) => booking.bookingStatus === "Pending"
                  ).length}
                </h2>
                <p>Requests to review</p>
              </div>

              <div className="provider-stat-card">
                <h3>Total Earnings</h3>
                <h2>{formatCurrency(totalEarnings)}</h2>
                <p>From paid bookings</p>
              </div>

            </section>

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
                  View your published containers and update
                  their available capacity.
                </p>

                <button
                  type="button"
                  onClick={() => setActiveTab("My Containers")}
                >
                  View My Containers
                </button>
              </div>

              <div className="provider-action-card">
                <h2>View Earnings</h2>
                <p>
                  Track your payments and review your transaction history.
                </p>

                <button
                  type="button"
                  onClick={() => setActiveTab("Earnings")}
                >
                  View Earnings
                </button>
              </div>

            </section>
          </>
        )}

        {/* MY CONTAINERS */}
        {activeTab === "My Containers" && (
          <section className="provider-bookings">
            <h2>My Published Containers</h2>

            <button
              type="button"
              onClick={() => setShowContainerForm(true)}
            >
              + Add Container Listing
            </button>

            {containers.length === 0 ? (
              <p>No containers published yet.</p>
            ) : (
              containers.map((container) => (
                <div key={container.id} className="listing-card">

                  <h3>
                    {container.origin} → {container.destination}
                  </h3>

                  <span className="container-status">
                    ● Available
                  </span>

                  <p>Departure: {container.departureDate}</p>
                  <p>Total Capacity: {container.totalCapacity} CBM</p>
                  <p>Available Volume: {container.availableVolume} CBM</p>
                  <p>Available Weight: {container.availableWeight} KG</p>
                  <p>Estimated Price: {formatCurrency(container.price)}</p>
                  <p>
                    Restrictions: {container.restrictions || "None specified"}
                  </p>

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
        )}

        {/* BOOKING REQUESTS */}
        {activeTab === "Booking Requests" && (
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
                  <p>Agreed Price: {formatCurrency(booking.agreedPrice)}</p>
                  <p>Booking Status: {booking.bookingStatus}</p>
                  <p>Payment Status: {booking.paymentStatus || "Unpaid"}</p>

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
                          [booking.id]: e.target.value
                        }))
                      }
                      placeholder="Write a reply to the exporter..."
                      rows={3}
                    />

                    <button
                      type="button"
                      disabled={!(feedbackDrafts[booking.id] || "").trim()}
                      onClick={() => handleSendFeedback(booking.id)}
                    >
                      Send Reply
                    </button>
                  </div>

                </div>
              ))
            )}
          </section>
        )}

        {/* EARNINGS PAGE */}
        {activeTab === "Earnings" && (
          <section className="provider-earnings">

            <h2>My Earnings</h2>
            <p>Track your income from completed demo payments.</p>

            <div className="provider-stats">

              <div className="provider-stat-card">
                <h3>Total Earnings</h3>
                <h2>{formatCurrency(totalEarnings)}</h2>
                <p>Total paid booking amounts</p>
              </div>

              <div className="provider-stat-card">
                <h3>Paid Bookings</h3>
                <h2>{paidBookings.length}</h2>
                <p>Successfully paid demo bookings</p>
              </div>

              <div className="provider-stat-card">
                <h3>Pending Payments</h3>
                <h2>{formatCurrency(totalPendingAmount)}</h2>
                <p>{pendingPayments.length} accepted bookings</p>
              </div>

            </div>

            <div className="earnings-history">

              <h2>Transaction History</h2>

              {paidBookings.length === 0 ? (
                <p>
                  No completed payments yet. Paid bookings will
                  appear here.
                </p>
              ) : (
                <div className="earnings-list">

                  {paidBookings.map((booking) => (
                    <div
                      className="earnings-transaction"
                      key={booking.id}
                    >

                      <div>
                        <h3>
                          {booking.origin} → {booking.destination}
                        </h3>

                        <p>
                          Booking ID: {booking.id}
                        </p>

                        <p>
                          Transaction ID: {booking.transactionId || "Demo transaction"}
                        </p>

                        <p>
                          Payment Date: {booking.paymentDate || "Not available"}
                        </p>
                      </div>

                      <div>
                        <h3>{formatCurrency(booking.agreedPrice)}</h3>
                        <span className="payment-paid">
                          Paid
                        </span>
                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>

            <div className="earnings-history">
              <h2>Pending Payments</h2>

              {pendingPayments.length === 0 ? (
                <p>No pending payments.</p>
              ) : (
                pendingPayments.map((booking) => (
                  <div
                    className="earnings-transaction"
                    key={booking.id}
                  >
                    <div>
                      <h3>
                        {booking.origin} → {booking.destination}
                      </h3>
                      <p>Booking ID: {booking.id}</p>
                      <p>Payment Status: Unpaid</p>
                    </div>

                    <h3>{formatCurrency(booking.agreedPrice)}</h3>
                  </div>
                ))
              )}

            </div>

          </section>
        )}

        {/* ADD CONTAINER FORM */}
        {showContainerForm && (
          <ContainerForm
            onClose={() => setShowContainerForm(false)}
            onPublish={handlePublishContainer}
          />
        )}

        {/* EDIT CONTAINER FORM */}
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
