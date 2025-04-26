import React, { useState } from "react";
import { db } from "../../firebase-config";
import { collection, addDoc } from "firebase/firestore";

const AddProductPage = ({ setCurrentPage, user }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    isEco: true,
    image: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      const { title, description, price, category, isEco, image } = formData;

      const productData = {
        title,
        description,
        price: parseFloat(price),
        category,
        isEco,
        image,
        createdAt: new Date(),
        ownerId: user.uid,
      };

      await addDoc(collection(db, "products"), productData);

      setSubmitSuccess(true);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        isEco: true,
        image: "",
      });
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmitError("Failed to add product. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2">Add New Product</h1>
      <p className="mb-4 text-gray-600">
        Add a new sustainable and eco-friendly product to the marketplace.
      </p>

      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Product added successfully!
        </div>
      )}
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="title">
            Product Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="description">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="price">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isEco"
            name="isEco"
            checked={formData.isEco}
            onChange={handleInputChange}
            className="w-4 h-4"
          />
          <label htmlFor="isEco" className="text-sm text-gray-700">
            This is an eco-friendly product
          </label>
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="image">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="Enter image URL"
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        {formData.image && (
          <div>
            <p className="mb-1 font-medium">Image Preview:</p>
            <img
              src={formData.image}
              alt="Preview"
              className="max-w-xs rounded border border-gray-200"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage("manage-products")}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Manage Products
          </button>
        </div>
      </form>

      <button
        onClick={() => setCurrentPage("home")}
        className="mt-6 underline text-blue-600 hover:text-blue-800 text-sm"
      >
        Back to Home
      </button>
    </div>
  );
};

export default AddProductPage;
