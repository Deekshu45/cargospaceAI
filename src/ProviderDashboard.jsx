import { useState } from "react";
import ContainerForm from "./ContainerForm.jsx";
import "./ProviderDashboard.css";

function ProviderDashboard( {onLogout}) {
    const [showContainerForm, setShowContainerForm] = useState(false);
    const[containers,setContainers]=useState([]);
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
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this container listing?"
  );

  if (confirmDelete) {
    setContainers((previous) =>
      previous.filter((item) => item.id !== container.id)
    );
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
