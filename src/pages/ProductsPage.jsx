import React, { useState, useEffect } from "react";
import { db, collection, onSnapshot } from "../../firebase-config";

const ProductsPage = ({ setCurrentPage, addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

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
        const productList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setFilteredProducts(productList); // Initially show all products
      },
      (error) => {
        console.error("Error fetching Firestore products:", error);
      }
    );

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Filter products based on selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Our Products</h1>
      <p className="mb-6">
        Browse our selection of sustainable and eco-friendly products.
      </p>

      {/* Category Filter */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-2">
          Categories
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            } transition hover:bg-green-700`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              } transition hover:bg-green-700`}
            >
              {category.replace(/_/g, " ").toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-lg text-gray-600">
            No products available in this category.
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              {/* Product image with fallback */}
              <div
                className="bg-gray-200 h-48 rounded-md mb-4"
                style={{
                  backgroundImage: `url(${
                    product.image || "/path/to/fallback-image.jpg"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <h3 className="text-lg font-semibold text-green-700">
                {product.title}
              </h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-green-800 font-bold mb-4">${product.price}</p>
              <button
                onClick={() => addToCart(product)}
                className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => setCurrentPage("cart")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
              >
                Go to Cart
              </button>
            </div>
          ))
        )}
      </div>

      {/* Go back button */}
      <button
        onClick={() => setCurrentPage("home")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mt-4"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ProductsPage;
