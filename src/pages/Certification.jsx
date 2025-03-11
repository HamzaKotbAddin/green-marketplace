import React, { useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { ecoProductDictionary, specificProducts, visualIndicators } from "../../ecoProductData";

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
    
    // Check materials
    for (const [material, keywords] of Object.entries(ecoProductDictionary.materials)) {
      for (const keyword of keywords) {
        if (term.includes(keyword) || keyword.includes(term)) {
          results.push({
            match: keyword,
            category: material,
            type: "material",
            score: 1.2
          });
        }
      }
    }
    
    // Check features
    for (const [feature, keywords] of Object.entries(ecoProductDictionary.features)) {
      for (const keyword of keywords) {
        if (term.includes(keyword) || keyword.includes(term)) {
          results.push({
            match: keyword,
            category: feature,
            type: "feature",
            score: 1.5
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
          score: 2.0
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
          score: 0.7
        });
      }
    }
    
    // Check negative indicators - with more exact matching
    for (const [category, keywords] of Object.entries(ecoProductDictionary.negative_indicators)) {
      for (const keyword of keywords) {
        // For negative indicators, we want to be more precise with matching
        // Use a more exact match strategy instead of partial includes
        if (
          term === keyword || 
          term.includes(' ' + keyword + ' ') || 
          term.startsWith(keyword + ' ') || 
          term.endsWith(' ' + keyword)
        ) {
          results.push({
            match: keyword,
            category: category,
            type: "negative_indicator",
            score: -1.5 // Negative score to subtract from total
          });
        }
      }
    }
    
    // Check materials
    for (const [material, keywords] of Object.entries(ecoProductDictionary.materials)) {
      for (const keyword of keywords) {
        if (term.includes(keyword) || keyword.includes(term)) {
          results.push({
            match: keyword,
            category: material,
            type: "material",
            score: 1.2
          });
        }
      }
    }
    
    // Check features
    for (const [feature, keywords] of Object.entries(ecoProductDictionary.features)) {
      for (const keyword of keywords) {
        if (term.includes(keyword) || keyword.includes(term)) {
          results.push({
            match: keyword,
            category: feature,
            type: "feature",
            score: 1.5
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
          score: 2.0
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
          score: 0.7
        });
      }
    }
    
    // Check negative indicators (NEW)
    for (const [category, keywords] of Object.entries(ecoProductDictionary.negative_indicators)) {
      for (const keyword of keywords) {
        if (term.includes(keyword) || keyword.includes(term)) {
          results.push({
            match: keyword,
            category: category,
            type: "negative_indicator",
            score: -1.5 // Negative score to subtract from total
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
      // Load MobileNet
      const model = await mobilenet.load({
        version: 2,
        alpha: 1.0
      });
      
      // Get predictions
      const predictions = await model.classify(imageRef.current, 20);
      setAllPredictions(predictions);
      console.log("All predictions:", predictions);

      // Check for dominant non-eco-friendly prediction
      const topPrediction = predictions[0];
      const isTopPredictionDominant = topPrediction.probability > DOMINANT_PREDICTION_THRESHOLD;
      
      // If the top prediction is dominant, check if it's a negative indicator
      let dominantNegativeScore = 0;
      if (isTopPredictionDominant) {
        const topPredText = topPrediction.className.toLowerCase();
        
        // Check if the dominant prediction is a negative indicator
        for (const [category, keywords] of Object.entries(ecoProductDictionary.negative_indicators)) {
          for (const keyword of keywords) {
            if (topPredText.includes(keyword)) {
              dominantNegativeScore -= (topPrediction.probability * 2); // Stronger penalty for dominant negative predictions
              console.log(`Dominant negative prediction detected: ${keyword} (${topPrediction.probability})`);
              break;
            }
          }
          if (dominantNegativeScore < 0) break; // Found a match, no need to check more
        }
      }

      // Enhanced matching logic with context
      let totalScore = dominantNegativeScore; // Start with any penalty from dominant negative prediction
      let matchedFeatures = [];
      let matchDetails = [];
      let detectedCategories = new Set();
      let detectedMaterials = new Set();
      let detectedAttributes = new Set();
      let detectedProducts = new Set();
      let detectedNegatives = new Set();
      
      // First pass: analyze each prediction and split into word tokens
      for (const pred of predictions) {
        const predictionText = pred.className.toLowerCase();
        
        // Check the whole prediction text first
        const wholeTextMatches = analyzeCategory(predictionText);
        for (const match of wholeTextMatches) {
          const weightedScore = match.score * pred.probability;
          
          // For negative indicators, reduce the impact for lower-confidence predictions
          if (match.type === "negative_indicator") {
            // Less impactful if it's not a top prediction
            const adjustedScore = pred.probability > 0.3 ? weightedScore : weightedScore * 0.5;
            totalScore += adjustedScore;
            
            detectedNegatives.add(match.category);
          } else {
            totalScore += weightedScore;
          }
          
          matchDetails.push({
            term: predictionText,
            match: match.match,
            category: match.category,
            type: match.type,
            probability: pred.probability,
            score: weightedScore
          });
          
          // Track what was detected
          if (match.type === "product_category") detectedCategories.add(match.category);
          if (match.type === "material") detectedMaterials.add(match.category);
          if (match.type === "feature") detectedAttributes.add(match.category);
          if (match.type === "exact_match") detectedProducts.add(match.match);
          
          if (!matchedFeatures.includes(predictionText)) {
            matchedFeatures.push(predictionText);
          }
        }
        
        // Split into words and check each
        const words = predictionText.split(/\s+|,|_|-|\(/);
        for (const word of words) {
          if (word.length > 2) { // Ignore very short words
            const wordMatches = analyzeCategory(word);
            for (const match of wordMatches) {
              // Less weight for individual words
              const weightedScore = match.score * pred.probability * 0.7;
              
              if (match.type === "negative_indicator") {
                // Less impactful for individual words
                const adjustedScore = weightedScore * 0.5;
                totalScore += adjustedScore;
                
                detectedNegatives.add(match.category);
              } else {
                totalScore += weightedScore;
              }
              
              matchDetails.push({
                term: predictionText,
                word: word,
                match: match.match,
                category: match.category,
                type: match.type,
                probability: pred.probability,
                score: weightedScore
              });
              
              // Track what was detected
              if (match.type === "product_category") detectedCategories.add(match.category);
              if (match.type === "material") detectedMaterials.add(match.category);
              if (match.type === "feature") detectedAttributes.add(match.category);
              if (match.type === "exact_match") detectedProducts.add(match.match);
              
              if (!matchedFeatures.includes(predictionText)) {
                matchedFeatures.push(predictionText);
              }
            }
          }
        }
      }
      
      // Bonus points for having multiple eco-friendly indicators
      let diversityBonus = 0;
      if (detectedNegatives.size === 0 || totalScore > 0) {
        diversityBonus = (
          detectedCategories.size * 0.1 + 
          detectedMaterials.size * 0.15 + 
          detectedAttributes.size * 0.2 + 
          detectedProducts.size * 0.25
        );
      }
      
      totalScore += diversityBonus;
      
      console.log("Match details:", matchDetails);
      console.log("Categories:", [...detectedCategories]);
      console.log("Materials:", [...detectedMaterials]);
      console.log("Attributes:", [...detectedAttributes]);
      console.log("Products:", [...detectedProducts]);
      console.log("Negatives:", [...detectedNegatives]);
      console.log("Diversity bonus:", diversityBonus);
      console.log("Total score:", totalScore);
      
      // Apply minimum score threshold for eco-friendliness
      if (totalScore < 0.1) totalScore = 0;
      
      // Scale the score to a 5-star rating with improved scaling
      let scaledScore;
      if (totalScore <= 0) {
        scaledScore = 0; // Ensure negative scores become 0
      } else if (totalScore < 0.1) {
        scaledScore = totalScore * 10; // 0-1 stars range
      } else if (totalScore < 0.2) {
        scaledScore = 1 + (totalScore - 0.1) * 15; // 1-2.5 stars range
      } else if (totalScore < 0.3) {
        scaledScore = 2.5 + (totalScore - 0.2) * 10; // 2.5-3.5 stars range
      } else if (totalScore < 0.4) {
        scaledScore = 3.5 + (totalScore - 0.3) * 10; // 3.5-4.5 stars range
      } else {
        scaledScore = 4.5 + Math.min(0.5, (totalScore - 0.4) * 5); // 4.5-5 stars max
      }
      
      // Cap at 5.0
      scaledScore = Math.min(5.0, Math.max(0, scaledScore));
      
      // Apply rating and confidence level
      const ecoConfidenceLevel = 
        scaledScore <= 0.5 ? "Not eco-friendly" :
        scaledScore < 1.5 ? "Probably not eco-friendly" :
        scaledScore < 2.5 ? "Possibly eco-friendly" :
        scaledScore < 3.5 ? "Likely eco-friendly" :
        scaledScore < 4.5 ? "Very likely eco-friendly" :
        "Confirmed eco-friendly";
      
      // Check for negative overrides (if many negative indicators are present, override high scores)
      if (detectedNegatives.size > 1 && scaledScore > 3.0) {
        scaledScore = Math.min(scaledScore, 3.0);
      }
      
      // Prepare detection summary
      const detectionSummary = [];
      if (detectedProducts.size > 0) {
        detectionSummary.push(`Products: ${[...detectedProducts].join(', ')}`);
      }
      if (detectedCategories.size > 0) {
        detectionSummary.push(`Categories: ${[...detectedCategories].map(c => c.replace('_', ' ')).join(', ')}`);
      }
      if (detectedMaterials.size > 0) {
        detectionSummary.push(`Materials: ${[...detectedMaterials].map(m => m.replace('_', ' ')).join(', ')}`);
      }
      if (detectedAttributes.size > 0) {
        detectionSummary.push(`Features: ${[...detectedAttributes].map(a => a.replace('_', ' ')).join(', ')}`);
      }

      
      setResult({
        ecoFriendly: scaledScore >= 2.5,
        score: scaledScore.toFixed(1),
        confidenceLevel: ecoConfidenceLevel,
        detectionSummary: detectionSummary,
        matchedFeatures: matchedFeatures.join(", "),
        rawScore: totalScore,
        matchDetails: matchDetails,
        keyFindings: {
          categories: [...detectedCategories],
          materials: [...detectedMaterials],
          attributes: [...detectedAttributes],
          products: [...detectedProducts],
          negatives: [...detectedNegatives]
        }
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      setImageError("Failed to analyze the image. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Eco-Product Detector</h2>
      <p className="text-gray-600 mb-6">
        Upload a product image to verify if it's an eco-friendly product.
      </p>

      {/* File Upload */}
      <div className="mb-6">
        <input
          id="file-upload"
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
          disabled={isLoading || !image}
        >
          {isLoading ? "Analyzing..." : "Analyze Product"}
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
          <div className="mt-6 p-4 border border-gray-100 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-green-700">Eco-Product Analysis</h3>
            
            {/* Results header with icon */}
            <div className="flex items-center justify-center mt-2">
              <span className="text-2xl mr-2">
                {result.ecoFriendly ? "✅" : result.score > 1.5 ? "❓" : "❌"}
              </span>
              <span className="text-lg font-medium">
                {result.confidenceLevel}
              </span>
            </div>
            
            {/* Star rating */}
            <div className="flex items-center justify-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    className={`w-6 h-6 ${parseFloat(result.score) >= star ? "text-green-500" : "text-gray-300"}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-lg">{result.score}/5</span>
              </div>
            </div>
            
            {/* Detection summary */}
            {result.detectionSummary && result.detectionSummary.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-md">
                <p className="text-sm font-medium text-green-800 mb-2">Analysis results:</p>
                {result.detectionSummary.map((item, index) => (
                  <p key={index} 
                     className={`text-sm mb-1 ${item.includes("Warning") ? "text-red-700" : "text-green-700"}`}>
                    {item}
                  </p>
                ))}
              </div>
            )}
            
            {/* Recognized terms */}
            {result.matchedFeatures && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">Recognized elements:</p>
                <p className="text-sm text-gray-600">{result.matchedFeatures}</p>
              </div>
            )}
            
            <div className="mt-4">
              <p className="text-xs text-gray-500 italic">
                Note: This analysis uses AI to detect potential eco-friendly characteristics but 
                should not replace verification from official certifications.
              </p>
            </div>
          </div>
        )
      )}

      {/* Show all predictions for debugging */}
      {allPredictions.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 border-t pt-4">
          <p className="font-medium">All detected elements:</p>
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
    </div>
  );
};

export default Certification;