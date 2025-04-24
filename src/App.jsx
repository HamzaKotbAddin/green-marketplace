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
import AddProductPage from "./pages/AddProductPage";
import ManageProductsPage from "./pages/ManageProductsPage";
import LoginPage from "./pages/LoginPage.jsx";
import Profile from "./pages/Profile.jsx";
import { db } from "../firebase-config"; // Import Firestore
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore"; // Firebase Firestore imports

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");

  // Create a unique anonymous ID for non-logged in users
  useEffect(() => {
    const cartRef = { current: cart };
    const currentPageRef = { current: currentPage };

    if (user && user.uid) {
      const userDataRef = doc(db, "userData", user.uid);

      const unsubscribe = onSnapshot(
        userDataRef,
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();

            if (data.cart) {
              setCart(data.cart);
            }

            if (data.currentPage) {
              setCurrentPage(data.currentPage);
            }
          } else {
            console.log("Creating new user data document");
            setDoc(userDataRef, {
              cart: cartRef.current,
              currentPage: currentPageRef.current,
              isAnonymous: user.isAnonymous || false,
            }).catch((error) => {
              console.error("Error creating user data document:", error);
            });
          }
        },
        (error) => {
          console.error("Error in Firebase snapshot listener:", error);
        }
      );

      return () => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      };
    }
  }, [user]);

  useEffect(() => {
    if (user && user.uid) {
      const userDataRef = doc(db, "userData", user.uid);

      const unsubscribe = onSnapshot(
        userDataRef,
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();

            if (data.cart) setCart(data.cart);
            if (data.currentPage) setCurrentPage(data.currentPage);

            setIsLoading(false);
          } else {
            setDoc(userDataRef, {
              cart,
              currentPage,
              isAnonymous: user.isAnonymous || false,
            })
              .then(() => setIsLoading(false))
              .catch((error) => {
                console.error("Error creating user data document:", error);
                setIsLoading(false);
              });
          }
        },
        (error) => {
          console.error("Error in Firebase snapshot listener:", error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.uid && !isLoading) {
      const userDataRef = doc(db, "userData", user.uid);

      updateDoc(userDataRef, {
        cart: cart,
        currentPage: currentPage,
        lastUpdated: new Date(),
      }).catch((error) => {
        console.error("Error updating user data:", error);
      });
    }
  }, [cart, currentPage, user, isLoading]);

  const handleLogin = async (userData) => {
    if (user && user.isAnonymous) {
      try {
        const anonymousDataRef = doc(db, "userData", user.uid);
        const anonymousDataSnap = await getDoc(anonymousDataRef);

        if (anonymousDataSnap.exists()) {
          const anonymousData = anonymousDataSnap.data();

          await setDoc(doc(db, "userData", userData.uid), {
            cart: anonymousData.cart || [],
            currentPage: anonymousData.currentPage || "home",
            lastUpdated: new Date(),
          });

          await deleteDoc(anonymousDataRef);
        }

        sessionStorage.removeItem("anonymousUserId");
      } catch (error) {
        console.error("Error transferring anonymous data:", error);
      }
    }

    setUser(userData);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 1) + 1,
        };
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">Loading...</div>
      );
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
        return (
          <LoginPage setCurrentPage={setCurrentPage} setUser={handleLogin} />
        );
      case "manage-products":
        return <ManageProductsPage setCurrentPage={setCurrentPage} />;
      case "add-product":
        return <AddProductPage setCurrentPage={setCurrentPage} />;
      case "profile":
        return (
          <Profile
            user={user}
            setCurrentPage={setCurrentPage}
            setUserName={setUserName}
          />
        );
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <Header setCurrentPage={setCurrentPage} user={user} setUser={setUser} cart={cart} />
        <Container>{renderPage()}</Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
