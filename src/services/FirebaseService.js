import { 
  auth, 
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  usersCollection,
  productsCollection,
  ordersCollection,
  cartCollection,
  userDataCollection,
  anonymousCollection
} from '../firebase-config';

// User Authentication Services
export const authService = {
  // Register a new user with email and password
  registerWithEmail: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        email,
        role: 'user', // Default role
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Login with email and password
  loginWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Login with Google
  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      // If user doesn't exist, create a new user profile
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'user', // Default role
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },
  
  // Get user role
  getUserRole: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().role;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }
};

// Product Services
export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const querySnapshot = await getDocs(productsCollection);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Get product by ID
  getProductById: async (productId) => {
    try {
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        return { success: true, product: { id: productDoc.id, ...productDoc.data() } };
      } else {
        return { success: false, error: 'Product not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Add new product (for sellers and admins)
  addProduct: async (productData, userId) => {
    try {
      // Add seller ID to product data
      const newProduct = {
        ...productData,
        sellerId: userId,
        approved: false, // Requires admin approval unless added by admin
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Check if user is admin
      const userRole = await authService.getUserRole(userId);
      if (userRole === 'admin') {
        newProduct.approved = true; // Auto-approve if added by admin
      }
      
      const docRef = await addDoc(productsCollection, newProduct);
      return { success: true, productId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Delete product
  deleteProduct: async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Get products by seller ID
  getProductsBySeller: async (sellerId) => {
    try {
      const q = query(productsCollection, where("sellerId", "==", sellerId));
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Get products pending approval
  getPendingProducts: async () => {
    try {
      const q = query(productsCollection, where("approved", "==", false));
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Approve product (admin only)
  approveProduct: async (productId, approved, rejectionReason = null) => {
    try {
      const productRef = doc(db, 'products', productId);
      const updateData = {
        approved,
        updatedAt: new Date()
      };
      
      if (!approved && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
      
      await updateDoc(productRef, updateData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Cart Services
export const cartService = {
  // Get user cart
  getUserCart: async (userId) => {
    try {
      const cartDoc = await getDoc(doc(db, 'carts', userId));
      if (cartDoc.exists()) {
        return { success: true, cart: cartDoc.data().items || [] };
      } else {
        // Create empty cart if it doesn't exist
        await setDoc(doc(db, 'carts', userId), { items: [], updatedAt: new Date() });
        return { success: true, cart: [] };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Add item to cart
  addToCart: async (userId, product, quantity = 1) => {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartRef);
      
      let items = [];
      if (cartDoc.exists()) {
        items = cartDoc.data().items || [];
      }
      
      // Check if product already exists in cart
      const existingItemIndex = items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        items[existingItemIndex].quantity = (items[existingItemIndex].quantity || 1) + quantity;
      } else {
        // Add new item if product doesn't exist
        items.push({ ...product, quantity });
      }
      
      await setDoc(cartRef, { items, updatedAt: new Date() });
      return { success: true, cart: items };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Remove item from cart
  removeFromCart: async (userId, productId) => {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartRef);
      
      if (!cartDoc.exists()) {
        return { success: false, error: 'Cart not found' };
      }
      
      const items = cartDoc.data().items || [];
      const updatedItems = items.filter(item => item.id !== productId);
      
      await updateDoc(cartRef, { items: updatedItems, updatedAt: new Date() });
      return { success: true, cart: updatedItems };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Update item quantity in cart
  updateCartItemQuantity: async (userId, productId, quantity) => {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartRef);
      
      if (!cartDoc.exists()) {
        return { success: false, error: 'Cart not found' };
      }
      
      const items = cartDoc.data().items || [];
      const itemIndex = items.findIndex(item => item.id === productId);
      
      if (itemIndex === -1) {
        return { success: false, error: 'Item not found in cart' };
      }
      
      items[itemIndex].quantity = quantity;
      
      await updateDoc(cartRef, { items, updatedAt: new Date() });
      return { success: true, cart: items };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Clear cart
  clearCart: async (userId) => {
    try {
      const cartRef = doc(db, 'carts', userId);
      await updateDoc(cartRef, { items: [], updatedAt: new Date() });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Order Services
export const orderService = {
  // Create new order
  createOrder: async (userId, cartItems, shippingInfo, paymentInfo) => {
    try {
      // Calculate order total
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Create order document
      const orderData = {
        userId,
        items: cartItems,
        shippingInfo,
        paymentInfo,
        total,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const orderRef = await addDoc(ordersCollection, orderData);
      
      // Clear user's cart after successful order
      await cartService.clearCart(userId);
      
      return { success: true, orderId: orderRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Get user orders
  getUserOrders: async (userId) => {
    try {
      const q = query(ordersCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, orders };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        return { success: true, order: { id: orderDoc.id, ...orderDoc.data() } };
      } else {
        return { success: false, error: 'Order not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Update order status (for admins)
  updateOrderStatus: async (orderId, status) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status, 
        updatedAt: new Date() 
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Get seller orders (orders containing products from a specific seller)
  getSellerOrders: async (sellerId) => {
    try {
      // This is more complex in NoSQL and requires a different approach
      // First get all orders
      const querySnapshot = await getDocs(ordersCollection);
      const orders = [];
      
      // Filter orders that contain products from this seller
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        const sellerItems = orderData.items.filter(item => item.sellerId === sellerId);
        
        if (sellerItems.length > 0) {
          // Create a seller-specific view of the order
          orders.push({
            id: doc.id,
            userId: orderData.userId,
            items: sellerItems, // Only include items from this seller
            status: orderData.status,
            createdAt: orderData.createdAt,
            updatedAt: orderData.updatedAt,
            // Calculate total for just this seller's items
            total: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          });
        }
      });
      
      return { success: true, orders };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: 'cancelled', 
        updatedAt: new Date() 
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// User Data Services
export const userDataService = {
  // Get user data
  getUserData: async (userId) => {
    try {
      const userDataDoc = await getDoc(doc(db, 'userData', userId));
      if (userDataDoc.exists()) {
        return { success: true, userData: userDataDoc.data() };
      } else {
        // Create empty user data if it doesn't exist
        const initialData = {
          cart: [],
          currentPage: 'home',
          isAnonymous: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await setDoc(doc(db, 'userData', userId), initialData);
        return { success: true, userData: initialData };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Update user data
  updateUserData: async (userId, data) => {
    try {
      const userDataRef = doc(db, 'userData', userId);
      await updateDoc(userDataRef, {
        ...data,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Set up real-time listener for user data
  onUserDataChange: (userId, callback) => {
    const userDataRef = doc(db, 'userData', userId);
    return onSnapshot(userDataRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        callback(null);
      }
    });
  },
  
  // Transfer anonymous user data to authenticated user
  transferAnonymousData: async (anonymousId, authenticatedId) => {
    try {
      // Get anonymous user data
      const anonymousDataDoc = await getDoc(doc(db, 'userData', anonymousId));
      
      if (anonymousDataDoc.exists()) {
        const anonymousData = anonymousDataDoc.data();
        
        // Set authenticated user data
        await setDoc(doc(db, 'userData', authenticatedId), {
          cart: anonymousData.cart || [],
          currentPage: anonymousData.currentPage || 'home',
          isAnonymous: false,
          lastUpdated: new Date()
        });
        
        // Optionally delete anonymous data
        await deleteDoc(doc(db, 'userData', anonymousId));
        
        return { success: true };
      } else {
        return { success: false, error: 'Anonymous data not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Anonymous User Services
export const anonymousService = {
  // Create anonymous user
  createAnonymousUser: async () => {
    try {
      const anonymousRef = await addDoc(anonymousCollection, {
        createdAt: new Date()
      });
      
      // Initialize empty user data for anonymous user
      await setDoc(doc(db, 'userData', anonymousRef.id), {
        cart: [],
        currentPage: 'home',
        isAnonymous: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return { success: true, anonymousId: anonymousRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
