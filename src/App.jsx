
import React, { useState } from "react";
import "./App.css";
import Login from "./Login.jsx";
import ShipmentForm from "./ShipmentForm.jsx";
import Marketplace from "./Marketplace.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [pageHistory, setPageHistory] = useState(["home"]);
  const [activeSetting, setActiveSetting] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
 const navigate = (page) => {
  if (page === currentPage) return;

  setPageHistory((previous) => [...previous, page]);
  setCurrentPage(page);
};

const goBack = () => {
  if (pageHistory.length <= 1) return;

  const updatedHistory = pageHistory.slice(0, -1);

  setPageHistory(updatedHistory);
  setCurrentPage(updatedHistory[updatedHistory.length - 1]);
};

 
const navigation = (
  <div className="site-navigation">

    {/* First row */}
    <div className="navigation-top">

      <div className="brand-section">
        <button
          className="top-back-button"
          onClick={goBack}
          disabled={pageHistory.length <= 1}
          aria-label="Go back"
        >
          ←
        </button>

        <div
          className="logo"
          onClick={() => navigate("home")}
        >
          CargoShare AI
        </div>
      </div>

      <div className="nav-actions">
        <button
          className="login-btn"
          onClick={() => navigate("login")}
        >
          Log in
        </button>

        <button
          className="signup-btn"
          onClick={() => navigate("login")}
        >
          Get Started
        </button>
      </div>

    </div>

    {/* Second row */}
    <div className="navigation-bottom">

      <button
        className={currentPage === "home" ? "page-nav-btn active-nav" : "page-nav-btn"}
        onClick={() => navigate("home")}
      >
        Home
      </button>

      <button
        className={currentPage === "how-it-works" ? "page-nav-btn active-nav" : "page-nav-btn"}
        onClick={() => navigate("how-it-works")}
      >
        How It Works
      </button>

      <button
        className={currentPage === "marketplace" ? "page-nav-btn active-nav" : "page-nav-btn"}
        onClick={() => navigate("marketplace")}
      >
        Find Cargo Space
      </button>

      <button
        className={currentPage === "settings" ? "page-nav-btn active-nav" : "page-nav-btn"}
        onClick={() => navigate("settings")}
      >
        Settings
      </button>

    </div>
  </div>
);


const backButton = (
  <button className="back-button" onClick={goBack}>
    ← Back
  </button>
);

if (currentPage === "login") {
  return (
    <Login
      onLogin={(userData) => {
        setLoggedInUser(userData);
      }}
    />
  );
}

  if (currentPage === "shipment") {
    return (
      <ShipmentForm
        onSubmit={() => navigate("home")}
        onCancel={() => navigate("home")}
      />
    );
  }

  if (currentPage === "marketplace") {
    return (
      <Marketplace
  onNavigate={navigate}
  navigation={navigation}
/>
    );
  }
  
if (currentPage === "settings") {
  const settingsCards = [
    {
      id: "profile",
      title: "My Profile",
      description: "Manage your personal details and account information.",
      icon: "👤",
    },
    {
      id: "bookings",
      title: "Booking History",
      description: "View your cargo booking history and status.",
      icon: "📦",
    },
    {
      id: "transactions",
      title: "Transactions",
      description: "View your payments and transaction records.",
      icon: "💳",
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage booking and shipment notifications.",
      icon: "🔔",
    },
    {
      id: "security",
      title: "Password & Security",
      description: "Manage your password and account security.",
      icon: "🔒",
    },
    {
      id: "appearance",
      title: "Appearance",
      description: "Choose your preferred website theme.",
      icon: "🎨",
    },
    {
      id: "support",
      title: "Help & Support",
      description: "Get help with CargoShare AI.",
      icon: "🎧",
    },
    {
      id: "logout",
      title: "Logout",
      description: "Sign out of your account.",
      icon: "🚪",
    },
  ];

  return (
    <div className="app">
      {navigation}

      <section className="settings-section">
        <h2>Settings</h2>
        <p>Manage your account and preferences.</p>

        {!activeSetting ? (
          <div className="settings-grid">
            {settingsCards.map((card) => (
              <div
                className="settings-card"
                key={card.id}
                onClick={() => setActiveSetting(card.id)}
              >
                <span className="settings-icon">{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <span className="settings-arrow">→</span>
              </div>
            ))}
          </div>
        ) : (
          
<div className="settings-detail">
  <h3>
    {settingsCards.find(
      (card) => card.id === activeSetting
    )?.title}
  </h3>

  {activeSetting === "profile" && (
    <div className="profile-details">
      {loggedInUser ? (
        <>
          <div className="profile-item">
            <strong>Full Name</strong>
            <p>{loggedInUser.displayName}</p>
          </div>

          <div className="profile-item">
            <strong>Email Address</strong>
            <p>{loggedInUser.email}</p>
          </div>

          <div className="profile-item">
            <strong>Account Role</strong>
            <p>{loggedInUser.role}</p>
          </div>
        </>
      ) : (
        <p>Please log in to view your profile details.</p>
      )}
    </div>
  )}

  {activeSetting !== "profile" && (
    <p>
      We will build this section next.
    </p>
  )}

  <button onClick={() => setActiveSetting(null)}>
    Back to Settings
  </button>
</div>

        )}
      </section>
    </div>
  );
}


  if (currentPage === "how-it-works") {
    return (
      <div className="app">
        {navigation}
        

        <section className="features">
          <h2>How CargoShare AI Works</h2>
          <p>Making cargo sharing simpler and smarter.</p>

          <div className="feature-container">
            <div className="feature-card">
              <h3>1. Find Cargo Space</h3>
              <p>
                Discover available space in shipping containers
                that match your route and cargo requirements.
              </p>
            </div>

            <div className="feature-card">
              <h3>2. AI Smart Matching</h3>
              <p>
                Get help finding suitable cargo space based
                on your shipment details.
              </p>
            </div>

            <div className="feature-card">
              <h3>3. Reduce Waste</h3>
              <p>
                Make better use of available container capacity
                and avoid shipping empty space.
              </p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <h2>CargoShare AI</h2>
          <p>Don't ship empty space. Share it.</p>
          <p>© 2026 CargoShare AI. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="app">
      {navigation}

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Don't ship empty space. Share it.</h1>

            <p>
              Connect with logistics providers, find available
              cargo space, and make shipping more affordable
              with CargoShare AI.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate("marketplace")}
              >
                Find Cargo Space
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("shipment")}
              >
                Create Shipment
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("login")}
              >
                Become a Provider
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="ship-card">
              <h3>Popular Shipping Route</h3>
              <div className="route">
                <span>Mumbai</span>
                <span>→</span>
                <span>Singapore</span>
              </div>
              <p>Available cargo space</p>
              <h2>12 CBM</h2>
              <p>Sample demonstration listing</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div>
          <h2>Smarter</h2>
          <p>Shipping decisions</p>
        </div>
        <div>
          <h2>Shared</h2>
          <p>Cargo capacity</p>
        </div>
        <div>
          <h2>Lower</h2>
          <p>Shipping waste</p>
        </div>
      </section>

      <footer className="footer">
        <h2>CargoShare AI</h2>
        <p>Don't ship empty space. Share it.</p>
        <p>© 2026 CargoShare AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
