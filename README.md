# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Green Marketplace

The Green Marketplace project aims to create an eco-friendly platform where users can discover and purchase sustainable products. It is designed to promote eco-conscious shopping habits and support businesses that prioritize sustainability.

## Features

- **Authentication**: User sign-up and sign-in using Firebase Authentication (Email/Password).
- **Firestore**: Storage of product and user data.
- **Realtime Database**: For tracking user actions and other real-time updates.
- **Cloud Storage**: For storing product images and media files.

## Tech Stack

- React
- Vite
- Firebase (Authentication, Firestore, Realtime Database, Cloud Storage)
- React Router
- CSS for styling

## 📦 Setup & Installation

```bash
# Clone the repository and navigate to project directory
git clone https://github.com/your-username/green-marketplace.git && \
cd green-marketplace

# Install dependencies
npm install

# Create environment file (replace placeholder values with your Firebase credentials)
echo "VITE_FIREBASE_API_KEY=your-api-key" > .env && \
echo "VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain" >> .env && \
echo "VITE_FIREBASE_PROJECT_ID=your-project-id" >> .env && \
echo "VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket" >> .env && \
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id" >> .env && \
echo "VITE_FIREBASE_APP_ID=your-app-id" >> .env && \
echo "VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id" >> .env

# Start development server
npm run dev
```
