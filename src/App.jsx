import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './ui/Header';
import Footer from './ui/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage .jsx';
import ContactPage from './pages/ContactPage';
import PaymentPage from './pages/PaymentPage';
import ManageProductsPage from './pages/ManageProductsPage';
import AddProductPage from './pages/AddProductPage';
import AIValidationPage from './pages/AIValidationPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/manage-products" element={<ManageProductsPage />} />
              <Route path="/add-product" element={<AddProductPage />} />
              <Route path="/ai-validation" element={<AIValidationPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
