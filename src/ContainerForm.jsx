
import { useState } from "react";
import "./ContainerForm.css";

function ContainerForm({
  onClose,
  onPublish,
  initialData = null,
  submitLabel = "Publish Listing"
}) {
  const [formData, setFormData] = useState({
    origin: initialData?.origin || "",
    destination: initialData?.destination || "",
    departureDate: initialData?.departureDate || "",
    totalCapacity: initialData?.totalCapacity ?? "",
    availableVolume: initialData?.availableVolume ?? "",
    availableWeight: initialData?.availableWeight ?? "",
    price: initialData?.price ?? "",
    restrictions: initialData?.restrictions || ""
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onPublish(formData);
  }

  return (
    <div className="container-form-overlay">
      <form className="container-form" onSubmit={handleSubmit}>
        <h2>
          {initialData ? "Edit Container Listing" : "Publish Container Space"}
        </h2>

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

        <label>Departure Date</label>
        <input
          type="date"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
          required
        />

        <label>Total Container Capacity (CBM)</label>
        <input
          type="number"
          name="totalCapacity"
          value={formData.totalCapacity}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
        />

        <label>Available Volume (CBM)</label>
        <input
          type="number"
          name="availableVolume"
          value={formData.availableVolume}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
        />

        <label>Available Weight (KG)</label>
        <input
          type="number"
          name="availableWeight"
          value={formData.availableWeight}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
        />

        <label>Estimated Price (₹)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="1"
          required
        />

        <label>Cargo Restrictions</label>
        <textarea
          name="restrictions"
          value={formData.restrictions}
          onChange={handleChange}
          placeholder="e.g. No hazardous materials"
        />

        <div className="container-form-buttons">
          <button type="submit">{submitLabel}</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContainerForm;
