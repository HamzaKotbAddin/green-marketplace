import { useState, useEffect } from 'react';
import Header from './ui/Header';
import Footer from './ui/Footer';
import Container from './ui/Container';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import LoginPage from './pages/LoginPage.jsx'; // Fixed filename (removed space)
import AddProductPage from './pages/AddProductPage';
import ManageProductsPage from './pages/ManageProductsPage';
import AIValidationPage from './pages/AIValidationPage';
import { auth } from './firebase-config';
import { userDataService, anonymousService, cartService } from './services/FirebaseService';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create a unique anonymous ID for non-logged in users
  useEffect(() => {
    const setupAnonymousUser = async () => {
      if (!user) {
        const anonymousId = sessionStorage.getItem('anonymousUserId');

        if (anonymousId) {
          setUser({ uid: anonymousId, isAnonymous: true });
        } else {
          try {
            const result = await anonymousService.createAnonymousUser();
            if (result.success) {
              sessionStorage.setItem('anonymousUserId', result.anonymousId);
              setUser({ uid: result.anonymousId, isAnonymous: true });
            }
          } catch (error) {
            console.error('Error creating anonymous user:', error);
          }
        }
      }
      setIsLoading(false);
    };

    setupAnonymousUser();
  }, [user]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        const currentAnonymousId = sessionStorage.getItem('anonymousUserId');
        if (currentAnonymousId) {
          userDataService.transferAnonymousData(currentAnonymousId, authUser.uid)
            .then(() => {
              sessionStorage.removeItem('anonymousUserId');
              setUser(authUser);
            })
            .catch(error => {
              console.error('Error transferring anonymous data:', error);
              setUser(authUser);
            });
        } else {
          setUser(authUser);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user data from Firebase
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = userDataService.onUserDataChange(user.uid, (userData) => {
        if (userData) {
          setCart(userData.cart || []);
          setCurrentPage(userData.currentPage || 'home');
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Save data to Firebase when cart/page changes
  useEffect(() => {
    if (user?.uid && !isLoading) {
      userDataService.updateUserData(user.uid, {
        cart,
        currentPage
      }).catch(error => {
        console.error('Error updating user data:', error);
      });
    }
  }, [cart, currentPage, user, isLoading]);

  // Add to cart handler
  const addToCart = (product) => {
    if (user?.uid) {
      cartService.addToCart(user.uid, product)
        .then(result => {
          if (result.success) setCart(result.cart);
        })
        .catch(error => console.error('Error adding to cart:', error));
    } else {
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        return existing
          ? prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          )
          : [...prev, { ...product, quantity: 1 }];
      });
    }
  };

  // Remove from cart handler
  const removeFromCart = (id) => {
    if (user?.uid) {
      cartService.removeFromCart(user.uid, id)
        .then(result => {
          if (result.success) setCart(result.cart);
        })
        .catch(error => console.error('Error removing from cart:', error));
    } else {
      setCart(prev => prev.filter(item => item.id !== id));
    }
  };

  // Page renderer
  const renderPage = () => {
    if (isLoading) return <div className="loading-container">Loading...</div>;

    switch (currentPage) {
      case 'home': return <HomePage setCurrentPage={setCurrentPage} />;
      case 'products': return <ProductsPage setCurrentPage={setCurrentPage} addToCart={addToCart} />;
      case 'cart': return <CartPage cart={cart} setCurrentPage={setCurrentPage} removeFromCart={removeFromCart} />;
      case 'payment': return <PaymentPage cart={cart} setCurrentPage={setCurrentPage} />;
      case 'about': return <AboutPage setCurrentPage={setCurrentPage} />;
      case 'contact': return <ContactPage setCurrentPage={setCurrentPage} />;
      case 'login': return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'add-product': return <AddProductPage setCurrentPage={setCurrentPage} user={user} />;
      case 'manage-products': return <ManageProductsPage setCurrentPage={setCurrentPage} user={user} />;
      case 'ai-validation': return <AIValidationPage setCurrentPage={setCurrentPage} />;
      default: return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex-container bg-gray-50">
      <main className="main-content">
        <Header setCurrentPage={setCurrentPage} user={user} setUser={setUser} />
        <Container>
          {renderPage()}
        </Container>
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;