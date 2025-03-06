// src/pages/HomePage.jsx
import React, { useState } from 'react';

const HomePage = () => {
  const [image, setImage] = useState(null);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the image
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Welcome to Green Marketplace</h1>
      <p className="text-lg mb-4">
        Discover eco-friendly and sustainable products that help you reduce your environmental footprint.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Featured categories */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Eco Home</h2>
          <p className="text-gray-600 mb-4">Sustainable products for your home and living spaces.</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Browse Products
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Sustainable Fashion</h2>
          <p className="text-gray-600 mb-4">Ethically made clothing and accessories from renewable materials.</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Browse Products
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Zero Waste</h2>
          <p className="text-gray-600 mb-4">Products designed to eliminate waste and reduce plastic usage.</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Browse Products
          </button>
        </div>
      </div>
      
      {/* Eco Certification Section */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Verify Eco-Certification</h2>
        <p className="text-gray-600 mb-4">
          Upload a product image to verify its sustainability certification.
        </p>
        
        {/* File Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 p-2 rounded mb-4"
          />
          {image && <img src={image} alt="Uploaded preview" className="mt-4 w-full h-auto rounded" />}
        </div>
        
        {/* Certification Button */}
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Verify Certification
        </button>
      </div>
    </div>
  );
};

export default HomePage;
