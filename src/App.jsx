import { useState } from 'react';
import Header from './ui/Header';
import Footer from './ui/Footer';
import Container from './ui/Container';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);

  // Add to cart function
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]); // Append new item to cart
  };

  // Remove from cart function (optional)
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Render the correct page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'products':
        return <ProductsPage setCurrentPage={setCurrentPage} addToCart={addToCart} />;
      case 'cart':
        return <CartPage cart={cart} setCurrentPage={setCurrentPage} removeFromCart={removeFromCart} />;
      case 'about':
        return <AboutPage setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <ContactPage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <Header setCurrentPage={setCurrentPage} />
        <Container>
          {renderPage()}
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
