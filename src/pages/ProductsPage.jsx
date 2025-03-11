import React, { useState, useEffect } from 'react';

const ProductsPage = ({ setCurrentPage, addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Our Products</h1>
      <p className="mb-6">Browse our selection of sustainable and eco-friendly products.</p>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <div
              className="bg-gray-200 h-48 rounded-md mb-4"
              style={{ backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
            <h3 className="text-lg font-semibold text-green-700">{product.title}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-green-800 font-bold mb-4">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => setCurrentPage('cart')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
            >
              Go to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Go back button */}
      <button
        onClick={() => setCurrentPage('home')}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mt-4"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ProductsPage;
