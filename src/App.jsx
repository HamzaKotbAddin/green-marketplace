import { useState, useEffect } from "react";
import Header from "./ui/Header";
import Footer from "./ui/Footer";
import Container from "./ui/Container";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import LoginPage from "./pages/LoginPage .jsx";
import AddProductPage from "./pages/AddProductPage";
import ManageProductsPage from "./pages/ManageProductsPage";
import AIValidationPage from "./pages/AIValidationPage";
import Profile from "./pages/Profile.jsx";
import { auth } from "./firebase-config";
import {
  userDataService,
  anonymousService,
  cartService,
} from "./services/FirebaseService";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create a unique anonymous ID for non-logged in users
  useEffect(() => {
    const setupAnonymousUser = async () => {
      if (!user) {
        // Check if we already have an anonymous ID stored
        const anonymousId = sessionStorage.getItem("anonymousUserId");

        if (anonymousId) {
          // Use existing anonymous ID
          setUser({ uid: anonymousId, isAnonymous: true });
        } else {
          try {
            // Create a new anonymous user
            const result = await anonymousService.createAnonymousUser();
            if (result.success) {
              // Store the new ID in session storage
              sessionStorage.setItem("anonymousUserId", result.anonymousId);
              setUser({ uid: result.anonymousId, isAnonymous: true });
            }
          } catch (error) {
            console.error("Error creating anonymous user:", error);
          }
        }
      }
      setIsLoading(false);
    };

    setupAnonymousUser();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        const currentAnonymousId = sessionStorage.getItem("anonymousUserId");
        if (currentAnonymousId) {
          // Transfer anonymous data to authenticated user
          userDataService
            .transferAnonymousData(currentAnonymousId, authUser.uid)
            .then(() => {
              // Clear anonymous ID from session storage
              sessionStorage.removeItem("anonymousUserId");
              setUser(authUser);
            })
            .catch((error) => {
              console.error("Error transferring anonymous data:", error);
              setUser(authUser);
            });
        } else {
          setUser(authUser);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user data (cart and current page) from Firebase
  useEffect(() => {
    if (user && user.uid) {
      // Set up listener for real-time updates
      const unsubscribe = userDataService.onUserDataChange(
        user.uid,
        (userData) => {
          if (userData) {
            // Load cart
            if (userData.cart) {
              setCart(userData.cart);
            }

            // Load current page
            if (userData.currentPage) {
              setCurrentPage(userData.currentPage);
            }
          } else {
            // Initialize user data if it doesn't exist
            userDataService.getUserData(user.uid);
          }
        }
      );

      // Clean up the listener when the component unmounts or user changes
      return () => unsubscribe();
    }
  }, [user]);

  // Save data to Firebase when cart or page changes
  useEffect(() => {
    if (user && user.uid && !isLoading) {
      userDataService
        .updateUserData(user.uid, {
          cart,
          currentPage,
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
        });
    }
  }, [cart, currentPage, user, isLoading]);

  // Add to cart function
  const addToCart = (product) => {
    if (user && user.uid) {
      cartService
        .addToCart(user.uid, product)
        .then((result) => {
          if (result.success) {
            setCart(result.cart);
          }
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
        });
    } else {
      setCart((prevCart) => {
        // Check if product already exists in cart
        const existingItemIndex = prevCart.findIndex(
          (item) => item.id === product.id
        );

        if (existingItemIndex >= 0) {
          // If product exists, update quantity
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: (updatedCart[existingItemIndex].quantity || 1) + 1,
          };
          return updatedCart;
        } else {
          // If product doesn't exist, add it with quantity 1
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });
    }
  };

  // Remove from cart function
  const removeFromCart = (id) => {
    if (user && user.uid) {
      cartService
        .removeFromCart(user.uid, id)
        .then((result) => {
          if (result.success) {
            setCart(result.cart);
          }
        })
        .catch((error) => {
          console.error("Error removing from cart:", error);
        });
    } else {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    }
  };

  // Render page dynamically based on the current page
  const renderPage = () => {
    if (isLoading) {
      return <div className="loading-container">Loading...</div>;
    }

    switch (currentPage) {
      case "home":
        return <HomePage setCurrentPage={setCurrentPage} />;
      case "products":
        return (
          <ProductsPage setCurrentPage={setCurrentPage} addToCart={addToCart} />
        );
      case "cart":
        return (
          <CartPage
            cart={cart}
            setCurrentPage={setCurrentPage}
            removeFromCart={removeFromCart}
          />
        );
      case "payment":
        return <PaymentPage cart={cart} setCurrentPage={setCurrentPage} />;
      case "about":
        return <AboutPage setCurrentPage={setCurrentPage} />;
      case "contact":
        return <ContactPage setCurrentPage={setCurrentPage} />;
      case "login":
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case "add-product":
        return <AddProductPage setCurrentPage={setCurrentPage} user={user} />;
      case "manage-products":
        return (
          <ManageProductsPage setCurrentPage={setCurrentPage} user={user} />
        );
      case "ai-validation":
        return <AIValidationPage setCurrentPage={setCurrentPage} />;
      case "profile":
        return <Profile setCurrentPage={setCurrentPage} user={user} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex-container bg-gray-50">
      <main className="main-content">
        <Header setCurrentPage={setCurrentPage} user={user} setUser={setUser} />
        <Container>{renderPage()}</Container>
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;
