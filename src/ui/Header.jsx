import React, { useState, useEffect } from "react";
import { auth, signOut } from "../../firebase-config";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Header = ({ setCurrentPage, user, setUser }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setIsLoggedIn(true);

        const db = getFirestore();
        const userRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          // Set username from Firestore data
          setUserName(userData.username || authUser.displayName || "User");
          setUserType(userData.userType);
        } else {
          // Fallback to displayName or email if no username in Firestore
          setUserName(
            authUser.displayName || authUser.email.split("@")[0] || "User"
          );
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUserType("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCurrentPage("home");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => setCurrentPage("home")}
        >
          Green Marketplace
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-4 items-center">
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
          {isLoggedIn && (
            <button
              onClick={() => setCurrentPage("profile")}
              className="hover:text-green-200"
            >
              Profile
            </button>
          )}
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

        {/* User Info / Auth Buttons */}
        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center"></div>
              <button
                onClick={handleLogout}
                className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-200 transition duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentPage("login")}
              className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-200 transition duration-200"
            >
              Login
            </button>
          )}
          <button
            onClick={() => setCurrentPage("cart")}
            className="ml-2 text-white bg-white hover:text-green-200 "
          >
            🛒
          </button>
          <button onClick={handleMobileMenuToggle} className="md:hidden ml-2">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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
