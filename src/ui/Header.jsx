import React, { useState, useEffect } from "react";
import { auth, signOut } from "../../firebase-config";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Header = ({ setCurrentPage, user, setUser, cart = [], setCart }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // compute total items in cart
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // animate badge when cart changes
  useEffect(() => {
    if (totalItems > 0) {
      setJustAdded(true);
      const timer = setTimeout(() => setJustAdded(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  // listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setIsLoggedIn(true);
        const db = getFirestore();
        const userRef = doc(db, "users", authUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setUserName(
            data.username ||
            authUser.displayName ||
            authUser.email.split("@")[0] ||
            "User"
          );
          setUserType(data.userType || "");
        } else {
          setUserName(
            authUser.displayName ||
            authUser.email.split("@")[0] ||
            "User"
          );
          setUserType("");
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUserType("");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCurrentPage("home");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-nowrap items-center justify-between">
        {/* Logo / Home */}
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => setCurrentPage("home")}
        >
          Green Marketplace
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage("home")}
            className="hover:text-green-200"
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage("products")}
            className="hover:text-green-200"
          >
            Products
          </button>
          <button
            onClick={() => setCurrentPage("about")}
            className="hover:text-green-200"
          >
            About
          </button>
          <button
            onClick={() => setCurrentPage("contact")}
            className="hover:text-green-200"
          >
            Contact
          </button>

          {userType === "seller" && (
            <>
              <button
                onClick={() => setCurrentPage("add-product")}
                className="hover:text-green-200"
              >
                Add Product
              </button>
              <button
                onClick={() => setCurrentPage("manage-products")}
                className="hover:text-green-200"
              >
                Manage
              </button>
            </>
          )}
        </nav>

        {/* User Info / Cart / Auth Buttons */}
        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-200 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentPage("login")}
              className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-200 transition"
            >
              Login
            </button>
          )}
          <button
            onClick={() => setCurrentPage("cart")}
            className="relative ml-2 text-white hover:text-green-200"
          >
            🛒
            {totalItems > 0 && (
              <span
                className={`absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm ${justAdded ? "animate-bounce" : ""
                  }`}
              >
                {totalItems}
              </span>
            )}
          </button>
          {isLoggedIn && (
            <button
              onClick={() => setCurrentPage("profile")}
              className="ml-4 flex items-center whitespace-nowrap font-medium hover:text-green-200 transition"
            >
              <span className="mr-2">Hi, {userName}</span>
              {/* use any small icon or SVG here */}
              <span role="img" aria-label="edit profile" className="text-lg">✏️</span>
            </button>
          )}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden ml-2"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-green-600 px-4 pb-4 space-y-2 text-sm">
          <button
            onClick={() => setCurrentPage("home")}
            className="block w-full text-left py-2 hover:bg-green-500 px-2 rounded"
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage("products")}
            className="block w-full text-left py-2 hover:bg-green-500 px-2 rounded"
          >
            Products
          </button>
          <button
            onClick={() => setCurrentPage("about")}
            className="block w-full text-left py-2 hover:bg-green-500 px-2 rounded"
          >
            About
          </button>
          <button
            onClick={() => setCurrentPage("contact")}
            className="block w-full text-left py-2 hover:bg-green-500 px-2 rounded"
          >
            Contact
          </button>
          {isLoggedIn && (
            <button
              onClick={() => setCurrentPage("profile")}
              className="block w-full text-left py-2 hover:bg-green-500 px-2 rounded"
            >
              Profile
            </button>
          )}
          {userType === "seller" && (
            <>
              <button
                onClick={() => setCurrentPage("add-product")}
                className="block w-full text-left py-2 hover:bg-green-500 px-2 rounded"
              >
                Add Product
              </button>
              <button
                onClick={() => setCurrentPage("manage-products")}
                className="block w-full text-left py-2 hover:bg-green-500 px-2 rounded"
              >
                Manage Products
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
