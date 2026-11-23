
import { useState } from "react";
import { useShipments } from "./ShipmentContext";
import ShipmentForm from "./ShipmentForm.jsx";
import Marketplace from "./Marketplace.jsx";
import "./Dashboard.css";

function ExporterDashboard({ onLogout }) {
  const { shipments } = useShipments();

  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  return (
    <div className="dashboard">

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button onClick={onLogout}>Logout</button>
        <h2>CargoShare AI</h2>
        <span>Exporter Dashboard</span>
      </nav>

      <div className="dashboard-content">

        {/* Welcome */}
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
              Search for available container space that matches
              your shipping route and cargo requirements.
            </p>

            <button
              type="button"
              onClick={() => setShowShipmentForm(true)}
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
              Describe your cargo in simple language and let
              AI help organise your shipment details.
            </p>

            <button type="button">
              Try AI Assistant
            </button>
          </div>

        </div>

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
                    {shipment.description}
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
                    {shipment.specialRequirements || "None"}
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

                </div>

              ))}

            </div>

          )}

        </div>

        {/* Shipment Form */}
        {showShipmentForm && (
          <ShipmentForm
            onCancel={() => setShowShipmentForm(false)}
          />
        )}

        {/* Marketplace */}
        <section>
          <Marketplace />
        </section>

      </div>

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
              {selectedShipment.description}
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
              {selectedShipment.specialRequirements || "None"}
            </p>

            <button
              type="button"
              onClick={() => setSelectedShipment(null)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default ExporterDashboard;
