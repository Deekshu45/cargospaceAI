import { testFirestoreConnection } from "./testFirebase.js";
import React, { useState } from "react";
import "./App.css";
import Login from "./Login.jsx";
import ShipmentForm from "./ShipmentForm.jsx";
import Marketplace from "./Marketplace.jsx";

function App() {
  <button onClick={testFirestoreConnection}>
    Test Firebase Connection
  </button>
  const [showLogin, setShowLogin] = useState(false);
  const [showShipment, setShowShipment] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);


  if (showShipment) {
    return (
      <ShipmentForm
        onSubmit={() => setShowShipment(false)}
        onCancel={() => setShowShipment(false)}
      />
    );
  }



  // Open Marketplace

  if (showMarketplace) {
    return <Marketplace />;
  }

  // Open Shipment Form
  if (showShipment) {
    return (
      <ShipmentForm
        onCancel={() => setShowShipment(false)}
      />
    );
  }

  // Open Login
  if (showLogin) {
    return <Login />;
  }

  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">CargoShare AI</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#how-it-works">How it works</a>
          <a href="#marketplace">Find Cargo Space</a>
        </div>

        <div className="nav-actions">
          <button
            className="login-btn"
            onClick={() => setShowLogin(true)}
          >
            Log in
          </button>

          <button
            className="signup-btn"
            onClick={() => setShowLogin(true)}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">

          <div className="hero-text">
            <h1>Don't ship empty space. Share it.</h1>

            <p>
              Connect with logistics providers, find available cargo
              space, and make shipping more affordable with CargoShare AI.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-btn"
                onClick={() => setShowMarketplace(true)}
              >
                Find Cargo Space
              </button>

              <button
                className="secondary-btn"
                onClick={() => setShowShipment(true)}
              >
                Create Shipment
              </button>

              <button
                className="secondary-btn"
                onClick={() => setShowLogin(true)}
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

      {/* Statistics */}
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

      {/* Features */}
      <section className="features" id="how-it-works">
        <h2>How CargoShare AI Works</h2>
        <p>Making cargo sharing simpler and smarter.</p>

        <div className="feature-container">

          <div className="feature-card">
            <h3>Find Cargo Space</h3>
            <p>
              Discover available space in shipping containers that match
              your route and cargo requirements.
            </p>
          </div>

          <div className="feature-card">
            <h3>AI Smart Matching</h3>
            <p>
              Get help finding suitable cargo space based on your shipment
              details.
            </p>
          </div>

          <div className="feature-card">
            <h3>Reduce Waste</h3>
            <p>
              Make better use of available container capacity and avoid
              shipping empty space.
            </p>
          </div>

        </div>
      </section>

      {/* Marketplace Preview */}
      <section className="marketplace" id="marketplace">
        <h2>Explore Available Cargo Space</h2>
        <p>Example listing for demonstration purposes only.</p>

        <div className="listing-card">
          <h3>Mumbai → Singapore</h3>
          <p>Available volume: 12 CBM</p>
          <p>Estimated price: ₹15,000</p>

          <p className="demo-note">
            Demo data — not live shipping inventory.
          </p>

          <button
            className="primary-btn"
            onClick={() => setShowMarketplace(true)}
          >
            Request Cargo Space
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h2>CargoShare AI</h2>
        <p>Don't ship empty space. Share it.</p>
        <p>© 2026 CargoShare AI. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default App;
