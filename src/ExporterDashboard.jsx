import "./Dashboard.css";

function ExporterDashboard({ onLogout }) {
  return (
    <div className="dashboard">
      <nav className="dashboard-nav">,<button onClick={onLogout}>Logout</button>
        <h2>CargoShare AI</h2>
        <span>Exporter Dashboard</span>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Welcome, Exporter!</h1>
          <p>Manage your shipments and discover affordable cargo space.</p>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-card">
            <h3>My Shipments</h3>
            <h2>0</h2>
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

        <div className="dashboard-actions">
          <div className="action-card">
            <h2>Find Cargo Space</h2>
            <p>
              Search for available container space that matches
              your shipping route and cargo requirements.
            </p>
            <button type="button">Find Cargo Space</button>
          </div>

          <div className="action-card">
            <h2>Add a Shipment</h2>
            <p>
              Enter your cargo details to find suitable
              shipping opportunities.
            </p>
            <button type="button">Add Shipment</button>
          </div>

          <div className="action-card">
            <h2>AI Cargo Assistant</h2>
            <p>
              Describe your cargo in simple language and let
              AI help organise your shipment details.
            </p>
            <button type="button">Try AI Assistant</button>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <p>You don't have any shipments yet.</p>
          <p>Your shipment activity will appear here.</p>
        </div>
      </div>
    </div>
  );
}

export default ExporterDashboard;
