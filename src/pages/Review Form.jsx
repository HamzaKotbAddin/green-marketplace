import React, { useState } from "react";
import { db } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";

const ProductReview = ({ productId }) => {
  const [ecoPackaging, setEcoPackaging] = useState("");
  const [carbonFootprint, setCarbonFootprint] = useState("");
  const [materialSourcing, setMaterialSourcing] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!ecoPackaging || !carbonFootprint || !materialSourcing) {
      setReviewMessage("Please fill out all sustainability review fields.");
      return;
    }

    setIsSubmitting(true);
    const ecoScore =
      (parseFloat(ecoPackaging) +
        parseFloat(carbonFootprint) +
        parseFloat(materialSourcing)) /
      3;

    try {
      const newReview = {
        ecoPackaging: parseFloat(ecoPackaging),
        carbonFootprint: parseFloat(carbonFootprint),
        materialSourcing: parseFloat(materialSourcing),
        ecoScore,
        productId,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "reviews"), newReview);
      setReviewMessage("Review submitted successfully!");
    } catch (error) {
      setReviewMessage("Failed to submit the review. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Leave a Sustainability Review</h3>

      {reviewMessage && <p className="review-message">{reviewMessage}</p>}

      <form onSubmit={handleReviewSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="ecoPackaging">Eco-Packaging (1-5)</label>
          <input
            type="number"
            id="ecoPackaging"
            value={ecoPackaging}
            onChange={(e) => setEcoPackaging(e.target.value)}
            min="1"
            max="5"
            className="form-input"
            placeholder="Rate packaging sustainability"
          />
        </div>

        <div className="form-group">
          <label htmlFor="carbonFootprint">Carbon Footprint (1-5)</label>
          <input
            type="number"
            id="carbonFootprint"
            value={carbonFootprint}
            onChange={(e) => setCarbonFootprint(e.target.value)}
            min="1"
            max="5"
            className="form-input"
            placeholder="Rate carbon footprint impact"
          />
        </div>

        <div className="form-group">
          <label htmlFor="materialSourcing">Material Sourcing (1-5)</label>
          <input
            type="number"
            id="materialSourcing"
            value={materialSourcing}
            onChange={(e) => setMaterialSourcing(e.target.value)}
            min="1"
            max="5"
            className="form-input"
            placeholder="Rate material sourcing sustainability"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ProductReview;
