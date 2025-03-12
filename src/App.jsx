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
import LoginPage from './pages/LoginPage .jsx';
import { db } from '../firebase-config';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create a unique anonymous ID for non-logged in users
  useEffect(() => {
    const setupAnonymousUser = async () => {
      if (!user) {
        // Check if we already have an anonymous ID stored
        const anonymousId = sessionStorage.getItem('anonymousUserId');
        
        if (anonymousId) {
          // Use existing anonymous ID
          setUser({ uid: anonymousId, isAnonymous: true });
        } else {
          try {
            // Create a new document in the 'anonymous' collection
            const newAnonymousRef = await db.collection('anonymous').add({
              createdAt: new Date(),
            });
            
            // Store the new ID in session storage
            sessionStorage.setItem('anonymousUserId', newAnonymousRef.id);
            setUser({ uid: newAnonymousRef.id, isAnonymous: true });
          } catch (error) {
            console.error('Error creating anonymous user:', error);
          }
        }
      }
      setIsLoading(false);
    };
    
    setupAnonymousUser();
  }, []);
  
  // Load user data (cart and current page) from Firebase
  useEffect(() => {
    if (user && user.uid) {
      // Set up listeners for real-time updates
      const userDataRef = db.collection('userData').doc(user.uid);
      
      const unsubscribe = userDataRef.onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          
          // Load cart
          if (data.cart) {
            setCart(data.cart);
          }
          
          // Load current page
          if (data.currentPage) {
            setCurrentPage(data.currentPage);
          }
        } else {
          // Document doesn't exist yet, save current data
          userDataRef.set({
            cart: cart,
            currentPage: currentPage,
            isAnonymous: user.isAnonymous || false
          }).catch(error => {
            console.error('Error creating user data document:', error);
          });
        }
      }, (error) => {
        console.error('Error in Firebase snapshot listener:', error);
      });
      
      // Clean up the listener when the component unmounts or user changes
      return () => unsubscribe();
    }
  }, [user]);
  
  // Save data to Firebase when cart or page changes
  useEffect(() => {
    if (user && user.uid && !isLoading) {
      const userDataRef = db.collection('userData').doc(user.uid);
      
      userDataRef.update({
        cart: cart,
        currentPage: currentPage,
        lastUpdated: new Date()
      }).catch(error => {
        console.error('Error updating user data:', error);
      });
    }
  }, [cart, currentPage, user, isLoading]);
  
  // Handle user login and transfer anonymous data
  const handleLogin = async (userData) => {
    if (user && user.isAnonymous) {
      // Transfer anonymous user data to the authenticated user
      try {
        const anonymousDataRef = db.collection('userData').doc(user.uid);
        const anonymousDataSnap = await anonymousDataRef.get();
        
        if (anonymousDataSnap.exists) {
          const anonymousData = anonymousDataSnap.data();
          
          // Set the authenticated user's data
          await db.collection('userData').doc(userData.uid).set({
            cart: anonymousData.cart || [],
            currentPage: anonymousData.currentPage || 'home',
            lastUpdated: new Date()
          });
          
          // Optionally delete anonymous data
          await anonymousDataRef.delete();
        }
        
        // Clear anonymous ID from session storage
        sessionStorage.removeItem('anonymousUserId');
      } catch (error) {
        console.error('Error transferring anonymous data:', error);
      }
    }
    
    // Set the authenticated user
    setUser(userData);
  };
  
  // Add to cart function
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If product exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 1) + 1
        };
        return updatedCart;
      } else {
        // If product doesn't exist, add it with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };
  
  // Remove from cart function
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };
  
  // Render page dynamically based on the current page
  const renderPage = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64">Loading...</div>;
    }
    
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'products':
        return <ProductsPage setCurrentPage={setCurrentPage} addToCart={addToCart} />;
      case 'cart':
        return <CartPage cart={cart} setCurrentPage={setCurrentPage} removeFromCart={removeFromCart} />;
      case 'payment':
        return <PaymentPage cart={cart} setCurrentPage={setCurrentPage} />;
      case 'about':
        return <AboutPage setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <ContactPage setCurrentPage={setCurrentPage} />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} setUser={handleLogin} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <Header setCurrentPage={setCurrentPage} user={user} setUser={setUser} />
        <Container>
          {renderPage()}
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;