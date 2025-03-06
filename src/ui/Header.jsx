import React, { useState } from 'react';

const Header = ({ setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Green Marketplace</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => setCurrentPage('home')} className="hover:text-green-200 transition">
              Home
            </button>
            <button onClick={() => setCurrentPage('products')} className="hover:text-green-200 transition">
              Products
            </button>
            <button onClick={() => setCurrentPage('about')} className="hover:text-green-200 transition">
              About
            </button>
            <button onClick={() => setCurrentPage('contact')} className="hover:text-green-200 transition">
              Contact
            </button>
          </nav>

          {/* Mobile  Menu */}
          <div className="md:hidden flex items-center space-x-4">
            <button className="p-2 hover:text-green-200" onClick={handleMobileMenuToggle}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Login Button */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:text-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 hover:text-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
            <button className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-md transition">
              Login
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4">
            <button onClick={() => setCurrentPage('home')} className="block w-full text-left py-2 px-4 hover:text-green-200">
              Home
            </button>
            <button onClick={() => setCurrentPage('products')} className="block w-full text-left py-2 px-4 hover:text-green-200">
              food
            </button>
            <button onClick={() => setCurrentPage('about')} className="block w-full text-left py-2 px-4 hover:text-green-200">
              About
            </button>
            <button onClick={() => setCurrentPage('contact')} className="block w-full text-left py-2 px-4 hover:text-green-200">
              Contact
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
