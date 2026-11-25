
import { useShipments } from "./ShipmentContext";
import { useState } from "react";
import "./Marketplace.css";

const sampleListings = [
  {
    id: 1,
    origin: "Mumbai",
    destination: "Singapore",
    capacity: 12,
    price: 15000,
    container: "40 ft",
    date: "2026-12-15"
  },
  {
    id: 2,
    origin: "Chennai",
    destination: "Dubai",
    capacity: 8,
    price: 11000,
    container: "20 ft",
    date: "2026-12-18"
  },
  {
    id: 3,
    origin: "Bengaluru",
    destination: "Singapore",
    capacity: 15,
    price: 18000,
    container: "40 ft",
    date: "2026-12-22"
  }
];

function Marketplace() {
  const{shipments}=useShipments();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [message, setMessage] = useState("");
 const [bookingRequests, setBookingRequests] = useState([]); 

  const filteredListings = sampleListings.filter((item) => {
    const matchesOrigin = item.origin
      .toLowerCase()
      .includes(origin.toLowerCase());

    const matchesDestination = item.destination
      .toLowerCase()
      .includes(destination.toLowerCase());

    const matchesPrice =
      !maxPrice || item.price <= Number(maxPrice);

    return matchesOrigin && matchesDestination && matchesPrice;
  });

  return (
    <div className="marketplace-page">
      <header className="marketplace-header">
        <h1>CargoShare AI</h1>
        <span>Explore Cargo Space</span>
      </header>

      <main className="marketplace-container">
        <section className="marketplace-heading">
          <h1>Find Shared Cargo Space</h1>
          <p>
            Discover available container space and make
            your shipping more affordable.
          </p>
        </section>

        <section className="marketplace-search">
          <h2>Search Available Space</h2>

          <div className="search-grid">
            <div>
              <label>Origin</label>
              <input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Enter origin city"
              />
            </div>

            <div>
              <label>Destination</label>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination"
              />
            </div>

            <div>
              <label>Maximum Price (₹)</label>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Enter budget"
              />
            </div>
          </div>
        </section>
        
<section className="marketplace-listings">
  <h2>Available Shipments</h2>

  {shipments.length === 0 ? (
    <p>No shipments available yet.</p>
  ) : (
    shipments.map((item) => (
      <div className="listing-card" key={item.id}>
        <h3>
          {item.origin} → {item.destination}
        </h3>

        <p>Cargo Type: {item.cargoType}</p>
        <p>Departure: {item.departureDate}</p>
        <p>Weight: {item.weight} kg</p>
        <p>Volume: {item.volume} CBM</p>

        <span>{item.status}</span>
      </div>
    ))
  )}
</section>


        <section className="marketplace-results">
          <h2>Available Containers</h2>

          <p>{filteredListings.length} listings found</p>

          <div className="listing-grid">
            {filteredListings.map((item) => (
              <div className="container-card" key={item.id}>
                <span className="available-label">Available</span>

                <h3>
                  {item.origin} → {item.destination}
                </h3>

                <div className="container-info">
                  <p>Capacity: <strong>{item.capacity} CBM</strong></p>
                  <p>Container: <strong>{item.container}</strong></p>
                  <p>Departure: <strong>{item.date}</strong></p>
                </div>

                <div className="container-price">
                  ₹{item.price.toLocaleString("en-IN")}
                </div>

                <button
                  className="marketplace-button"
                  onClick={() => {
                    setSelectedListing(item);
                    setMessage("");
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <p className="no-results">
              No matching cargo listings found.
              Try changing your search.
            </p>
          )}
        </section>

        {selectedListing && (
          <div className="listing-details">
            <h2>Container Details</h2>

            <p>
              Route: {selectedListing.origin} →
              {" "}{selectedListing.destination}
            </p>

            <p>Available capacity: {selectedListing.capacity} CBM</p>

            <p>Estimated price: ₹{selectedListing.price.toLocaleString("en-IN")}</p>

           <button
  className="marketplace-button"
  onClick={() => {
    const newRequest = {
      id: Date.now(),
      origin: selectedListing.origin,
      destination: selectedListing.destination,
      cargoType: "Electronics",
      volume: 5,
      weight: 1200,
      status: "Pending"
    };

    setBookingRequests((previous) => [
      ...previous,
      newRequest
    ]);

    setMessage("Demo request submitted successfully. Status: Pending.");
  }}
>
  Request Cargo Space
</button> 

            {message && <p>{message}</p>}

            <button
              className="close-button"
              onClick={() => setSelectedListing(null)}
            >
              Close Details
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Marketplace;
