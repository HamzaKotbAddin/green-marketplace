import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  auth,
} from "../../firebase-config";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const LoginPage = ({ setCurrentPage, setUser }) => {
  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [userType, setUserType] = useState("user");

  // Registration-only fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const saveUserToFirestore = async (uid) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {
        fullName,
        username,
        email,
        userType,
        createdAt: new Date(),
      });
    } catch (err) {
      setError("Failed to save user data. Please try again.");
      console.error(err);
    }
  };

  const handleRegister = async () => {
    setError("");
    // Basic validation
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!username.trim()) {
      setError("Please choose a username.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await saveUserToFirestore(user.uid);
      setUser(user);
      setCurrentPage("home");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError(err.message);
      }
      console.error(err);
    }
  };

  const handleLoginWithEmailPassword = async () => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setCurrentPage("home");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setCurrentPage("home");
    } catch (err) {
      setError("Google sign-in failed.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px" }}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#137333",
          marginBottom: "24px",
        }}
      >
        {isRegistering ? "Register" : "Login"}
      </h1>

      {error && (
        <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
      )}

      <form autoComplete="on">
        {/* Full Name (register only) */}
        {isRegistering && (
          <div style={{ marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: "100%", padding: "12px", marginBottom: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: "12px", marginTop: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: "16px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "16px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        {/* Confirm Password (register only) */}
        {isRegistering && (
          <div style={{ marginBottom: "16px" }}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
        )}

        {/* User Type (register only) */}
        {isRegistering && (
          <div style={{ marginBottom: "16px" }}>
            <label style={{ marginRight: "16px" }}>
              <input
                type="radio"
                name="userType"
                value="user"
                checked={userType === "user"}
                onChange={() => setUserType("user")}
                style={{ marginRight: "8px" }}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                name="userType"
                value="seller"
                checked={userType === "seller"}
                onChange={() => setUserType("seller")}
                style={{ marginRight: "8px" }}
              />
              Seller
            </label>
          </div>
        )}

        <button
          type="button"
          onClick={isRegistering ? handleRegister : handleLoginWithEmailPassword}
          style={{
            backgroundColor: "#28a745", color: "white", border: "none",
            padding: "12px 24px", borderRadius: "4px", width: "100%",
            cursor: "pointer", marginBottom: "16px", transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
        >
          {isRegistering ? "Register" : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          {isRegistering ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                style={{ color: "#137333", textDecoration: "underline", border: "none", background: "none", cursor: "pointer" }}
              >
                Login
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                style={{ color: "#137333", textDecoration: "underline", border: "none", background: "none", cursor: "pointer" }}
              >
                Register
              </button>
            </span>
          )}
        </p>

        <div style={{ marginTop: "24px" }}>
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              width: "100%", padding: "12px", background: "white", border: "1px solid #ccc",
              borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#f7f7f7")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
          >
            <img
              src="/google-icon.png"
              alt="Google"
              style={{ height: "24px", marginRight: "12px" }}
            />
            {isRegistering ? "Register" : "Sign in"} with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
