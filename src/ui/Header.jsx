import React, { useState, useEffect } from "react";
import { auth, signOut } from "../firebase-config";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Header = ({ setCurrentPage, user, setUser }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState(""); // Added state for userType
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setIsLoggedIn(true);
        const name = authUser.email.split("@")[0];
        setUserName(name);

        // Fetch user data from Firestore to get userType
        const db = getFirestore();
        const userRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserType(userData.userType); // Set userType based on Firestore data
        } else {
          console.log("No such document!");
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUserType(""); // Clear userType if the user is logged out
      }
    });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCurrentPage("home"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="header-main">
      <div className="container header-container">
        <div className="header-wrapper">
          <div className="logo-container">
            <h1
              className="site-title"
              onClick={() => setCurrentPage("home")}
              style={{ cursor: "pointer" }}
            >
              Green Marketplace
            </h1>
          </div>
          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <button onClick={() => setCurrentPage("home")} className="nav-link">
              Home
            </button>
            <button
              onClick={() => setCurrentPage("products")}
              className="nav-link"
            >
              Products
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className="nav-link"
            >
              About
            </button>
            <button
              onClick={() => setCurrentPage("contact")}
              className="nav-link"
            >
              Contact
            </button>
            {isLoggedIn && (
              <button
                onClick={() => setCurrentPage("profile")}
                className="profile-link"
              >
                Profile
              </button>
            )}
            {userType === "seller" && (
              <>
                <button
                  onClick={() => setCurrentPage("add-product")}
                  className="nav-link"
                >
                  Add Product
                </button>
                <button
                  onClick={() => setCurrentPage("manage-products")}
                  className="nav-link"
                >
                  Manage Products
                </button>
              </>
            )}
          </nav>
          {/* Mobile Menu Button */}
          <div className="mobile-menu-button">
            <button className="menu-toggle" onClick={handleMobileMenuToggle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="menu-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          {/* Login/Logout Button */}
          <div className="auth-container">
            {isLoggedIn ? (
              <div className="user-info">
                <span className="username">{userName}</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage("login")}
                className="login-button"
              >
                Login
              </button>
            )}
            <button
              onClick={() => setCurrentPage("cart")}
              className="cart-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="cart-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="mobile-nav">
            <button
              onClick={() => setCurrentPage("home")}
              className="mobile-nav-link"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("products")}
              className="mobile-nav-link"
            >
              Products
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className="mobile-nav-link"
            >
              About
            </button>
            <button
              onClick={() => setCurrentPage("contact")}
              className="mobile-nav-link"
            >
              Contact
            </button>
            {userType === "seller" && (
              <>
                <button
                  onClick={() => setCurrentPage("add-product")}
                  className="mobile-nav-link"
                >
                  Add Product
                </button>
                <button
                  onClick={() => setCurrentPage("manage-products")}
                  className="mobile-nav-link"
                >
                  Manage Products
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
