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
import { db } from "../firebase-config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Single snapshot listener: restore or seed, then clear loading
  useEffect(() => {
    const cartRef = { current: cart };
    const pageRef = { current: currentPage };

    if (user && user.uid) {
      const userDataRef = doc(db, "userData", user.uid);

      const unsubscribe = onSnapshot(
        userDataRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.cart) setCart(data.cart);
            if (data.currentPage) setCurrentPage(data.currentPage);
            setIsLoading(false);
          } else {
            setDoc(userDataRef, {
              cart: cartRef.current,
              currentPage: pageRef.current,
              isAnonymous: user.isAnonymous || false,
            })
              .catch(console.error)
              .finally(() => setIsLoading(false));
          }
        },
        (error) => {
          console.error("Snapshot error:", error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Persist cart & page on every change
  useEffect(() => {
    if (user && user.uid) {
      const userDataRef = doc(db, "userData", user.uid);
      updateDoc(userDataRef, {
        cart,
        currentPage,
        lastUpdated: new Date(),
      }).catch(console.error);
    }
  }, [cart, currentPage, user]);

  const handleLogin = async (userData) => {
    if (user && user.isAnonymous) {
      try {
        const anonRef = doc(db, "userData", user.uid);
        const anonSnap = await getDoc(anonRef);
        if (anonSnap.exists()) {
          const anonData = anonSnap.data();
          await setDoc(doc(db, "userData", userData.uid), {
            cart: anonData.cart || [],
            currentPage: anonData.currentPage || "home",
            lastUpdated: new Date(),
          });
          await deleteDoc(anonRef);
        }
        sessionStorage.removeItem("anonymousUserId");
      } catch (err) {
        console.error("Anonymous transfer error:", err);
      }
    }
    setUser(userData);
  };

  const addToCart = (product, qty) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += qty;
        return copy;
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const setItemQuantity = (productId, newQty) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === productId ? { ...i, quantity: newQty } : i))
        .filter((i) => i.quantity > 0)
    );
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
        return <ProductsPage setCurrentPage={setCurrentPage} addToCart={addToCart} />;
      case "cart":
        return (
          <CartPage
            cart={cart}
            setCurrentPage={setCurrentPage}
            updateQuantity={updateQuantity}
            setItemQuantity={setItemQuantity}
          />
        );
      case "payment":
        return <PaymentPage cart={cart} setCurrentPage={setCurrentPage} />;
      case "about":
        return <AboutPage setCurrentPage={setCurrentPage} />;
      case "contact":
        return <ContactPage setCurrentPage={setCurrentPage} />;
      case "login":
        return <LoginPage setCurrentPage={setCurrentPage} setUser={handleLogin} />;
      case "manage-products":
        return <ManageProductsPage setCurrentPage={setCurrentPage} />;
      case "add-product":
        return <AddProductPage setCurrentPage={setCurrentPage} />;
      case "profile":
        return <Profile user={user} setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <Header
          setCurrentPage={setCurrentPage}
          user={user}
          setUser={setUser}
          cart={cart}
          setCart={setCart}
        />
        <Container>{renderPage()}</Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
