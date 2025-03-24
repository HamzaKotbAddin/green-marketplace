import axios from 'axios';
import { db } from '../firebase-config';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit
} from 'firebase/firestore';

// Firebase collections
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const REQUESTS_COLLECTION = 'productRequests';
const REVIEWS_COLLECTION = 'reviews';

// Product API
export const productAPI = {
  // Get all products
  getAllProducts: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  },
  
  // Get product by ID
  getProductById: async (productId) => {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Error getting product:", error);
      throw error;
    }
  },
  
  // Add new product
  addProduct: async (productData, userId) => {
    try {
      const productWithMeta = {
        ...productData,
        sellerId: userId,
        createdAt: new Date().toISOString(),
        approved: false
      };
      
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productWithMeta);
      
      // Create a product request for admin approval
      await addDoc(collection(db, REQUESTS_COLLECTION), {
        productId: docRef.id,
        sellerId: userId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        productData: productWithMeta
      });
      
      return {
        id: docRef.id,
        ...productWithMeta
      };
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },
  
  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, productId);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: new Date().toISOString()
      });
      
      return {
        id: productId,
        ...productData
      };
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },
  
  // Delete product
  deleteProduct: async (productId) => {
    try {
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
  
  // Get products by seller ID
  getProductsBySeller: async (sellerId) => {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where("sellerId", "==", sellerId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting seller products:", error);
      throw error;
    }
  },
  
  // Get products by eco-filter
  getProductsByEcoFilter: async (filterType, filterValue) => {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where(`ecoAttributes.${filterType}`, "array-contains", filterValue),
        where("approved", "==", true)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error filtering products:", error);
      throw error;
    }
  }
};

// Order API
export const orderAPI = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, ORDERS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting orders:", error);
      throw error;
    }
  },
  
  // Get orders by user ID
  getOrdersByUser: async (userId) => {
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting user orders:", error);
      throw error;
    }
  },
  
  // Get orders by seller ID
  getOrdersBySeller: async (sellerId) => {
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where("sellerId", "==", sellerId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting seller orders:", error);
      throw error;
    }
  },
  
  // Create new order
  createOrder: async (orderData) => {
    try {
      const orderWithMeta = {
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderWithMeta);
      
      return {
        id: docRef.id,
        ...orderWithMeta
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
  
  // Update order status
  updateOrderStatus: async (orderId, status, reason = null) => {
    try {
      const updateData = {
        status: status,
        updatedAt: new Date().toISOString()
      };
      
      if (reason) {
        updateData.statusReason = reason;
      }
      
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(docRef, updateData);
      
      return { success: true };
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }
};

// Product Request API
export const requestAPI = {
  // Get all product requests
  getAllRequests: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, REQUESTS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting product requests:", error);
      throw error;
    }
  },
  
  // Get requests by seller ID
  getRequestsBySeller: async (sellerId) => {
    try {
      const q = query(
        collection(db, REQUESTS_COLLECTION),
        where("sellerId", "==", sellerId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting seller requests:", error);
      throw error;
    }
  },
  
  // Approve product request
  approveRequest: async (requestId, productId) => {
    try {
      // Update request status
      const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
      await updateDoc(requestRef, {
        status: 'approved',
        updatedAt: new Date().toISOString()
      });
      
      // Update product approval status
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await updateDoc(productRef, {
        approved: true,
        updatedAt: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error approving request:", error);
      throw error;
    }
  },
  
  // Reject product request
  rejectRequest: async (requestId, productId, reason) => {
    try {
      // Update request status
      const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
      await updateDoc(requestRef, {
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error rejecting request:", error);
      throw error;
    }
  }
};

// AI Validation API
export const aiValidationAPI = {
  // Validate product using Google Vision API
  validateProduct: async (imageUrl, productData) => {
    try {
      // In a real implementation, this would call the Google Vision API
      // For now, we'll simulate the API call
      
      // This would be replaced with actual API call in production
      // const response = await axios.post('https://vision.googleapis.com/v1/images:annotate', {
      //   requests: [
      //     {
      //       image: { source: { imageUri: imageUrl } },
      //       features: [{ type: 'LABEL_DETECTION', maxResults: 10 }]
      //     }
      //   ]
      // }, {
      //   headers: {
      //     'Authorization': `Bearer ${process.env.GOOGLE_VISION_API_KEY}`
      //   }
      // });
      
      // For now, simulate a response based on the product data
      const simulatedLabels = simulateVisionAPIResponse(productData);
      
      return {
        isEcoFriendly: determineIfEcoFriendly(simulatedLabels, productData),
        confidence: calculateConfidenceScore(simulatedLabels, productData),
        detectedLabels: simulatedLabels,
        recommendations: generateRecommendations(simulatedLabels, productData)
      };
    } catch (error) {
      console.error("Error validating product:", error);
      throw error;
    }
  }
};

// Helper functions for AI validation
function simulateVisionAPIResponse(productData) {
  // This function simulates what Google Vision API might return
  // In a real implementation, this would be replaced with actual API call
  
  const possibleLabels = [
    "product", "packaging", "eco-friendly", "sustainable", "green",
    "recycled", "organic", "natural", "biodegradable", "plastic",
    "glass", "metal", "paper", "cardboard", "wood", "bamboo",
    "cotton", "plant-based", "vegan", "cruelty-free"
  ];
  
  // Extract keywords from product data
  const keywords = [
    productData.name,
    productData.category,
    ...(productData.tags || []),
    ...(productData.materials || [])
  ].filter(Boolean);
  
  // Generate simulated labels based on product data
  const simulatedLabels = [];
  
  // Add some labels from the product data
  keywords.forEach(keyword => {
    if (Math.random() > 0.3) { // 70% chance to include
      simulatedLabels.push({
        description: keyword.toLowerCase(),
        score: 0.7 + (Math.random() * 0.3) // Score between 0.7 and 1.0
      });
    }
  });
  
  // Add some random labels
  for (let i = 0; i < 5; i++) {
    const randomLabel = possibleLabels[Math.floor(Math.random() * possibleLabels.length)];
    if (!simulatedLabels.some(label => label.description === randomLabel)) {
      simulatedLabels.push({
        description: randomLabel,
        score: 0.5 + (Math.random() * 0.5) // Score between 0.5 and 1.0
      });
    }
  }
  
  return simulatedLabels;
}

function determineIfEcoFriendly(labels, productData) {
  // Count eco-friendly indicators in labels
  const ecoFriendlyTerms = [
    "eco-friendly", "sustainable", "green", "recycled", "organic",
    "natural", "biodegradable", "compostable", "reusable", "renewable",
    "bamboo", "plant-based", "vegan", "cruelty-free"
  ];
  
  const nonEcoTerms = [
    "plastic", "disposable", "single-use", "synthetic", "petroleum"
  ];
  
  let ecoScore = 0;
  
  // Check labels for eco-friendly terms
  labels.forEach(label => {
    if (ecoFriendlyTerms.some(term => label.description.includes(term))) {
      ecoScore += label.score;
    }
    if (nonEcoTerms.some(term => label.description.includes(term))) {
      ecoScore -= label.score;
    }
  });
  
  // Check product data for eco-friendly indicators
  if (productData.ecoScore) ecoScore += productData.ecoScore / 5; // Assuming ecoScore is 0-5
  if (productData.certifications && productData.certifications.length) {
    ecoScore += productData.certifications.length * 0.2;
  }
  
  return ecoScore > 0.5;
}

function calculateConfidenceScore(labels, productData) {
  // Calculate confidence based on label scores and product data
  const relevantLabels = labels.filter(label => label.score > 0.7);
  
  if (relevantLabels.length < 3) return 0.5; // Low confidence if few high-scoring labels
  
  // Average the scores of relevant labels
  const avgScore = relevantLabels.reduce((sum, label) => sum + label.score, 0) / relevantLabels.length;
  
  // Adjust based on product data completeness
  let dataCompletenessBonus = 0;
  if (productData.materials) dataCompletenessBonus += 0.1;
  if (productData.certifications) dataCompletenessBonus += 0.1;
  if (productData.ecoScore) dataCompletenessBonus += 0.1;
  
  return Math.min(0.95, avgScore + dataCompletenessBonus);
}

function generateRecommendations(labels, productData) {
  const recommendations = [];
  
  // Check for missing eco certifications
  if (!productData.certifications || productData.certifications.length < 2) {
    recommendations.push("Consider adding eco-certifications to improve product credibility");
  }
  
  // Check for sustainable materials
  const sustainableMaterials = ["bamboo", "recycled", "organic", "biodegradable"];
  const hasSustainableMaterial = labels.some(label => 
    sustainableMaterials.some(material => label.description.includes(material))
  );
  
  if (!hasSustainableMaterial) {
    recommendations.push("Consider using more sustainable materials in your product");
  }
  
  // Check for packaging information
  const hasPackagingInfo = labels.some(label => label.description.includes("packaging"));
  if (!hasPackagingInfo) {
    recommendations.push("Add information about eco-friendly packaging");
  }
  
  // Add generic recommendation if list is empty
  if (recommendations.length === 0) {
    recommendations.push("Your product appears to meet eco-friendly standards");
  }
  
  return recommendations;
}
