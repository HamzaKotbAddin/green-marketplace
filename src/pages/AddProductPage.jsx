import React, { useState } from "react";
import { db } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import "./add-product-page.css";

const AddProductPage = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    isEco: true,
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
      // Convert price to number
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        createdAt: new Date(),
      };

      await addDoc(collection(db, "products"), productData);

      setSubmitSuccess(true);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        isEco: true,
      });
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmitError("Failed to add product. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-container">
      <h1 className="product-title">Add New Product</h1>
      <p className="product-description">
        Add a new sustainable and eco-friendly product to the marketplace.
      </p>

      {submitSuccess && (
        <div className="success-message">Product added successfully!</div>
      )}
      {submitError && <div className="error-message">{submitError}</div>}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="title">Product Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Product Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            required
          />
        </div>

        <div className="form-grid">
          <div>
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
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

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="isEco"
            name="isEco"
            checked={formData.isEco}
            onChange={handleInputChange}
          />
          <label htmlFor="isEco">This is an eco-friendly product</label>
        </div>

        <div className="button-container">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${
              isSubmitting ? "submit-button-disabled" : ""
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage("manage-products")}
            className="secondary-button"
          >
            Manage Products
          </button>
        </div>
      </form>

      <button onClick={() => setCurrentPage("home")} className="back-button">
        Back to Home
      </button>
    </div>
  );
};

export default AddProductPage;
