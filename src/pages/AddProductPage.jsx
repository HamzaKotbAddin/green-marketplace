import React, { useState } from 'react';
import { db, storage, collection, addDoc } from '../../firebase-config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Add New Product</h1>
      <p className="mb-6">Add a new sustainable and eco-friendly product to the marketplace.</p>

      {message.text && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 
            message.type === 'success' ? 'bg-green-100 text-green-700' : 
            'bg-blue-100 text-blue-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Product Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter product title"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Product Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter product description"
            rows="4"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
            Product Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            accept="image/*"
          />
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-48 object-cover rounded-md border border-gray-300" 
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isEco}
              onChange={(e) => setIsEco(e.target.checked)}
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-gray-700">This is an eco-friendly product</span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Adding Product...' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('manage-products')}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Manage Products
          </button>
        </div>
      </form>

      <button
        onClick={() => setCurrentPage('home')}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mt-6"
      >
        Back to Home
      </button>
    </div>
  );
};

export default AddProductPage;
