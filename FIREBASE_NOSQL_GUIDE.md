# Firebase NoSQL Integration Guide for Green Marketplace

This guide explains how the Firebase NoSQL database is structured and implemented in the Green Marketplace application. It provides details on collections, documents, and how to interact with the database.

## Database Structure

The Green Marketplace application uses Firebase Firestore, a NoSQL document database. The database is organized into the following collections:

### Collections

1. **users** - Stores user account information
2. **userData** - Stores user preferences and state
3. **products** - Stores product listings
4. **carts** - Stores user shopping carts
5. **orders** - Stores order information
6. **anonymous** - Stores anonymous user sessions

## Collection Details

### Users Collection

Each document in the `users` collection represents a registered user.

**Document ID**: User's UID from Firebase Authentication
**Fields**:
- `email` (string): User's email address
- `displayName` (string): User's display name
- `photoURL` (string, optional): URL to user's profile photo
- `role` (string): User role - "user", "seller", or "admin"
- `createdAt` (timestamp): When the user account was created
- `updatedAt` (timestamp): When the user account was last updated

Example:
```javascript
{
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://example.com/profile.jpg",
  "role": "user",
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### UserData Collection

Each document in the `userData` collection stores user preferences and state.

**Document ID**: User's UID (same as in users collection)
**Fields**:
- `cart` (array): User's shopping cart items
- `currentPage` (string): Current page the user is viewing
- `isAnonymous` (boolean): Whether this is an anonymous user
- `createdAt` (timestamp): When the user data was created
- `updatedAt` (timestamp): When the user data was last updated

Example:
```javascript
{
  "cart": [
    {
      "id": "product123",
      "name": "Eco-friendly Water Bottle",
      "price": 19.99,
      "quantity": 2
    }
  ],
  "currentPage": "products",
  "isAnonymous": false,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### Products Collection

Each document in the `products` collection represents a product listing.

**Document ID**: Auto-generated
**Fields**:
- `name` (string): Product name
- `description` (string): Product description
- `price` (number): Product price
- `imageUrl` (string): URL to product image
- `category` (string): Product category
- `sellerId` (string): UID of the seller who listed the product
- `ecoScore` (number): Environmental score (1-5)
- `sustainabilityFeatures` (array): List of sustainability features
- `certifications` (array): List of eco certifications
- `approved` (boolean): Whether the product is approved by admin
- `rejectionReason` (string, optional): Reason for rejection if not approved
- `createdAt` (timestamp): When the product was created
- `updatedAt` (timestamp): When the product was last updated

Example:
```javascript
{
  "name": "Eco-friendly Water Bottle",
  "description": "Reusable stainless steel water bottle",
  "price": 19.99,
  "imageUrl": "https://example.com/bottle.jpg",
  "category": "zero-waste",
  "sellerId": "seller123",
  "ecoScore": 4,
  "sustainabilityFeatures": ["Plastic-free", "Reusable", "Recyclable"],
  "certifications": ["B Corp"],
  "approved": true,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### Carts Collection

Each document in the `carts` collection represents a user's shopping cart.

**Document ID**: User's UID
**Fields**:
- `items` (array): Array of cart items
- `updatedAt` (timestamp): When the cart was last updated

Example:
```javascript
{
  "items": [
    {
      "id": "product123",
      "name": "Eco-friendly Water Bottle",
      "price": 19.99,
      "quantity": 2,
      "sellerId": "seller123"
    }
  ],
  "updatedAt": Timestamp
}
```

### Orders Collection

Each document in the `orders` collection represents a completed order.

**Document ID**: Auto-generated
**Fields**:
- `userId` (string): UID of the user who placed the order
- `items` (array): Array of ordered items
- `shippingInfo` (object): Shipping information
- `paymentInfo` (object): Payment information
- `total` (number): Order total
- `status` (string): Order status ("pending", "shipped", "delivered", "cancelled")
- `createdAt` (timestamp): When the order was created
- `updatedAt` (timestamp): When the order was last updated

Example:
```javascript
{
  "userId": "user123",
  "items": [
    {
      "id": "product123",
      "name": "Eco-friendly Water Bottle",
      "price": 19.99,
      "quantity": 2,
      "sellerId": "seller123"
    }
  ],
  "shippingInfo": {
    "address": "123 Green St",
    "city": "Ecoville",
    "state": "CA",
    "zip": "12345",
    "country": "USA"
  },
  "paymentInfo": {
    "method": "credit_card",
    "last4": "1234"
  },
  "total": 39.98,
  "status": "pending",
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### Anonymous Collection

Each document in the `anonymous` collection represents an anonymous user session.

**Document ID**: Auto-generated
**Fields**:
- `createdAt` (timestamp): When the anonymous session was created

Example:
```javascript
{
  "createdAt": Timestamp
}
```

## Firebase Service Modules

The application uses several service modules to interact with Firebase:

1. **authService** - Handles user authentication
2. **productService** - Manages product listings
3. **cartService** - Manages shopping carts
4. **orderService** - Handles order processing
5. **userDataService** - Manages user data and preferences
6. **anonymousService** - Handles anonymous user sessions

## How to Use Firebase Services

### Authentication

```javascript
import { authService } from './services/FirebaseService';

// Register a new user
const registerUser = async (email, password, userData) => {
  const result = await authService.registerWithEmail(email, password, userData);
  if (result.success) {
    console.log('User registered:', result.user);
  } else {
    console.error('Registration error:', result.error);
  }
};

// Login with email and password
const loginUser = async (email, password) => {
  const result = await authService.loginWithEmail(email, password);
  if (result.success) {
    console.log('User logged in:', result.user);
  } else {
    console.error('Login error:', result.error);
  }
};

// Login with Google
const loginWithGoogle = async () => {
  const result = await authService.loginWithGoogle();
  if (result.success) {
    console.log('User logged in with Google:', result.user);
  } else {
    console.error('Google login error:', result.error);
  }
};

// Logout
const logoutUser = async () => {
  const result = await authService.logout();
  if (result.success) {
    console.log('User logged out');
  } else {
    console.error('Logout error:', result.error);
  }
};
```

### Products

```javascript
import { productService } from './services/FirebaseService';

// Get all products
const getAllProducts = async () => {
  const result = await productService.getAllProducts();
  if (result.success) {
    console.log('Products:', result.products);
  } else {
    console.error('Error getting products:', result.error);
  }
};

// Get product by ID
const getProduct = async (productId) => {
  const result = await productService.getProductById(productId);
  if (result.success) {
    console.log('Product:', result.product);
  } else {
    console.error('Error getting product:', result.error);
  }
};

// Add a new product (for sellers)
const addProduct = async (productData, userId) => {
  const result = await productService.addProduct(productData, userId);
  if (result.success) {
    console.log('Product added with ID:', result.productId);
  } else {
    console.error('Error adding product:', result.error);
  }
};

// Update a product
const updateProduct = async (productId, productData) => {
  const result = await productService.updateProduct(productId, productData);
  if (result.success) {
    console.log('Product updated');
  } else {
    console.error('Error updating product:', result.error);
  }
};

// Delete a product
const deleteProduct = async (productId) => {
  const result = await productService.deleteProduct(productId);
  if (result.success) {
    console.log('Product deleted');
  } else {
    console.error('Error deleting product:', result.error);
  }
};

// Get products by seller
const getSellerProducts = async (sellerId) => {
  const result = await productService.getProductsBySeller(sellerId);
  if (result.success) {
    console.log('Seller products:', result.products);
  } else {
    console.error('Error getting seller products:', result.error);
  }
};

// Get products pending approval (admin only)
const getPendingProducts = async () => {
  const result = await productService.getPendingProducts();
  if (result.success) {
    console.log('Pending products:', result.products);
  } else {
    console.error('Error getting pending products:', result.error);
  }
};

// Approve or reject a product (admin only)
const approveProduct = async (productId, approved, rejectionReason) => {
  const result = await productService.approveProduct(productId, approved, rejectionReason);
  if (result.success) {
    console.log('Product approval updated');
  } else {
    console.error('Error updating product approval:', result.error);
  }
};
```

### Shopping Cart

```javascript
import { cartService } from './services/FirebaseService';

// Get user's cart
const getUserCart = async (userId) => {
  const result = await cartService.getUserCart(userId);
  if (result.success) {
    console.log('User cart:', result.cart);
  } else {
    console.error('Error getting cart:', result.error);
  }
};

// Add item to cart
const addToCart = async (userId, product, quantity) => {
  const result = await cartService.addToCart(userId, product, quantity);
  if (result.success) {
    console.log('Updated cart:', result.cart);
  } else {
    console.error('Error adding to cart:', result.error);
  }
};

// Remove item from cart
const removeFromCart = async (userId, productId) => {
  const result = await cartService.removeFromCart(userId, productId);
  if (result.success) {
    console.log('Updated cart:', result.cart);
  } else {
    console.error('Error removing from cart:', result.error);
  }
};

// Update item quantity
const updateQuantity = async (userId, productId, quantity) => {
  const result = await cartService.updateCartItemQuantity(userId, productId, quantity);
  if (result.success) {
    console.log('Updated cart:', result.cart);
  } else {
    console.error('Error updating quantity:', result.error);
  }
};

// Clear cart
const clearCart = async (userId) => {
  const result = await cartService.clearCart(userId);
  if (result.success) {
    console.log('Cart cleared');
  } else {
    console.error('Error clearing cart:', result.error);
  }
};
```

### Orders

```javascript
import { orderService } from './services/FirebaseService';

// Create a new order
const createOrder = async (userId, cartItems, shippingInfo, paymentInfo) => {
  const result = await orderService.createOrder(userId, cartItems, shippingInfo, paymentInfo);
  if (result.success) {
    console.log('Order created with ID:', result.orderId);
  } else {
    console.error('Error creating order:', result.error);
  }
};

// Get user's orders
const getUserOrders = async (userId) => {
  const result = await orderService.getUserOrders(userId);
  if (result.success) {
    console.log('User orders:', result.orders);
  } else {
    console.error('Error getting orders:', result.error);
  }
};

// Get order by ID
const getOrder = async (orderId) => {
  const result = await orderService.getOrderById(orderId);
  if (result.success) {
    console.log('Order:', result.order);
  } else {
    console.error('Error getting order:', result.error);
  }
};

// Update order status (admin only)
const updateOrderStatus = async (orderId, status) => {
  const result = await orderService.updateOrderStatus(orderId, status);
  if (result.success) {
    console.log('Order status updated');
  } else {
    console.error('Error updating order status:', result.error);
  }
};

// Get seller's orders
const getSellerOrders = async (sellerId) => {
  const result = await orderService.getSellerOrders(sellerId);
  if (result.success) {
    console.log('Seller orders:', result.orders);
  } else {
    console.error('Error getting seller orders:', result.error);
  }
};

// Cancel an order
const cancelOrder = async (orderId) => {
  const result = await orderService.cancelOrder(orderId);
  if (result.success) {
    console.log('Order cancelled');
  } else {
    console.error('Error cancelling order:', result.error);
  }
};
```

### User Data

```javascript
import { userDataService } from './services/FirebaseService';

// Get user data
const getUserData = async (userId) => {
  const result = await userDataService.getUserData(userId);
  if (result.success) {
    console.log('User data:', result.userData);
  } else {
    console.error('Error getting user data:', result.error);
  }
};

// Update user data
const updateUserData = async (userId, data) => {
  const result = await userDataService.updateUserData(userId, data);
  if (result.success) {
    console.log('User data updated');
  } else {
    console.error('Error updating user data:', result.error);
  }
};

// Set up real-time listener for user data
const listenToUserData = (userId) => {
  const unsubscribe = userDataService.onUserDataChange(userId, (userData) => {
    if (userData) {
      console.log('User data updated:', userData);
    } else {
      console.log('User data not found');
    }
  });
  
  // To stop listening:
  // unsubscribe();
};

// Transfer anonymous data to authenticated user
const transferData = async (anonymousId, authenticatedId) => {
  const result = await userDataService.transferAnonymousData(anonymousId, authenticatedId);
  if (result.success) {
    console.log('Data transferred successfully');
  } else {
    console.error('Error transferring data:', result.error);
  }
};
```

### Anonymous Users

```javascript
import { anonymousService } from './services/FirebaseService';

// Create an anonymous user
const createAnonymousUser = async () => {
  const result = await anonymousService.createAnonymousUser();
  if (result.success) {
    console.log('Anonymous user created with ID:', result.anonymousId);
  } else {
    console.error('Error creating anonymous user:', result.error);
  }
};
```

## Firebase Configuration

To set up Firebase for your project, you need to:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Add your web app to the Firebase project to get configuration values
5. Create a `.env` file in the project root with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Security Rules

Here are recommended Firestore security rules for the Green Marketplace application:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isSeller() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'seller';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // UserData collection
    match /userData/{userId} {
      allow read, write: if isOwner(userId) || isAdmin();
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Anyone can view products
      allow create: if isAuthenticated() && (isSeller() || isAdmin());
      allow update: if isAdmin() || 
        (isSeller() && resource.data.sellerId == request.auth.uid);
      allow delete: if isAdmin() || 
        (isSeller() && resource.data.sellerId == request.auth.uid);
    }
    
    // Carts collection
    match /carts/{userId} {
      allow read, write: if isOwner(userId) || isAdmin();
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isAdmin() || 
        (isAuthenticated() && resource.data.userId == request.auth.uid) ||
        (isSeller() && resource.data.items[0].sellerId == request.auth.uid);
      allow create: if isAuthenticated();
      allow update: if isAdmin() || 
        (isAuthenticated() && resource.data.userId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Anonymous collection
    match /anonymous/{docId} {
      allow read, write: if true; // Anyone can create anonymous sessions
    }
  }
}
```

## Editing the Firebase Integration

If you need to modify the Firebase integration:

1. **To add new collections**: Update the `firebase-config.js` file to add new collection references.

2. **To modify service functions**: Edit the appropriate service module in `FirebaseService.js`.

3. **To change data structure**: Update the service functions and ensure all components using that data are updated accordingly.

4. **To add new functionality**: Create new service functions in the appropriate service module and import them where needed.

## Best Practices

1. **Error Handling**: Always check for success/error in service function results.

2. **Real-time Updates**: Use onSnapshot listeners for data that needs real-time updates.

3. **Batch Operations**: For operations that modify multiple documents, use batch writes.

4. **Security**: Implement proper security rules in Firebase console.

5. **Offline Support**: Enable offline persistence for better user experience.

6. **Data Validation**: Validate data before sending to Firestore.

7. **Indexing**: Create indexes for frequently queried fields.

This guide should help you understand and work with the Firebase NoSQL integration in the Green Marketplace application. If you have any questions or need further assistance, please refer to the [Firebase documentation](https://firebase.google.com/docs).
