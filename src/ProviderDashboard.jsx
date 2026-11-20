import { useState } from "react";
import ContainerForm from "./ContainerForm.jsx";
import "./ProviderDashboard.css";

function ProviderDashboard( {onLogout}) {
    const [showContainerForm, setShowContainerForm] = useState(false);
    const[containers,setContainers]=useState([]);
  return (
    <div className="provider-dashboard">
      <nav className="provider-navbar">,<button onClick={onLogout}>Logout</button>
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
            <h2>0</h2>
            <p>Published containers</p>
          </div>

          <div className="provider-stat-card">
            <h3>Available Capacity</h3>
            <h2>0 CBM</h2>
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
                        onPublish={(newContainer)=>
                        setContainers((previous)=>[
                            ...previous,
                            {...newContainer,id:Date.now()}
                        ])
                        }
                   />
                )}
               </div>

         
 <div className="provider-action-card">
            <h2>Manage Containers</h2>
            <p>
              View your published containers and update their
              available capacity.
            </p>
            <button type="button">View My Containers</button>
          </div>
        </section>
        <section className="provider-bookings">
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
