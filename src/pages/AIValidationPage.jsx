// Analyze whether a term relates to a product category - more exact matching
const AIValidationPage = (term) => {
  term = term.toLowerCase();
  const results = [];

  // Check product categories with exact match or contained phrase
  for (const [category, keywords] of Object.entries(
    ecoProductDictionary.categories
  )) {
    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      if (term === keywordLower || term.includes(keywordLower)) {
        results.push({
          match: keyword,
          category: category,
          type: "product_category",
          score: term === keywordLower ? 1.0 : 0.8, // Exact match gets higher score
        });
      }
    }
  }

  return results;
};

// Analyze whether a term relates to sustainable materials - stricter matching
const analyzeMaterials = (term) => {
  term = term.toLowerCase();
  const results = [];

  // Check all material categories
  for (const [materialType, materials] of Object.entries(
    ecoProductDictionary.materials
  )) {
    for (const material of materials) {
      const materialLower = material.toLowerCase();
      // More exact matching for materials
      if (
        term === materialLower ||
        term.includes(materialLower) ||
        (materialLower.length > 5 && materialLower.includes(term))
      ) {
        // Calculate match quality
        let matchScore = 0.7;
        if (term === materialLower) matchScore = 1.0; // Exact match
        else if (term.includes(materialLower)) matchScore = 0.9; // Contains the full material name

        results.push({
          match: material,
          category: materialType,
          type: "material",
          score: matchScore,
        });
      }
    }
  }

  return results;
};

// Analyze whether a term relates to eco-friendly features or certifications - more exact matching
const analyzeFeatures = (term) => {
  term = term.toLowerCase();
  const results = [];

  // Check all feature categories with more precise matching
  for (const [featureType, features] of Object.entries(
    ecoProductDictionary.features
  )) {
    for (const feature of features) {
      const featureLower = feature.toLowerCase();

      // For certifications, require more exact matches
      if (featureType === "certifications") {
        if (
          term === featureLower ||
          term.includes(featureLower) ||
          (featureLower.includes("certified") &&
            term.includes(featureLower.replace(" certified", "")))
        ) {
          let matchScore = 0.7;
          if (term === featureLower) matchScore = 1.0; // Exact match

          results.push({
            match: feature,
            category: featureType,
            type: "feature",
            score: matchScore,
          });
        }
      }
      // For product attributes, allow more flexibility
      else {
        if (
          term === featureLower ||
          term.includes(featureLower) ||
          featureLower.includes(term)
        ) {
          let matchScore = 0.7;
          if (term === featureLower) matchScore = 1.0; // Exact match
          else if (term.includes(featureLower)) matchScore = 0.9; // Contains the full feature

          results.push({
            match: feature,
            category: featureType,
            type: "feature",
            score: matchScore,
          });
        }
      }
    }
  }

  return results;
};

// Check if a term indicates a non-eco product with stricter matching
const checkNegativeIndicators = (term) => {
  term = term.toLowerCase();
  const results = [];

  // Check all negative indicator categories
  for (const [indicatorType, indicators] of Object.entries(
    ecoProductDictionary.negative_indicators
  )) {
    for (const indicator of indicators) {
      const indicatorLower = indicator.toLowerCase();

      // More exact matching for negative indicators
      if (
        term === indicatorLower ||
        term.includes(indicatorLower) ||
        (indicatorLower.length > 5 && indicatorLower.includes(term))
      ) {
        let matchScore = 0.7;
        if (term === indicatorLower) matchScore = 1.0; // Exact match

        results.push({
          match: indicator,
          category: indicatorType,
          type: "negative_indicator",
          score: matchScore,
        });
      }
    }
  }

  return results;
};

// Check if a term matches a specific eco-friendly product with exact matching
const checkSpecificProducts = (term) => {
  term = term.toLowerCase();
  const results = [];

  for (const product of specificProducts) {
    const productLower = product.toLowerCase();

    // Require more exact matches for specific products
    if (term === productLower || term.includes(productLower)) {
      let matchScore = 0.8;
      if (term === productLower) matchScore = 1.0; // Exact match

      results.push({
        match: product,
        type: "specific_product",
        score: matchScore,
      });
    }
  }

  return results;
};

// Check if a term matches a visual indicator with more specific matching
const checkVisualIndicators = (term) => {
  term = term.toLowerCase();
  const results = [];

  for (const indicator of visualIndicators) {
    const indicatorLower = indicator.toLowerCase();

    // More precise matching for visual indicators
    if (term === indicatorLower || term.includes(indicatorLower)) {
      let matchScore = 0.7;
      if (term === indicatorLower) matchScore = 1.0; // Exact match

      results.push({
        match: indicator,
        type: "visual_indicator",
        score: matchScore,
      });
    }
  }

  return results;
};

export default AIValidationPage;
