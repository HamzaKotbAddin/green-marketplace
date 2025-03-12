// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { db } from '../../firebase-config';
import { collection, addDoc } from '../../firebase-config';
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      // Add form data to Firebase Firestore
      await addDoc(collection(db, 'contactMessages'), formData);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' }); // Clear the form after submission
    } catch (error) {
      setSubmitError('Failed to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-green-800 mb-6">Contact Us</h1>
        <p className="text-lg text-gray-700 mb-8">Feel free to reach out to us with any inquiries. We’d love to hear from you!</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="text-left text-gray-700">Your Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-left text-gray-700">Your Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="message" className="text-left text-gray-700">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="5"
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md transition ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Send Message'}
          </button>
        </form>

        {/* Success/Failure Message */}
        {submitSuccess && (
          <div className="mt-6 text-green-700 font-semibold">Your message has been sent successfully!</div>
        )}
        {submitError && (
          <div className="mt-6 text-red-600 font-semibold">{submitError}</div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
