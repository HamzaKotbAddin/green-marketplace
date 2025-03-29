import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { ecoProductDictionary, specificProducts, visualIndicators } from "../ecoProductData";
import { aiValidationAPI } from "../services/api";
import './ai-validation-page.css';

const AIValidationPage = () => {
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allPredictions, setAllPredictions] = useState([]);
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    materials: [],
    certifications: []
  });
  
  const imageRef = useRef(null);
  
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const DOMINANT_PREDICTION_THRESHOLD = 0.4; // 40% threshold for dominant prediction

  // Load the model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        console.log("Loading MobileNet model...");
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        console.log("MobileNet model loaded successfully");
        setModelLoading(false);
      } catch (error) {
        console.error("Error loading model:", error);
        setModelLoading(false);
      }
    };
    
    loadModel();
    
    // Cleanup function
    return () => {
      // Dispose of tensors and models when component unmounts
      if (model) {
        // Clean up any tensors
        tf.dispose();
      }
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setImageError("File is too large. Please upload an image smaller than 10MB.");
        setImage(null);
      } else {
        setImageError("");
        setImage(URL.createObjectURL(file));
        setResult(null);
        setAllPredictions([]);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
  };

  const handleArrayInputChange = (e) => {
    const { name, value } = e.target;
    // Split by commas and trim whitespace
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setProductData({
      ...productData,
      [name]: arrayValue
    });
  };

  // Analyze whether a term relates to a product category
  const analyzeCategory = (term) => {
    term = term.toLowerCase();
    const results = [];
    
    // Check product categories
    for (const [category, keywords] of Object.entries(ecoProductDictionary.categories)) {
      for (const keyword of keywords) {
        if (term.includes(keyword) || keyword.includes(term)) {
          results.push({
            match: keyword,
            category: category,
            type: "product_category",
            score: 1.0
          });
        }
      }
    }
    
    return results;
  };

  // Analyze whether a term relates to sustainable materials
  const analyzeMaterials = (term) => {
    term = term.toLowerCase();
    const results = [];
    
    // Check sustainable materials
    for (const [materialType, materials] of Object.entries(ecoProductDictionary.materials)) {
      for (const material of materials) {
        if (term.includes(material) || material.includes(term)) {
          results.push({
            match: material,
            category: materialType,
            type: "material",
            score: 1.0
          });
        }
      }
    }
    
    return results;
  };

  // Analyze whether a term relates to eco-friendly features or certifications
  const analyzeFeatures = (term) => {
    term = term.toLowerCase();
    const results = [];
    
    // Check features and certifications
    for (const [featureType, features] of Object.entries(ecoProductDictionary.features)) {
      for (const feature of features) {
        if (term.includes(feature) || feature.includes(term)) {
          results.push({
            match: feature,
            category: featureType,
            type: "feature",
            score: 1.0
          });
        }
      }
    }
    
    return results;
  };

  // Check if a term indicates a non-eco product
  const checkNegativeIndicators = (term) => {
    term = term.toLowerCase();
    const results = [];
    
    // Check negative indicators
    for (const [indicatorType, indicators] of Object.entries(ecoProductDictionary.negative_indicators)) {
      for (const indicator of indicators) {
        if (term.includes(indicator) || indicator.includes(term)) {
          results.push({
            match: indicator,
            category: indicatorType,
            type: "negative_indicator",
            score: 1.0
          });
        }
      }
    }
    
    return results;
  };

  // Check if a term matches a specific eco-friendly product
  const checkSpecificProducts = (term) => {
    term = term.toLowerCase();
    const results = [];
    
    for (const product of specificProducts) {
      if (term.includes(product) || product.includes(term)) {
        results.push({
          match: product,
          type: "specific_product",
          score: 1.0
        });
      }
    }
    
    return results;
  };

  // Check if a term matches a visual indicator commonly found in eco-product photos
  const checkVisualIndicators = (term) => {
    term = term.toLowerCase();
    const results = [];
    
    for (const indicator of visualIndicators) {
      if (term.includes(indicator) || indicator.includes(term)) {
        results.push({
          match: indicator,
          type: "visual_indicator",
          score: 1.0
        });
      }
    }
    
    return results;
  };

  const analyzeImage = async () => {
    if (!image || !imageRef.current || !model) return;
    
    try {
      setIsLoading(true);
      
      // Classify the image using MobileNet
      const predictions = await model.classify(imageRef.current);
      setAllPredictions(predictions);
      
      // Process the predictions
      let ecoScore = 0;
      let confidenceLevel = "Uncertain";
      let ecoFriendly = false;
      const detectionSummary = [];
      const matchedFeatures = [];
      
      // Analyze each prediction
      for (const prediction of predictions) {
        const { className, probability } = prediction;
        const terms = className.split(', ');
        
        for (const term of terms) {
          // Check various eco-indicators
          const categoryMatches = analyzeCategory(term);
          const materialMatches = analyzeMaterials(term);
          const featureMatches = analyzeFeatures(term);
          const negativeMatches = checkNegativeIndicators(term);
          const specificProductMatches = checkSpecificProducts(term);
          const visualIndicatorMatches = checkVisualIndicators(term);
          
          // Add matches to the matched features list
          [...categoryMatches, ...materialMatches, ...featureMatches, 
           ...specificProductMatches, ...visualIndicatorMatches].forEach(match => {
            if (!matchedFeatures.includes(match.match)) {
              matchedFeatures.push(match.match);
            }
          });
          
          // Calculate eco-score based on matches
          if (categoryMatches.length > 0) ecoScore += 0.5 * probability;
          if (materialMatches.length > 0) ecoScore += 1.0 * probability;
          if (featureMatches.length > 0) ecoScore += 1.0 * probability;
          if (specificProductMatches.length > 0) ecoScore += 1.5 * probability;
          if (visualIndicatorMatches.length > 0) ecoScore += 0.5 * probability;
          
          // Reduce score for negative indicators
          if (negativeMatches.length > 0) ecoScore -= 1.0 * probability;
          
          // Add to detection summary
          if (materialMatches.length > 0) {
            detectionSummary.push(`Detected sustainable material: ${materialMatches[0].match}`);
          }
          if (featureMatches.length > 0) {
            detectionSummary.push(`Detected eco-feature: ${featureMatches[0].match}`);
          }
          if (negativeMatches.length > 0) {
            detectionSummary.push(`Warning: Detected non-eco element: ${negativeMatches[0].match}`);
          }
        }
      }
      
      // Adjust score based on product data
      if (productData.materials && productData.materials.length > 0) {
        const sustainableMaterials = productData.materials.filter(material => 
          ecoProductDictionary.materials.sustainable_materials.some(m => material.toLowerCase().includes(m)) ||
          ecoProductDictionary.materials.biodegradable_materials.some(m => material.toLowerCase().includes(m))
        );
        
        if (sustainableMaterials.length > 0) {
          ecoScore += 0.5;
          detectionSummary.push(`Product contains sustainable materials: ${sustainableMaterials.join(', ')}`);
        }
      }
      
      if (productData.certifications && productData.certifications.length > 0) {
        const validCertifications = productData.certifications.filter(cert => 
          ecoProductDictionary.features.certifications.some(c => cert.toLowerCase().includes(c))
        );
        
        if (validCertifications.length > 0) {
          ecoScore += 0.5;
          detectionSummary.push(`Product has eco certifications: ${validCertifications.join(', ')}`);
        }
      }
      
      // Normalize score to 0-5 range
      ecoScore = Math.min(5, Math.max(0, ecoScore));
      
      // Determine confidence level
      if (predictions[0].probability > DOMINANT_PREDICTION_THRESHOLD) {
        confidenceLevel = "High";
      } else if (predictions[0].probability > 0.2) {
        confidenceLevel = "Medium";
      } else {
        confidenceLevel = "Low";
      }
      
      // Determine if eco-friendly
      ecoFriendly = ecoScore >= 3.0;
      
      // Set result
      setResult({
        score: ecoScore.toFixed(1),
        confidenceLevel,
        ecoFriendly,
        detectionSummary,
        matchedFeatures
      });
      
      // Call external API for additional validation
      try {
        const apiResult = await aiValidationAPI.validateProduct({
          image_url: image,
          product_name: productData.name,
          product_description: productData.description,
          materials: productData.materials,
          certifications: productData.certifications
        });
        
        console.log("API validation result:", apiResult);
        // Could merge API results with local results if needed
      } catch (error) {
        console.error("API validation error:", error);
        // Continue with local results only
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-container">
      <h1 className="ai-title">AI Eco-Product Validation</h1>
      <p className="ai-description">
        Upload a product image and provide details to verify if it meets eco-friendly standards.
        Our AI will analyze the image and information to determine sustainability metrics.
      </p>
      
      {modelLoading && (
        <div className="loading-message">
          <p className="loading-text">
            <svg className="loading-icon" viewBox="0 0 24 24">
              <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading AI model... This may take a moment.
          </p>
        </div>
      )}
      
      <div className="product-info-section">
        <h2 className="section-title">Product Information</h2>
        
        <div className="form-grid">
          <div>
            <label className="form-label">Product Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="form-label">Materials (comma separated)</label>
            <input
              type="text"
              name="materials"
              value={productData.materials.join(', ')}
              onChange={handleArrayInputChange}
              className="form-input"
              placeholder="e.g. bamboo, recycled plastic"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Product Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Enter product description"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label className="form-label">Certifications (comma separated)</label>
          <input
            type="text"
            name="certifications"
            value={productData.certifications.join(', ')}
            onChange={handleArrayInputChange}
            className="form-input"
            placeholder="e.g. FSC, GOTS, Fair Trade"
          />
        </div>
      </div>
      
      <div className="product-info-section">
        <h2 className="section-title">Product Image</h2>
        <p className="ai-description">
          Upload a clear image of the product. The AI works best with well-lit, focused images
          that clearly show the product's materials and features.
        </p>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-input"
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
      
      <div className="text-center">
        <button
          onClick={analyzeImage}
          disabled={!image || !model || isLoading || modelLoading}
          className={`analyze-button ${(!image || !model || isLoading || modelLoading) ? 'analyze-button-disabled' : ''}`}
        >
          {isLoading ? "Analyzing..." : "Analyze Product"}
        </button>
      </div>
      
      {isLoading && (
        <div className="loading-section">
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
        <div className="results-section">
          <h3 className="result-title">Eco-Product Analysis Results</h3>
          
          <div className="eco-score-container">
            <span className={`eco-score ${parseFloat(result.score) >= 4 ? 'eco-score-high' : parseFloat(result.score) >= 2.5 ? 'eco-score-medium' : 'eco-score-low'}`}>
              {result.score}
            </span>
            <span className="confidence-level">
              Eco-Score (Confidence: {result.confidenceLevel})
            </span>
          </div>
          
          <div className="star-rating-container">
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`star-icon ${parseFloat(result.score) >= star ? "eco-score-high" : "eco-score-low"}`}
                >
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              ))}
              <span className="score-text">{result.score}/5</span>
            </div>
          </div>
          
          {result.detectionSummary.length > 0 && (
            <div className="summary-container">
              <p className="summary-title">Analysis results:</p>
              <ul className="summary-list">
                {result.detectionSummary.map((item, index) => (
                  <li key={index} 
                     className={`summary-item ${item.includes("Warning") ? "summary-warning" : "summary-success"}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {result.matchedFeatures.length > 0 && (
            <div className="features-container">
              <p className="features-title">Recognized eco-elements:</p>
              <div className="features-list">
                {result.matchedFeatures.map((feature, index) => (
                  <span key={index} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="conclusion-container">
            <p className="conclusion-text">
              {result.ecoFriendly 
                ? "This product appears to meet eco-friendly standards based on our analysis."
                : "This product may not meet all eco-friendly standards based on our analysis."}
            </p>
          </div>
        </div>
      )}
      
      {allPredictions.length > 0 && (
        <div className="predictions-section">
          <p className="predictions-title">All detected elements:</p>
          <ul className="predictions-list">
            {allPredictions.map((prediction, index) => (
              <li key={index} className={index === 0 ? "prediction-item-primary" : "prediction-item"}>
                <span className="prediction-name">{prediction.className}</span>
                <span className="prediction-probability">
                  {(prediction.probability * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="disclaimer-section">
        <h3 className="disclaimer-title">About AI Validation</h3>
        <p className="disclaimer-text">
          This tool uses machine learning to analyze product images and information to estimate eco-friendliness.
          While our AI model is trained on thousands of sustainable products, results should be considered as
          guidance rather than definitive certification. For official eco-certification, please consult
          recognized certification bodies.
        </p>
      </div>
    </div>
  );
};

export default AIValidationPage;
