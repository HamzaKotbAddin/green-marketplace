import React, { useState, useEffect } from 'react';
import { productsCollection, firestore } from '../firebase';

const ProductsPage = ({ setCurrentPage, addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await firestore.getCollection(productsCollection);
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please check your connection.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xl ${i < rating ? 'text-green-500' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-green-500 border-t-transparent h-12 w-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="border border-green-600 text-green-600 px-6 py-2 rounded hover:bg-green-100 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Our Sustainable Products</h1>
        <p className="text-gray-600">Eco-friendly solutions for a greener future</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image Section */}
            <div
              className="h-64 bg-gray-200 bg-cover bg-center"
              style={{ backgroundImage: `url(${product.image || 'https://via.placeholder.com/400x300?text=Eco+Product'})` }}
            ></div>

            <div className="p-6">
              {/* Product Info */}
              <h3 className="text-lg font-semibold text-green-700 mb-2 line-clamp-1">{product.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              {/* Price & Rating */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-green-800 text-xl font-bold">${product.price}</span>
                {renderStars(product.ecoScore)}
              </div>

              {/* Certifications */}
              {product.certifications?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.certifications.map((cert, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                      {cert}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full border border-green-600 text-green-600 py-3 rounded hover:bg-green-100 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setCurrentPage('product-detail')}
                  className="w-full text-green-600 underline py-3 rounded hover:text-green-800 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;