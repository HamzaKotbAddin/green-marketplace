import React, { useState, useEffect } from "react";
import { db, collection, onSnapshot } from "../../firebase-config";

const ProductsPage = ({ setCurrentPage, addToCart, cart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quantities, setQuantities] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    if (cart.length === 0) {
      localStorage.removeItem('cartPrompted');
    }
  }, [cart]);

  // Define categories
  const categories = [
    "coffee_accessories",
    "bags_and_accessories",
    "kitchen_and_home",
    "personal_care",
    "clothing_and_apparel",
    "outdoor_and_garden",
    "pet_products",
    "office_supplies",
  ];

  // Fetch products from Firestore
  useEffect(() => {
    const productsRef = collection(db, "products");
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(list);
        setFilteredProducts(list);
      },
      (error) => console.error("Error fetching products:", error)
    );
    return () => unsubscribe();
  }, []);

  // Filter by category
  useEffect(() => {
    setFilteredProducts(
      selectedCategory === "all"
        ? products
        : products.filter((p) => p.category === selectedCategory)
    );
  }, [selectedCategory, products]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Our Products</h1>
      <p className="mb-6">
        Browse our selection of sustainable and eco-friendly products.
      </p>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-md ${selectedCategory === "all"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md ${selectedCategory === cat
                ? "bg-green-600 text-white"
                : "bg-gray-200"
                }`}
            >
              {cat.replace(/_/g, " ").toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid (4 columns on medium screens) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">
            No products available in this category.
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col justify-between"
            >
              {/* Image (full coverage) */}
              <div className="w-full mb-4 overflow-hidden rounded-md bg-white">
                <img
                  src={product.image || "/path/to/fallback.jpg"}
                  alt={product.title}
                  className="w-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-1">
                  {product.description || "\u00A0"}
                </p>
                <p className="text-green-800 font-bold mb-4">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
              </div>

              {/* Quantity & Add */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => {
                      const q = (quantities[product.id] || 1) - 1;
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: Math.max(q, 1),
                      }));
                    }}
                    className="px-2 py-1 border rounded"
                  >
                    –
                  </button>
                  <input
                    type="number"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: Math.max(
                          1,
                          parseInt(e.target.value, 10) || 1
                        ),
                      }))
                    }
                    className="w-12 text-center border rounded"
                  />
                  <button
                    onClick={() => {
                      const q = (quantities[product.id] || 1) + 1;
                      setQuantities((prev) => ({ ...prev, [product.id]: q }));
                    }}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => {
                    // was the cart empty before adding?
                    const wasEmpty = cart.length === 0;

                    // add the item as usual
                    addToCart(product, quantities[product.id] || 1);

                    // if it was empty and we’ve never prompted before…
                    if (wasEmpty && !localStorage.getItem('cartPrompted')) {
                      localStorage.setItem('cartPrompted', 'true');
                      setModalProduct(product);
                      setShowModal(true);
                    }
                  }}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Back to Home */}
      <button
        onClick={() => setCurrentPage("home")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </button>
      {showModal && modalProduct && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center border-4 border-green-600">
            <p className="mb-4 text-lg">
              <strong>{modalProduct.title}</strong> has been added to your cart!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setCurrentPage("cart");
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
              >
                Go to Cart
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsPage;