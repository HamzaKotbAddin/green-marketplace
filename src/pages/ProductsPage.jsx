import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

const ProductsPage = ({ setCurrentPage, addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productAPI.getAllProducts();
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Our Products</h1>
      <p className="mb-6">Browse our selection of sustainable and eco-friendly products.</p>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <div
                className="bg-gray-200 h-48 rounded-md mb-4"
                style={{ 
                  backgroundImage: `url(${product.image || 'https://via.placeholder.com/300x200?text=Eco+Product'})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }}
              ></div>
              <h3 className="text-lg font-semibold text-green-700">{product.name || product.title}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              <p className="text-green-800 font-bold mb-4">${product.price}</p>
              
              {/* Eco Score */}
              {product.ecoScore && (
                <div className="flex items-center mb-3">
                  <span className="text-sm text-gray-600 mr-2">Eco Score:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className={`w-4 h-4 ${product.ecoScore >= star ? "text-green-500" : "text-gray-300"}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Certifications */}
              {product.certifications && product.certifications.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.certifications.map((cert, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {cert}
                    </span>
                  ))}
                </div>
              )}
              
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
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        )}
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
