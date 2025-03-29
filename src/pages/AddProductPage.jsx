import React, { useState } from 'react';
import { db, storage } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './add-product-page.css';

const AddProductPage = ({ setCurrentPage }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEco, setIsEco] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const categories = [
    'coffee_accessories',
    'bags_and_accessories',
    'kitchen_and_home',
    'personal_care',
    'clothing_and_apparel',
    'outdoor_and_garden',
    'pet_products',
    'office_supplies'
  ];

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description || !price || !category || !image) {
      setMessage({ text: 'Please fill all fields and upload an image', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      setMessage({ text: 'Uploading product...', type: 'info' });

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress monitoring if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setMessage({ text: `Upload is ${progress.toFixed(0)}% done`, type: 'info' });
        },
        (error) => {
          setIsLoading(false);
          setMessage({ text: `Upload failed: ${error.message}`, type: 'error' });
        },
        async () => {
          // Upload completed successfully, get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Add product to Firestore
          const productData = {
            title,
            description,
            price: parseFloat(price),
            category,
            image: downloadURL,
            isEco,
            createdAt: new Date()
          };

          await addDoc(collection(db, "products"), productData);
          
          // Reset form
          setTitle('');
          setDescription('');
          setPrice('');
          setCategory('');
          setImage(null);
          setImagePreview(null);
          setIsEco(true);
          setIsLoading(false);
          setMessage({ text: 'Product added successfully!', type: 'success' });
        }
      );
    } catch (error) {
      setIsLoading(false);
      setMessage({ text: `Error adding product: ${error.message}`, type: 'error' });
    }
  };

  return (
    <div className="product-container">
      <h1 className="product-title">Add New Product</h1>
      <p className="product-description">Add a new sustainable and eco-friendly product to the marketplace.</p>

      {message.text && (
        <div 
          className={`message-container ${
            message.type === 'error' ? 'message-error' : 
            message.type === 'success' ? 'message-success' : 
            'message-info'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Product Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Enter product title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Product Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            placeholder="Enter product description"
            rows="4"
          ></textarea>
        </div>

        <div className="form-grid">
          <div>
            <label htmlFor="price" className="form-label">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-input"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Product Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="form-input"
            accept="image/*"
          />
          {imagePreview && (
            <div className="image-preview">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="preview-image" 
              />
            </div>
          )}
        </div>

        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={isEco}
            onChange={(e) => setIsEco(e.target.checked)}
            className="checkbox-input"
          />
          <span className="checkbox-label">This is an eco-friendly product</span>
        </div>

        <div className="button-container">
          <button
            type="submit"
            disabled={isLoading}
            className={`submit-button ${isLoading ? 'submit-button-disabled' : ''}`}
          >
            {isLoading ? 'Adding Product...' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('manage-products')}
            className="secondary-button"
          >
            Manage Products
          </button>
        </div>
      </form>

      <button
        onClick={() => setCurrentPage('home')}
        className="back-button"
      >
        Back to Home
      </button>
    </div>
  );
};

export default AddProductPage;
