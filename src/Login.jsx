import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

import { auth } from "./firebase.js";

import "./Login.css";

import ExporterDashboard from "./ExporterDashboard.jsx";
import ProviderDashboard from "./ProviderDashboard.jsx";


function Login() {

  const [role, setRole] = useState("Exporter");

  const [isSignup, setIsSignup] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // Logout function
  async function handleLogout() {

    try {

      await auth.signOut();

      setCurrentUser(null);

      setPassword("");
      setError("");

    } catch (error) {

      setError(error.message);

    }

  }


  // Show dashboard after login
  if (currentUser && role === "Exporter") {

    return (
      <ExporterDashboard
        onLogout={handleLogout}
        user={currentUser}
      />
    );

  }


  if (currentUser && role === "Provider") {

    return (
      <ProviderDashboard
        onLogout={handleLogout}
        user={currentUser}
      />
    );

  }


  // Login and Signup
  async function handleSubmit(event) {
const[isLoggedIn,setIsLoggedIn]=useState(false);
if (isLoggedIn) {
  if (role === "Exporter") {
    return (
  <ExporterDashboard
    onLogout={() => setIsLoggedIn(false)}
  />
);

  }

  if (role === "Provider") {
    return (
  <ProviderDashboard
    onLogout={() => setIsLoggedIn(false)}
  />
);

  }
if (role === "Provider") {
  return (
    <ProviderDashboard
      onLogout={() => setIsLoggedIn(false)}
    />
  );
}
  
}

    event.preventDefault();

    setError("");

    setLoading(true);

    try {

      let userCredential;

      if (isSignup) {

        userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        await updateProfile(userCredential.user, {
          displayName: fullName.trim()
        });

      } else {

        userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      }

      // Store authenticated Firebase user
      setCurrentUser(userCredential.user);

    } catch (error) {

      console.error("Authentication Error:", error);

      setError(error.message);

    } finally {

      setLoading(false);

    }

  }


  return (

    <div className="login-page">

      <div className="login-card">

        <h1>Welcome to CargoShare AI</h1>

        <p>Share cargo space. Save shipping costs.</p>


        <h3>I am a...</h3>


        {/* Role Selection */}

        <div className="role-options">

          <button
            type="button"
            className={role === "Exporter" ? "selected" : ""}
            onClick={() => {
              setRole("Exporter");
              setError("");
            }}
          >
            Exporter
          </button>


          <button
            type="button"
            className={role === "Provider" ? "selected" : ""}
            onClick={() => {
              setRole("Provider");
              setError("");
            }}
          >
            Logistics Provider
          </button>

        </div>


        {/* Login Form */}

        <form onSubmit={handleSubmit}>

          {isSignup && (

            <>
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

            </>

          )}


          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />


          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />


          {error && (

            <p className="login-error">
              {error}
            </p>

          )}


          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : `Login as ${role}`}

          </button>

        </form>


        {/* Signup Toggle */}

        <p className="login-note">

          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          {" "}

          <button
            type="button"
            onClick={() => {

              setIsSignup(!isSignup);

              setError("");

            }}
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

      </div>

    </div>

  );

}


export default Login;