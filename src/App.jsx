import ProfilePage from "./ProfilePage.jsx";
import React, { useState } from "react";
import "./App.css";

import Login from "./Login.jsx";
import ShipmentForm from "./ShipmentForm.jsx";
import Marketplace from "./Marketplace.jsx";
import AICargoAssistant from "./AICargoAssistant.jsx";
function App() {
  <button onClick={testFirestoreConnection}>
    Test Firebase Connection
  </button>
  const [showLogin, setShowLogin] = useState(false);
  const [showShipment, setShowShipment] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
const [showAI, setShowAI] = useState(false);

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

import ExporterDashboard from "./ExporterDashboard.jsx";
import ProviderDashboard from "./ProviderDashboard.jsx";
import PaymentPage from "./PaymentPage.jsx";
import { useBookings } from "./BookingContext.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [pageHistory, setPageHistory] = useState(["home"]);
  const [activeSetting, setActiveSetting] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const { bookings, updatePaymentStatus } = useBookings();

  const canAccessPage = (page) => {
    if (!loggedInUser) {
      return ![
        "dashboard",
        "settings",
        "profile",
        "payments",
        "shipment",
      ].includes(page);
    }

    if (loggedInUser.role === "Provider") {
      return !["marketplace", "shipment", "payments"].includes(page);
    }

    return true;
  };

  const navigate = (page) => {
    if (page === currentPage) return;

    if (!canAccessPage(page)) {
      const fallback = loggedInUser ? "dashboard" : "login";
      setCurrentPage(fallback);
      setPageHistory(["home", fallback]);
      return;
    }

    if (page === "settings") {
      setActiveSetting(null);
    }

    setPageHistory((previous) => [...previous, page]);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (pageHistory.length <= 1) return;

    const updatedHistory = pageHistory.slice(0, -1);
    const previousPage = updatedHistory[updatedHistory.length - 1];

    if (!canAccessPage(previousPage)) return;

    setPageHistory(updatedHistory);
    setCurrentPage(previousPage);
  };

  const handleLogin = (userData) => {
    if (
      !userData ||
      !["Exporter", "Provider"].includes(userData.role)
    ) {
      return;
    }

    setLoggedInUser(userData);
    setActiveSetting(null);
    setCurrentPage("dashboard");
    setPageHistory(["home", "dashboard"]);
  };
  const handleProfileSave = (updatedUser) => {
  setLoggedInUser(updatedUser);
};

  const handleLogout = () => {
    setLoggedInUser(null);
    setActiveSetting(null);
    setCurrentPage("login");
    setPageHistory(["login"]);
  };

  const pageTitles = {
    home: "Home",
    "how-it-works": "How It Works",
    marketplace: "Find Cargo Space",
    shipment: "Create Shipment",
    dashboard:
      loggedInUser?.role === "Exporter"
        ? "Exporter Dashboard"
        : "Logistics Provider Dashboard",
    payments: "My Payments",
    settings: "Settings",
    profile: "My Profile",
  };

  const pageTitle = pageTitles[currentPage] || "CargoShare AI";

  const publicNavigation = (
    <div className="site-navigation">
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


          <div className="logo" onClick={() => navigate("home")}>
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
<button
  className="secondary-btn"
  onClick={() => setShowAI(true)}
>
  🤖 AI Cargo Assistant
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

      <div className="navigation-bottom">
        <button
          className={
            currentPage === "home"
              ? "page-nav-btn active-nav"
              : "page-nav-btn"
          }
          onClick={() => navigate("home")}
        >
          Home
        </button>

        <button
          className={
            currentPage === "how-it-works"
              ? "page-nav-btn active-nav"
              : "page-nav-btn"
          }
          onClick={() => navigate("how-it-works")}
        >
          How It Works
        </button>

        <button
          className={
            currentPage === "marketplace"
              ? "page-nav-btn active-nav"
              : "page-nav-btn"
          }
          onClick={() => navigate("marketplace")}
        >
          Find Cargo Space
        </button>
      </div>
    </div>
  );


 
const loggedInNavigation = (
  <div className="site-navigation">
    {/* First line: Brand and Logout */}
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

        <div className="logo" onClick={() => navigate("home")}>
          CargoShare AI
        </div>
      </div>

      <div className="nav-actions">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>

    {/* Second line: Navigation links */}
    <div className="navigation-bottom">
      <button
        className={
          currentPage === "home"
            ? "page-nav-btn active-nav"
            : "page-nav-btn"
        }
        onClick={() => navigate("home")}
      >
        Home
      </button>

      <button
        className={
          currentPage === "how-it-works"
            ? "page-nav-btn active-nav"
            : "page-nav-btn"
        }
        onClick={() => navigate("how-it-works")}
      >
        How It Works
      </button>

      <button
        className={
          currentPage === "dashboard"
            ? "page-nav-btn active-nav"
            : "page-nav-btn"
        }
        onClick={() => navigate("dashboard")}
      >
        My Dashboard
      </button>

      <button
        className={
          currentPage === "settings"
            ? "page-nav-btn active-nav"
            : "page-nav-btn"
        }
        onClick={() => navigate("settings")}
      >
        Settings
      </button>

      <button
        className={
          currentPage === "profile"
            ? "page-nav-btn active-nav"
            : "page-nav-btn"
        }
        onClick={() => navigate("profile")}
      >
        My Profile
      </button>

      {loggedInUser?.role === "Exporter" && (
        <button
          className={
            currentPage === "payments"
              ? "page-nav-btn active-nav"
              : "page-nav-btn"
          }
          onClick={() => navigate("payments")}
        >
          My Payments
        </button>
      )}

      {loggedInUser?.role === "Exporter" &&
        currentPage === "marketplace" && (
          <button
            className="page-nav-btn active-nav"
            onClick={() => navigate("marketplace")}
          >
            Find Cargo Space
          </button>
        )}
    </div>
      {/* Footer */}
      <footer className="footer">
        <h2>CargoShare AI</h2>
        <p>Don't ship empty space. Share it.</p>
        <p>© 2026 CargoShare AI. All rights reserved.</p>
      </footer>
{showAI && (
  <AICargoAssistant
    onClose={() => setShowAI(false)}
  />
)}

    {/* Third line: Current page heading and dashboard button */}
    <div className="logged-in-page-heading">
      <div className="logged-in-dashboard-title">
        {pageTitle}
      </div>

      {currentPage !== "dashboard" && (
        <button
          type="button"
          className="page-nav-btn"
          onClick={() => navigate("dashboard")}
        >
          ← Back to Dashboard
        </button>
      )}
    </div>
  </div>
);


  const navigation = loggedInUser
    ? loggedInNavigation
    : publicNavigation;

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
      <div
        style={{
          display: currentPage === "login" ? "block" : "none",
        }}
      >
        <Login onLogin={handleLogin} />
      </div>

      {currentPage !== "login" && (
        <>
          {navigation}

          {currentPage === "home" && (
            <>
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
                      {loggedInUser?.role === "Provider" ? (
                        <button
                          className="primary-btn"
                          onClick={() => navigate("dashboard")}
                        >
                          Open Provider Dashboard
                        </button>
                      ) : (
                        <>
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

                          {!loggedInUser && (
                            <button
                              className="secondary-btn"
                              onClick={() => navigate("login")}
                            >
                              Become a Provider
                            </button>
                          )}
                        </>
                      )}
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
            </>
          )}

          {currentPage === "how-it-works" && (
            <>
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
            </>
          )}

          {currentPage === "marketplace" &&
            (!loggedInUser || loggedInUser.role === "Exporter") && (
              <Marketplace
                onNavigate={navigate}
                navigation={<></>}
              />
            )}

          {currentPage === "shipment" &&
            loggedInUser?.role === "Exporter" && (
              <ShipmentForm
                onSubmit={() => navigate("dashboard")}
                onCancel={() => navigate("dashboard")}
              />
            )}

          {loggedInUser?.role === "Exporter" && (
            <div
              style={{
                display: currentPage === "dashboard" ? "block" : "none",
              }}
            >
              <ExporterDashboard
                onLogout={handleLogout}
                onNavigate={navigate}
              />
            </div>
          )}

          {loggedInUser?.role === "Provider" && (
            <div
              style={{
                display: currentPage === "dashboard" ? "block" : "none",
              }}
            >
              <ProviderDashboard
                onLogout={handleLogout}
                user={loggedInUser}
              />
            </div>
          )}

          {currentPage === "payments" &&
            loggedInUser?.role === "Exporter" && (
              <PaymentPage
                bookings={bookings}
                updatePaymentStatus={updatePaymentStatus}
                onBack={() => navigate("dashboard")}
              />
            )}

          {currentPage === "settings" && loggedInUser && (
            <section className="settings-section">
              <h2>Settings</h2>
              <p>Manage your account and preferences.</p>

              {!activeSetting ? (
                <div className="settings-grid">
                  {settingsCards.map((card) => (
                    <div
                      className="settings-card"
                      key={card.id}
                      onClick={() => {
                        if (card.id === "logout") {
                          handleLogout();
                        } else if (card.id === "profile") {
                          navigate("profile");
                        } else {
                          setActiveSetting(card.id);
                        }
                      }}
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
                    {
                      settingsCards.find(
                        (card) => card.id === activeSetting
                      )?.title
                    }
                  </h3>

                  {activeSetting !== "profile" && (
                    <p>
                      This section will be connected to your account data.
                    </p>
                  )}

                  <button onClick={() => setActiveSetting(null)}>
                    Back to Settings
                  </button>
                </div>
              )}
            </section>
          )}

          {currentPage === "profile" && loggedInUser && (
  <ProfilePage
    user={loggedInUser}
    onSave={handleProfileSave}
  />
)}
        </>
      )}

    </div>
  );
}

export default App;
