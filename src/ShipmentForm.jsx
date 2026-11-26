
import { useState } from "react";
import "./ShipmentForm.css";

function ShipmentForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = "Submit Shipment"
}) {
  const [formData, setFormData] = useState({
    origin: initialData?.origin || "",
    destination: initialData?.destination || "",
    shippingDate: initialData?.shippingDate || "",
    cargoType: initialData?.cargoType || "",
    description:
      initialData?.description ||
      initialData?.cargoDescription || "",
    volume: initialData?.volume ?? "",
    weight: initialData?.weight ?? "",
    specialRequirements:
      initialData?.specialRequirements ||
      initialData?.specialHandling || ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(formData);
  }

  return (
    <div className="shipment-overlay">
      <div className="shipment-form">

        <h2>
          {initialData ? "Edit Shipment Details" : "Enter Your Shipment Details"}
        </h2>

        <p>Tell us what you need to ship.</p>

        <form onSubmit={handleSubmit}>

          <label>Origin</label>
          <input
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="e.g. Mumbai"
            required
          />

          <label>Destination</label>
          <input
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Singapore"
            required
          />

          <label>Preferred Shipping Date</label>
          <input
            type="date"
            name="shippingDate"
            value={formData.shippingDate}
            onChange={handleChange}
            required
          />

          <label>Cargo Type</label>
          <select
            name="cargoType"
            value={formData.cargoType}
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
            value={formData.description}
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
            value={formData.volume}
            onChange={handleChange}
            required
          />

          <label>Weight (KG)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />

          <label>Special Handling Requirements</label>
          <textarea
            name="specialRequirements"
            value={formData.specialRequirements}
            onChange={handleChange}
            placeholder="e.g. Fragile or refrigerated"
          />

          <div className="shipment-buttons">
            <button type="submit">{submitLabel}</button>

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
