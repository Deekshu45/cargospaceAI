
import { useState } from "react";
import { useShipments } from "./ShipmentContext";
import "./ShipmentForm.css";

function ShipmentForm({ onCancel }) {
  const { addShipment } = useShipments();

  const [shipment, setShipment] = useState({
    origin: "",
    destination: "",
    shippingDate: "",
    cargoType: "",
    description: "",
    volume: "",
    weight: "",
    specialRequirements: ""
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setShipment((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    addShipment({
  ...shipment,
  status: "Submitted"
});

onCancel();

    setMessage("Shipment submitted successfully!");

    setShipment({
      origin: "",
      destination: "",
      shippingDate: "",
      cargoType: "",
      description: "",
      volume: "",
      weight: "",
      specialRequirements: ""
    });
  }

  return (
    <div className="shipment-overlay">
      <div className="shipment-form">

        <h2>Enter Your Shipment Details</h2>
        <p>Tell us what you need to ship.</p>

        <form onSubmit={handleSubmit}>

          <label>Origin</label>
          <input
            name="origin"
            value={shipment.origin}
            onChange={handleChange}
            placeholder="e.g. Mumbai"
            required
          />

          <label>Destination</label>
          <input
            name="destination"
            value={shipment.destination}
            onChange={handleChange}
            placeholder="e.g. Singapore"
            required
          />

          <label>Preferred Shipping Date</label>
          <input
            type="date"
            name="shippingDate"
            value={shipment.shippingDate}
            onChange={handleChange}
            required
          />

          <label>Cargo Type</label>
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
            <option value="Other">Other</option>
          </select>

          <label>Cargo Description</label>
          <textarea
            name="description"
            value={shipment.description}
            onChange={handleChange}
            placeholder="Describe your cargo..."
            required
          />

          <label>Volume (CBM)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            name="volume"
            value={shipment.volume}
            onChange={handleChange}
            placeholder="e.g. 5"
            required
          />

          <label>Weight (KG)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            name="weight"
            value={shipment.weight}
            onChange={handleChange}
            placeholder="e.g. 500"
            required
          />

          <label>Special Handling Requirements</label>
          <textarea
            name="specialRequirements"
            value={shipment.specialRequirements}
            onChange={handleChange}
            placeholder="e.g. Fragile, refrigerated, or none"
          />

          {message && <p>{message}</p>}

          <div className="shipment-buttons">
            <button type="submit">
              Submit Shipment
            </button>

            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ShipmentForm;
