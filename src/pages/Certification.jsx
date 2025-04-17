import React, { useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import {
  ecoProductDictionary,
  specificProducts,
  visualIndicators,
} from "../ecoProductData";
import "./certification-page.css";

const Certification = () => {
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allPredictions, setAllPredictions] = useState([]);
  const imageRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const DOMINANT_PREDICTION_THRESHOLD = 0.4; // 40% threshold for dominant prediction

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setImageError(
          "File is too large. Please upload an image smaller than 10MB."
        );
        setImage(null);
      } else {
        setImageError("");
        setImage(URL.createObjectURL(file));
        setResult(null);
        setAllPredictions([]);
      }
    }
  };

  // Analyze whether a term relates to a product category
  const analyzeCategory = (term) => {
    term = term.toLowerCase();
    const results = [];

    // Check product categories
    for (const [category, keywords] of Object.entries(
      ecoProductDictionary.categories
    )) {
      for (const keyword of keywords) {
        if (term.includes(keyword) || keyword.includes(term)) {
          results.push({
            match: keyword,
            category: category,
            type: "product_category",
            score: 1.0,
          });
        }
      }
    }

    // Check materials
    for (const [material, keywords] of Object.entries(
      ecoProductDictionary.materials
    )) {
      for (const keyword of keywords) {
        if (term.includes(keyword) || keyword.includes(term)) {
          results.push({
            match: keyword,
            category: material,
            type: "material",
            score: 1.2,
          });
        }
      }
    }

    // Check features
    for (const [feature, keywords] of Object.entries(
      ecoProductDictionary.features
    )) {
      for (const keyword of keywords) {
        if (term.includes(keyword) || keyword.includes(term)) {
          results.push({
            match: keyword,
            category: feature,
            type: "feature",
            score: 1.5,
          });
        }
      }
    }

    // Check specific products
    for (const product of specificProducts) {
      if (term.includes(product) || product.includes(term)) {
        results.push({
          match: product,
          category: "specific_product",
          type: "exact_match",
          score: 2.0,
        });
      }
    }

    // Check visual indicators
    for (const indicator of visualIndicators) {
      if (term.includes(indicator) || indicator.includes(term)) {
        results.push({
          match: indicator,
          category: "visual_indicator",
          type: "visual",
          score: 0.7,
        });
      }
    }

    // Check negative indicators - with more exact matching
    for (const [category, keywords] of Object.entries(
      ecoProductDictionary.negative_indicators
    )) {
      for (const keyword of keywords) {
        // For negative indicators, we want to be more precise with matching
        // Use a more exact match strategy instead of partial includes
        if (
          term === keyword ||
          term.includes(" " + keyword + " ") ||
          term.startsWith(keyword + " ") ||
          term.endsWith(" " + keyword)
        ) {
          results.push({
            match: keyword,
            category: category,
            type: "negative_indicator",
            score: -1.5, // Negative score to subtract from total
          });
        }
      }
    }

    return results;
  };

  const analyzeImage = async () => {
    if (!image) {
      setImageError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    try {
      const model = await mobilenet.load({ version: 2, alpha: 1.0 });
      const predictions = await model.classify(imageRef.current, 20);
      setAllPredictions(predictions);

      let totalScore = 0;
      const matchedDetails = new Set();

      predictions.forEach((prediction) => {
        const term = prediction.className;
        const analysis = analyzeCategory(term);
        analysis.forEach((match) => {
          const detail = `${
            match.type === "negative_indicator" ? "⚠️" : "✅"
          } ${match.type.replaceAll("_", " ")}: ${match.match}`;
          matchedDetails.add(detail);
          totalScore += match.score;
        });
      });

      // Normalize score to 5-point scale
      const normalizedScore = Math.max(
        0,
        Math.min(5, (totalScore / predictions.length) * 1.5)
      );
      const topConfidence = predictions[0]?.probability || 0;
      const confidenceLevel =
        topConfidence > 0.75 ? "High" : topConfidence > 0.5 ? "Medium" : "Low";

      setResult({
        score: normalizedScore.toFixed(2),
        confidence: confidenceLevel,
        isEcoFriendly: normalizedScore >= 3,
        details: Array.from(matchedDetails),
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setIsLoading(false);
      setImageError("Error analyzing image. Please try again.");
    }
  };

  return (
    <div className="certification-container">
      <h2 className="certification-title">Eco-Product Detector</h2>
      <p className="certification-description">
        Upload a product image to verify if it meets eco-friendly standards. Our
        AI will analyze the image and determine sustainability metrics.
      </p>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />
        {imageError && <p className="error-message">{imageError}</p>}

        {image && (
          <div className="image-preview">
            <img
              ref={imageRef}
              src={image}
              alt="Product preview"
              className="preview-image"
              crossOrigin="anonymous"
            />
          </div>
        )}
      </div>

      <div className="button-container">
        <button
          onClick={analyzeImage}
          disabled={!image || isLoading}
          className="analyze-button"
        >
          {isLoading ? "Analyzing..." : "Analyze Product"}
        </button>
      </div>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-animation">
            <div className="loading-circle"></div>
            <div className="loading-content">
              <div className="loading-bar"></div>
              <div className="loading-bar-short"></div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="results-container">
          <h3 className="results-title">Eco-Product Analysis</h3>

          <div className="score-container">
            <span className="score-value">{result.score}/5</span>
            <span>Eco-Score</span>
          </div>

          {/* Additional result details would go here */}
        </div>
      )}
    </div>
  );
};

export default Certification;
