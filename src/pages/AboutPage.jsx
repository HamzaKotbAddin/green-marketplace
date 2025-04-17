// src/pages/AboutPage.jsx
import React from 'react';
import './about-page.css';

const AboutPage = () => (
  <div className="about-container">
    <div className="about-content">
      <h1 className="about-title">About Green Marketplace</h1>
      <p className="about-description">
        Green Marketplace is a dedicated platform that strives to offer sustainable, eco-friendly products, 
        bringing the best of organic, natural, and environmentally conscious choices to your doorstep. 
        Our mission is to promote sustainable living through a curated selection of products that align with 
        a greener future.
      </p>
      <div className="mission-box">
        <h2 className="mission-title">Our Mission</h2>
        <p className="mission-text">
          We aim to create a seamless shopping experience for those who care about the planet and are 
          looking for responsible alternatives to everyday items. From organic foods to eco-friendly household 
          products, we prioritize sustainability and environmental impact in everything we offer.
        </p>
      </div>
      
      <div className="features-section">
        <h3 className="features-title">Why Choose Us?</h3>
        <div className="features-list">
          <div className="feature-item">
            <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="feature-text">Eco-friendly products sourced from ethical vendors.</p>
          </div>
          <div className="feature-item">
            <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="feature-text">A curated selection of products that fit a sustainable lifestyle.</p>
          </div>
          <div className="feature-item">
            <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="feature-text">Transparent and responsible sourcing practices.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;
