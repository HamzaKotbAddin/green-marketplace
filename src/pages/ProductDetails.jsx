import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import ProductReview from "./ProductReview"; // Import ProductReview component

const ProductDetails = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [ecoScore, setEcoScore] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      );
      const querySnapshot = await getDocs(q);
      const reviewList = [];
      let totalEcoScore = 0;

      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();
        reviewList.push(reviewData);
        totalEcoScore += reviewData.ecoScore;
      });

      setReviews(reviewList);

      // Calculate the average Eco-Score
      if (reviewList.length > 0) {
        setEcoScore(totalEcoScore / reviewList.length);
      }
    };

    fetchReviews();
  }, [productId]);

  return (
    <div className="product-details">
      <h2>Product Details</h2>
      {/* Product details (title, description, price) here */}

      <div className="eco-score">
        <h3>Eco-Score: {ecoScore.toFixed(2)}</h3>
        <p>Average sustainability score based on user reviews</p>
      </div>

      <div className="reviews">
        <h3>Customer Reviews</h3>
        {reviews.map((review, index) => (
          <div key={index} className="review">
            <p>
              <strong>Eco-Packaging:</strong> {review.ecoPackaging}
            </p>
            <p>
              <strong>Carbon Footprint:</strong> {review.carbonFootprint}
            </p>
            <p>
              <strong>Material Sourcing:</strong> {review.materialSourcing}
            </p>
          </div>
        ))}
      </div>

      {/* Add Review Component (ProductReview is where users can submit reviews) */}
      <ProductReview productId={productId} />
    </div>
  );
};

export default ProductDetails;
