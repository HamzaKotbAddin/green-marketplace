import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { ecoProductDictionary, specificProducts, visualIndicators } from "../ecoProductData";
import { aiValidationAPI } from "../services/api";

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
          ecoProductDictionary.materials.plastic_alternatives.some(m => material.toLowerCase().includes(m))
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
      
      // Determine final score and confidence level
      ecoScore = Math.max(0, Math.min(5, ecoScore * 2)); // Scale to 0-5
      
      if (ecoScore >= 3.5) {
        confidenceLevel = "Highly Likely Eco-Friendly";
        ecoFriendly = true;
      } else if (ecoScore >= 2.5) {
        confidenceLevel = "Likely Eco-Friendly";
        ecoFriendly = true;
      } else if (ecoScore >= 1.5) {
        confidenceLevel = "Possibly Eco-Friendly";
        ecoFriendly = false;
      } else {
        confidenceLevel = "Unlikely to be Eco-Friendly";
        ecoFriendly = false;
      }
      
      // Get additional recommendations from API
      try {
        const apiResult = await aiValidationAPI.validateProduct(image, {
          ...productData,
          ecoScore
        });
        
        // Merge recommendations
        if (apiResult.recommendations && apiResult.recommendations.length > 0) {
          apiResult.recommendations.forEach(rec => {
            if (!detectionSummary.includes(rec)) {
              detectionSummary.push(rec);
            }
          });
        }
      } catch (error) {
        console.error("Error getting API recommendations:", error);
      }
      
      // Set the result
      setResult({
        ecoFriendly,
        confidenceLevel,
        score: ecoScore.toFixed(1),
        detectionSummary,
        matchedFeatures: matchedFeatures.join(', ')
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-2">AI Eco-Product Validation</h1>
      <p className="text-gray-600 mb-6">
        Upload a product image and provide details to verify if it meets eco-friendly standards.
        Our AI will analyze the image and information to determine sustainability metrics.
      </p>
      
      {/* Model loading indicator */}
      {modelLoading && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6">
          <p className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading AI model... This may take a moment.
          </p>
        </div>
      )}
      
      {/* Product Information Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Product Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              placeholder="e.g., Bamboo Toothbrush"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Materials (comma separated)</label>
            <input
              type="text"
              name="materials"
              value={productData.materials.join(', ')}
              onChange={handleArrayInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              placeholder="e.g., bamboo, recycled plastic"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Product Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full h-24"
            placeholder="Describe the product and its eco-friendly features..."
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Certifications (comma separated)</label>
          <input
            type="text"
            name="certifications"
            value={productData.certifications.join(', ')}
            onChange={handleArrayInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            placeholder="e.g., Organic, Fair Trade, B Corp"
          />
        </div>
      </div>
      
      {/* Image Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Product Image</h2>
        <p className="text-gray-600 mb-4">
          Upload a clear image of the product. The AI works best with well-lit photos that clearly show the product.
        </p>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border border-gray-300 rounded-lg px-4 py-3 w-full bg-gray-50"
        />
        {imageError && <p className="text-red-600 mt-2">{imageError}</p>}
        
        {image && (
          <div className="mt-4">
            <img 
              ref={imageRef} 
              src={image} 
              alt="Preview" 
              className="w-64 h-auto rounded-lg mx-auto"
              crossOrigin="anonymous"
            />
          </div>
        )}
      </div>
      
      {/* Analysis Button */}
      <div className="text-center mb-6">
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-300"
          onClick={analyzeImage}
          disabled={isLoading || !image || modelLoading}
        >
          {isLoading ? "Analyzing..." : modelLoading ? "Loading AI Model..." : "Analyze Product"}
        </button>
      </div>
      
      {/* Results Section */}
      {isLoading ? (
        <div className="text-center mt-6">
          <div className="animate-pulse flex space-x-4 justify-center">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-4 max-w-md">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : (
        result && (
          <div className="mt-6 p-6 border border-gray-100 rounded-lg bg-gray-50 shadow-md">
            <h3 className="text-2xl font-semibold text-green-700 text-center">Eco-Product Analysis Results</h3>
            
            {/* Results header with icon */}
            <div className="flex items-center justify-center mt-4">
              <span className="text-4xl mr-3">
                {result.ecoFriendly ? "✅" : result.score > 1.5 ? "❓" : "❌"}
              </span>
              <span className="text-xl font-medium">
                {result.confidenceLevel}
              </span>
            </div>
            
            {/* Star rating */}
            <div className="flex items-center justify-center mt-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    className={`w-8 h-8 ${parseFloat(result.score) >= star ? "text-green-500" : "text-gray-300"}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-xl font-medium">{result.score}/5</span>
              </div>
            </div>
            
            {/* Detection summary */}
            {result.detectionSummary && result.detectionSummary.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-100">
                <p className="text-md font-medium text-green-800 mb-3">Analysis results:</p>
                {result.detectionSummary.map((item, index) => (
                  <p key={index} 
                     className={`text-md mb-2 ${item.includes("Warning") ? "text-red-700" : "text-green-700"}`}>
                    • {item}
                  </p>
                ))}
              </div>
            )}
            
            {/* Recognized terms */}
            {result.matchedFeatures && (
              <div className="mt-5 p-4 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-md font-medium text-blue-800 mb-2">Recognized eco-elements:</p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedFeatures.split(', ').map((feature, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 italic">
                Note: This analysis uses AI to detect potential eco-friendly characteristics but 
                should not replace verification from official certifications.
              </p>
            </div>
          </div>
        )
      )}
      
      {/* Show all predictions for debugging */}
      {allPredictions.length > 0 && (
        <div className="mt-8 p-4 text-sm text-gray-500 border-t pt-4 bg-white rounded-lg shadow-md">
          <p className="font-medium text-gray-700">All detected elements:</p>
          <ul className="mt-2 space-y-1">
            {allPredictions.map((pred, index) => (
              <li key={index} className={index === 0 ? "font-medium" : ""}>
                {pred.className}: {(pred.probability * 100).toFixed(1)}%
                {index === 0 && pred.probability > DOMINANT_PREDICTION_THRESHOLD && 
                  " (dominant prediction)"}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* How It Works Section */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">How Our AI Validation Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-green-100 rounded-lg">
            <div className="text-green-600 text-2xl mb-2">1</div>
            <h3 className="font-medium text-lg mb-2">Image Analysis</h3>
            <p className="text-gray-600">
              Our AI uses computer vision to identify materials, packaging, and visual indicators
              of eco-friendly products.
            </p>
          </div>
          
          <div className="p-4 border border-green-100 rounded-lg">
            <div className="text-green-600 text-2xl mb-2">2</div>
            <h3 className="font-medium text-lg mb-2">Data Verification</h3>
            <p className="text-gray-600">
              We cross-reference product information with our database of sustainable materials
              and eco-certifications.
            </p>
          </div>
          
          <div className="p-4 border border-green-100 rounded-lg">
            <div className="text-green-600 text-2xl mb-2">3</div>
            <h3 className="font-medium text-lg mb-2">Eco-Score Calculation</h3>
            <p className="text-gray-600">
              A comprehensive score is generated based on multiple sustainability factors
              and confidence levels.
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-gray-600">
            Our AI validation tool helps consumers make informed choices and assists sellers in
            verifying their products' eco-friendly claims. While our system is continuously improving,
            we recommend using it alongside official certifications for the most accurate assessment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIValidationPage;
