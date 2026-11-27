
import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [role, setRole] = useState("Exporter");
  const [isSignup, setIsSignup] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  // Demo accounts remain available during this app session.
  const [registeredUsers, setRegisteredUsers] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");


    await auth.signOut();

    const normalizedEmail = email.trim().toLowerCase();


    if (!normalizedEmail || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    // SIGN UP
    if (isSignup) {
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }

      const existingUser = registeredUsers.find(
        (user) => user.email === normalizedEmail
      );

      if (existingUser) {
        setError("This email is already registered. Please log in.");
        return;
      }

      const newUser = {
        uid: `demo-${Date.now()}`,
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: password,
        role: role
      };

      setRegisteredUsers((previous) => [
        ...previous,
        newUser
      ]);

      const userData = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.fullName,
        role: newUser.role
      };

      onLogin(userData);
      return;
    }

    // LOGIN
    const existingUser = registeredUsers.find(
      (user) => user.email === normalizedEmail
    );

    if (!existingUser) {
      setError("Email not found. Please sign up first.");
      return;
    }

    if (existingUser.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    // IMPORTANT: Verify the account role.
    if (existingUser.role !== role) {
      setError(
        `This account is registered as ${existingUser.role}. Please select ${existingUser.role} to log in.`
      );
      return;
    }


  // Login and Signup
  async function handleSubmit(event) {


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

    const userData = {
      uid: existingUser.uid,
      email: existingUser.email,
      displayName: existingUser.fullName,
      role: existingUser.role
    };

    onLogin(userData);
  }

  // FORGOT PASSWORD
  if (isForgotPassword) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Forgot Password?</h1>

          <p>
            Enter your registered email address to reset your password.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();

              const normalizedEmail = email.trim().toLowerCase();

              const existingUser = registeredUsers.find(
                (user) => user.email === normalizedEmail
              );

              if (!existingUser) {
                setResetMessage(
                  "Email not found. Please check your email address."
                );
                return;
              }

              setResetMessage(
                "Password reset requests will be available once Firebase is connected."
              );
            }}
          >
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {resetMessage && (
              <p className="login-error" role="status">
                {resetMessage}
              </p>
            )}

            <button className="login-submit" type="submit">
              Reset Password
            </button>
          </form>


          <button
            type="button"
            onClick={() => {
              setIsForgotPassword(false);
              setResetMessage("");
              setError("");
            }}
            className="back-to-login-btn"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // LOGIN AND SIGNUP SCREEN
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

          {!isSignup && (
            <div className="forgot-password">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError("");
                  setResetMessage("");
                }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              title={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a15.5 15.5 0 0 1-4 4.7" />
                  <path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.6 7 10 7c1.4 0 2.7-.3 3.8-.8" />
                </svg>
              )}
            </button>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="login-submit"
            type="submit"
            style={{ background: "red", color: "white" }}
          >
            {isSignup ? "Create Account" : "Log In"}
          </button>
        </form>

        <p className="login-note">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}{" "}

          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setPassword("");
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

        <p style={{ fontSize: "12px", color: "#777" }}>
          Frontend Demo Mode — Firebase authentication disabled.
        </p>
      </div>
    </div>
  );
}

export default Login;
