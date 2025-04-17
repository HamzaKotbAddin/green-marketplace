import React, { useEffect } from 'react';
import Certification from './Certification';
import './home-page.css';

const HomePage = ({ setCurrentPage }) => {
  const handleShowProducts = () => {
    setCurrentPage('products'); // Show products page
  };

  // scroll reveal effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.about-section, .features-title, .feature-card, .certification-wrapper, .cta-title, .cta-description');
    animatedElements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      animatedElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section  */}
      <div className="hero-section">
        {/* Background  */}
        <div className="hero-background">
          <div className="leaf-1">🍃</div>
          <div className="leaf-2">🍃</div>
          <div className="leaf-3">🍃</div>
        </div>
        
        <h1 className="hero-title">Welcome to Green Marketplace</h1>
        <p className="hero-description">Discover eco-friendly and sustainable products that help you reduce your environmental footprint.</p>
        <button
          onClick={handleShowProducts}
          className="hero-button"
        >
          Browse Products
        </button>
      </div>

      {/* About Section */}
      <section className="about-section">
        <h2 className="about-title">Why Choose Us?</h2>
        <p className="about-description">
          At Green Marketplace, we curate only the finest eco-friendly and sustainable products that not only benefit you but also the planet. 
          From organic foods to eco-conscious fashion, we strive to offer a variety of products that help reduce your environmental footprint.
        </p>
        <button
          onClick={handleShowProducts}
          className="about-button"
        >
          Explore More
        </button>
      </section>

      {/* Features Section  */}
      <section className="features-section">
        <h2 className="features-title">What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card delay-100">
            <div className="feature-icon-container">
              <i className="fas fa-leaf feature-icon"></i>
            </div>
            <h3 className="feature-title">Eco-Friendly Products</h3>
            <p className="feature-description">We carefully select products that minimize environmental impact while still offering quality and value.</p>
          </div>
          <div className="feature-card delay-200">
            <div className="feature-icon-container">
              <i className="fas fa-shipping-fast feature-icon"></i>
            </div>
            <h3 className="feature-title">Fast Delivery</h3>
            <p className="feature-description">Enjoy quick and reliable shipping on all orders. We ensure that your green products arrive promptly.</p>
          </div>
          <div className="feature-card delay-300">
            <div className="feature-icon-container">
              <i className="fas fa-heart feature-icon"></i>
            </div>
            <h3 className="feature-title">Sustainable Impact</h3>
            <p className="feature-description">Every purchase you make helps us support environmental initiatives and promote sustainability.</p>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <div className="certification-wrapper">
        <Certification />
      </div>

      {/* Call to Action Section */}
      <section className="cta-section">
        {/* Animated background pulse */}
        <div className="cta-background"></div>
        
        <div className="cta-content">
          <h2 className="cta-title">Join the Green Movement Today!</h2>
          <p className="cta-description">Start making conscious choices that help the planet. Browse our selection of sustainable products and make a difference.</p>
          <button
            onClick={handleShowProducts}
            className="cta-button"
          >
            Browse Products
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
