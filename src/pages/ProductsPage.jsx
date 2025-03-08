import React, { useState, useEffect } from 'react';

const ProductsPage = ({ goBack }) => {
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
              style={{ backgroundImage: `url(${product.image})`, backgroundSize: 'cover' }}
            ></div>
            <h3 className="text-lg font-semibold text-green-700">{product.title}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-green-800 font-bold mb-4">${product.price}</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Payment Gateway Section (Prototype) */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Secure Payment</h2>
        <p className="text-gray-600 mb-4">
          Choose a secure payment method for your order. You can also contribute to green initiatives or offset your carbon footprint.
        </p>

        {/* Payment Method Selector (Prototype) */}
        <div className="mb-4">
          <label className="text-green-700 font-semibold mb-2 block">Select Payment Method</label>
          <select className="border border-gray-300 p-2 rounded w-full">
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="crypto">Cryptocurrency</option>
          </select>
        </div>

        {/* Green Payment Option */}
        <div className="mb-4">
          <label className="text-green-700 font-semibold mb-2 block">
            Add Carbon-Neutral Contribution
          </label>
          <input
            type="checkbox"
            id="carbonNeutral"
            name="carbonNeutral"
            className="mr-2"
          />
          <span className="text-gray-600">Contribute to offset your carbon footprint for this purchase</span>
        </div>

        {/* Payment Button (Prototype) */}
        <button className="bg-green-600 text-white px-6 py-2 rounded w-full hover:bg-green-700 transition">
          Proceed to Payment
        </button>
      </div>

      {/* Go back button */}
      <button
        onClick={goBack}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mt-4"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ProductsPage;
