# Green Marketplace User Guide

Welcome to the Green Marketplace application! This comprehensive guide will help you understand how to use, modify, and extend the application.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [User Roles](#user-roles)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Firebase NoSQL Integration](#firebase-nosql-integration)
7. [Customization Guide](#customization-guide)
8. [Troubleshooting](#troubleshooting)

## Overview

Green Marketplace is an e-commerce platform focused on eco-friendly and sustainable products. The application includes:

- Three account types (user, seller, admin) with specific permissions
- Social/email sign-up options
- Eco-filters and sustainability metrics
- Carbon-neutral shipping options
- Light/dark mode toggle optimized for energy efficiency
- AI validation feature for product sustainability claims
- Community forum for sustainable living discussions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the project root with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## User Roles

The application supports three user roles:

### Regular User

Regular users can:
- View and explore products
- Add products to cart
- Place orders
- View order history
- Request refunds or cancellations
- Update personal details and preferences

### Seller

Sellers can do everything regular users can, plus:
- Add new products (requires admin approval)
- Manage their products (edit/delete)
- View orders for their products
- Cancel orders
- View history of added and denied products including rejection reasons
- Access a vendor dashboard with:
  - Tools to manage products
  - Track sales
  - View sustainability analytics
  - Upload certification documentation
  - Receive inventory management alerts

### Admin

Admins have full control, including:
- View all orders
- Add products without approval
- Manage all products (edit/delete)
- Review and approve/deny seller product requests with rejection reasons
- Explore the normal website

## Features

### Authentication

The application supports multiple authentication methods:
- Email/password registration and login
- Google sign-in
- Anonymous browsing (cart data is preserved when signing in)

### Product Management

- Browse products by category
- Filter products by eco-score, certifications, and other sustainability metrics
- View detailed product information including sustainability features
- Add products to cart
- Checkout and payment processing

### Sustainability Features

- Eco-score rating system (1-5 stars)
- Sustainability reviews for packaging/carbon footprint/ethical sourcing
- Certification validation
- Carbon-neutral shipping options
- Consolidated shipping to reduce waste
- Eco-packaging options
- Green points reward system
- Carbon footprint calculator

### AI Validation

The AI validation feature helps verify product sustainability claims using machine learning. This feature is accessible from the footer and allows users to:
- Upload product images for analysis
- Get AI-powered sustainability assessments
- Verify eco-friendly claims

## Project Structure

The project follows a modular structure:

```
green-marketplace/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images and other assets
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── pages/          # Page components
│   ├── services/       # Service modules including Firebase
│   ├── ui/             # UI components and styles
│   ├── utils/          # Utility functions
│   ├── App.css         # Main application styles
│   ├── App.jsx         # Main application component
│   ├── firebase-config.js # Firebase configuration
│   ├── index.css       # Global styles
│   └── main.jsx        # Entry point
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Firebase NoSQL Integration

The application uses Firebase for authentication and data storage. For detailed information about the Firebase integration, please refer to the [Firebase NoSQL Guide](./FIREBASE_NOSQL_GUIDE.md).

Key Firebase features used:
- Authentication (email/password, Google)
- Firestore (NoSQL database)
- Storage (for product images)
- Security rules

## Customization Guide

### Modifying Styles

The application uses standard CSS for styling. The main style files are:

- `src/index.css` - Global styles
- `src/App.css` - Application-specific styles
- `src/ui/components.css` - Component-specific styles

To modify styles:
1. Locate the appropriate CSS file
2. Add or modify CSS rules
3. Use class names to target specific elements

### Adding New Pages

To add a new page:

1. Create a new component in the `src/pages` directory
2. Add the page to the `renderPage` function in `App.jsx`:

```javascript
// In App.jsx
const renderPage = () => {
  switch (currentPage) {
    // ... existing cases
    case 'new-page':
      return <NewPage setCurrentPage={setCurrentPage} />;
    default:
      return <HomePage setCurrentPage={setCurrentPage} />;
  }
};
```

3. Add navigation to the new page in the Header or Footer component

### Adding New Features

To add new features:

1. Create necessary components in the appropriate directories
2. Add any required Firebase services in `src/services/FirebaseService.js`
3. Update the relevant pages to include the new feature
4. Add styles for the new components

### Modifying User Roles

To modify user roles:

1. Update the role check functions in the Firebase security rules
2. Modify the `authService.getUserRole` function in `FirebaseService.js`
3. Update UI components to show/hide features based on user roles

## Troubleshooting

### Common Issues

#### Firebase Connection Issues

If you're experiencing issues connecting to Firebase:
- Check your `.env` file to ensure all Firebase configuration variables are correct
- Verify that your Firebase project has the necessary services enabled (Authentication, Firestore)
- Check the browser console for specific error messages

#### Page Navigation Issues

If page navigation isn't working correctly:
- Ensure the `setCurrentPage` function is being passed to all page components
- Check that page components are using the `setCurrentPage` function correctly
- Verify that the `currentPage` state in `App.jsx` is being updated

#### Product Display Issues

If products aren't displaying correctly:
- Check the Firestore database to ensure products exist and are formatted correctly
- Verify that the product service functions are being called with the correct parameters
- Check for any errors in the browser console

### Getting Help

If you encounter issues not covered in this guide:
1. Check the browser console for error messages
2. Review the Firebase documentation for specific Firebase-related issues
3. Consult the React documentation for React-specific problems

## Conclusion

This guide covers the basics of using, modifying, and extending the Green Marketplace application. For more detailed information about the Firebase NoSQL integration, please refer to the [Firebase NoSQL Guide](./FIREBASE_NOSQL_GUIDE.md).

Happy coding!
