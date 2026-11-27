
import React, { useEffect, useState } from "react";
import "./ProfilePage.css";

function ProfilePage({ user, onSave }) {
  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    companyName: user?.companyName || "",
    address: user?.address || "",
    profilePhoto: user?.profilePhoto || "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData({
      fullName: user?.displayName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      companyName: user?.companyName || "",
      address: user?.address || "",
      profilePhoto: user?.profilePhoto || "",
    });
    setSaved(false);
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setSaved(false);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((previous) => ({
        ...previous,
        profilePhoto: reader.result,
      }));
      setSaved(false);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      ...user,
      displayName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      companyName: formData.companyName.trim(),
      address: formData.address.trim(),
      profilePhoto: formData.profilePhoto,
    });

    setSaved(true);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.displayName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      companyName: user?.companyName || "",
      address: user?.address || "",
      profilePhoto: user?.profilePhoto || "",
    });
    setSaved(false);
  };

  const initials = formData.fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-banner">
          <div>
            <span className="profile-eyebrow">ACCOUNT SETTINGS</span>
            <h2>My Profile</h2>
            <p>Manage your personal and business information.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-photo-section">
            <div className="profile-avatar">
              {formData.profilePhoto ? (
                <img
                  src={formData.profilePhoto}
                  alt="Profile"
                />
              ) : (
                <span>{initials || "U"}</span>
              )}
            </div>

            <div className="profile-photo-info">
              <h3>{formData.fullName || "Your Name"}</h3>
              <p>{user?.role || "Account User"}</p>

              <label
                htmlFor="profile-photo-upload"
                className="profile-upload-btn"
              >
                Change Photo
              </label>

              <input
                id="profile-photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />

              <small>JPG, PNG or other image formats. Maximum 5 MB.</small>
            </div>
          </div>

          <div className="profile-form-section">
            <h3>Personal Information</h3>
            <p>Update your basic account details.</p>

            <div className="profile-form-grid">
              <div className="profile-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="profile-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="profile-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="profile-field">
                <label>Account Type</label>
                <input
                  type="text"
                  value={user?.role || ""}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            <h3>Business Information</h3>
            <p>Enter your company details.</p>

            <div className="profile-form-grid">
              <div className="profile-field full-width">
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="profile-field full-width">
                <label>Business / Residential Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="profile-form-actions">
            <button
              type="button"
              className="profile-cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="profile-save-btn"
            >
              Save Changes
            </button>
          </div>

          {saved && (
            <p className="profile-success" role="status">
              Profile changes saved successfully.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default ProfilePage;
