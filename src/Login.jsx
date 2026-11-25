
import { useState } from "react";
import "./Login.css";
import ExporterDashboard from "./ExporterDashboard.jsx";
import ProviderDashboard from "./ProviderDashboard.jsx";

function Login() {
  const [role, setRole] = useState("Exporter");
  const [isSignup, setIsSignup] = useState(false);
const[isLoggedIn,setIsLoggedIn]=useState(false);
if (isLoggedIn) {
  if (role === "Exporter") {
    return <ExporterDashboard />;
  }

  if (role === "Provider") {
    return <ProviderDashboard />;
  }
}

  function handleSubmit(event) {
    event.preventDefault();
    setIsLoggedIn(true);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome to CargoShare AI</h1>
        <p>Share cargo space. Save shipping costs.</p>

        <h3>I am a...</h3>

        <div className="role-options">
          <button
            type="button"
            className={role === "Exporter" ? "selected" : ""}
            onClick={() => setRole("Exporter")}
          >
            Exporter
          </button>

          <button
            type="button"
            className={role === "Provider" ? "selected" : ""}
            onClick={() => setRole("Provider")}
          >
            Logistics Provider
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
              />
            </>
          )}

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
          />

          <button className="login-submit" type="submit">
            {isSignup ? "Create Account" : `Login as ${role}`}
          </button>
        </form>

        <p className="login-note">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          {" "}

          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            style={{
              border: "none",
              background: "none",
              color: "#087c76",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {isSignup ? "Log in" : "Sign Up"}
          </button>
        </p>

        <p className="login-note">
          Demo only. Firebase authentication will be added later.
        </p>
      </div>
    </div>
  );
}

export default Login;
