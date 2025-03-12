// src/pages/AboutPage.jsx
import React from 'react';

const AboutPage = () => (
  <div className="bg-gray-50 py-12 px-6 md:px-12">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-extrabold text-green-800 mb-6">About Green Marketplace</h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8">
        Green Marketplace is a dedicated platform that strives to offer sustainable, eco-friendly products, 
        bringing the best of organic, natural, and environmentally conscious choices to your doorstep. 
        Our mission is to promote sustainable living through a curated selection of products that align with 
        a greener future.
      </p>
      <div className="bg-green-600 text-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-md md:text-lg text-gray-100">
          We aim to create a seamless shopping experience for those who care about the planet and are 
          looking for responsible alternatives to everyday items. From organic foods to eco-friendly household 
          products, we prioritize sustainability and environmental impact in everything we offer.
        </p>
      </div>
      
      <div className="mt-12 space-y-6">
        <h3 className="text-2xl font-semibold text-green-700">Why Choose Us?</h3>
        <div className="space-y-4 text-left">
          <div className="flex items-start space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-lg">Eco-friendly products sourced from ethical vendors.</p>
          </div>
          <div className="flex items-start space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-lg">A curated selection of products that fit a sustainable lifestyle.</p>
          </div>
          <div className="flex items-start space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-lg">Transparent and responsible sourcing practices.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;
