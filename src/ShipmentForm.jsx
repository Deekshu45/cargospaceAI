
import { useShipments } from "./ShipmentContext";
import { useState } from "react";
import "./ShipmentForm.css";

function ShipmentForm() {
  const{addShipment}=useShipments();
  const [shipment, setShipment] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    cargoType: "",
    weight: "",
    volume: "",
    description: ""
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setShipment({
      ...shipment,
      [name]: value
    });
  }

  
function handleSubmit(event) {
  event.preventDefault();

  addShipment(shipment);

  console.log("Shipment details:", shipment);

  setMessage("Shipment submitted successfully!");

  setShipment({
    origin: "",
    destination: "",
    departureDate: "",
    cargoType: "",
    weight: "",
    volume: "",
  });
}


  return (
    <div className="shipment-page">
      <div className="shipment-container">
        <div className="shipment-heading">
          <span>SHIPMENT MANAGEMENT</span>
          <h1>Create a Shipment</h1>
          <p>
            Enter your cargo details to find suitable
            shared container space.
          </p>
        </div>

        <form className="shipment-form" onSubmit={handleSubmit}>
          <h2>Route Details</h2>

          <div className="shipment-grid">
            <div className="form-group">
              <label>Origin *</label>
              <input
                name="origin"
                value={shipment.origin}
                onChange={handleChange}
                placeholder="e.g. Mumbai, India"
                required
              />
            </div>

            <div className="form-group">
              <label>Destination *</label>
              <input
                name="destination"
                value={shipment.destination}
                onChange={handleChange}
                placeholder="e.g. Singapore"
                required
              />
            </div>

            <div className="form-group">
              <label>Departure Date *</label>
              <input
                type="date"
                name="departureDate"
                value={shipment.departureDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div className="form-divider"></div>

          <h2>Cargo Details</h2>

          <div className="shipment-grid">
            <div className="form-group">
              <label>Cargo Type *</label>
              <select
                name="cargoType"
                value={shipment.cargoType}
                onChange={handleChange}
                required
              >
                <option value="">Select cargo type</option>
                <option value="Electronics">Electronics</option>
                <option value="Textiles">Textiles</option>
                <option value="Food Products">Food Products</option>
                <option value="Machinery">Machinery</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Weight (kg) *</label>
              <input
                type="number"
                name="weight"
                value={shipment.weight}
                onChange={handleChange}
                placeholder="Enter weight"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Volume (CBM) *</label>
              <input
                type="number"
                name="volume"
                value={shipment.volume}
                onChange={handleChange}
                placeholder="Enter volume"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Additional Description</label>
            <textarea
              name="description"
              value={shipment.description}
              onChange={handleChange}
              placeholder="Describe your cargo requirements..."
              rows="4"
            />
          </div>

          <button type="submit" className="shipment-submit">
            Submit Shipment →
          </button>

          {message && (
            <p className="shipment-success">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ShipmentForm;
