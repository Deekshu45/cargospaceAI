
import { useState, useEffect } from "react";
import "./ShipmentForm.css";

function ShipmentForm({
  onSubmit,
  onCancel,
  initialData = null,
  submitLabel = "Submit Shipment",
}) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    shippingDate: "",
    cargoType: "",
    description: "",
    volume: "",
    weight: "",
    specialRequirements: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        origin: initialData.origin || "",
        destination: initialData.destination || "",
        shippingDate: initialData.shippingDate || "",
        cargoType: initialData.cargoType || "",
        description:
          initialData.description ||
          initialData.cargoDescription ||
          "",
        volume: initialData.volume ?? "",
        weight: initialData.weight ?? "",
        specialRequirements:
          initialData.specialRequirements ||
          initialData.specialHandling ||
          "",
      });
    }
  }, [initialData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.origin.trim() ||
      !formData.destination.trim() ||
      !formData.shippingDate ||
      !formData.cargoType ||
      !formData.volume ||
      !formData.weight
    ) {
      setMessage("Please complete all required fields.");
      return;
    }

    if (
      Number(formData.volume) <= 0 ||
      Number(formData.weight) <= 0
    ) {
      setMessage("Volume and weight must be greater than zero.");
      return;
    }

    onSubmit({
      ...formData,
      volume: Number(formData.volume),
      weight: Number(formData.weight),
    });
  }

  return (
    <div className="shipment-overlay">
      <div className="shipment-form">

        <h2>
          {initialData
            ? "Edit Shipment Details"
            : "Enter Your Shipment Details"}
        </h2>

        <p>Tell us what you need to ship.</p>

        {message && (
          <p className="error-message">{message}</p>
        )}

        <form onSubmit={handleSubmit}>

          <label>Origin *</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="e.g. Mumbai"
            required
          />

          <label>Destination *</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Singapore"
            required
          />

          <label>Preferred Shipping Date *</label>
          <input
            type="date"
            name="shippingDate"
            value={formData.shippingDate}
            onChange={handleChange}
            required
          />

          <label>Cargo Type *</label>
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
            rows={3}
          />

          <label>Volume (CBM) *</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            name="volume"
            value={formData.volume}
            onChange={handleChange}
            placeholder="e.g. 5"
            required
          />

          <label>Weight (KG) *</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="e.g. 500"
            required
          />

          <label>Special Handling Requirements</label>
          <textarea
            name="specialRequirements"
            value={formData.specialRequirements}
            onChange={handleChange}
            placeholder="e.g. Fragile, refrigerated, or none"
            rows={3}
          />

          <div className="shipment-buttons">

            <button type="submit">
              {submitLabel}
            </button>

            <button
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default ShipmentForm;
