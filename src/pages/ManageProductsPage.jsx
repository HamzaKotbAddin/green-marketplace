import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase-config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";



const ManageProductsPage = ({ setCurrentPage, user , userType }) => {
  const userId = user?.uid;
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  

  const categories = [
    "coffee_accessories",
    "bags_and_accessories",
    "kitchen_and_home",
    "personal_care",
    "clothing_and_apparel",
    "outdoor_and_garden",
    "pet_products",
    "office_supplies",
  ];

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsQuery = query(
          collection(db, "products"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(productsQuery);

        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));

        setProducts(productsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setMessage({
          text: `Error loading products: ${error.message}`,
          type: "error",
        });
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      price: product.price.toString(),
    });
    setImagePreview(product.image);
    setNewImage(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewImage(null);
    setImagePreview(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      !editingProduct.title ||
      !editingProduct.description ||
      !editingProduct.price ||
      !editingProduct.category
    ) {
      setMessage({ text: "Please fill all required fields", type: "error" });
      return;
    }

    try {
      setIsLoading(true);
      setMessage({ text: "Updating product...", type: "info" });

      let updatedProduct = {
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        updatedAt: new Date(),
      };

      // If there's a new image, upload it
      if (newImage) {
        // Upload new image to Firebase Storage
        const storageRef = ref(
          storage,
          `products/${Date.now()}_${newImage.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, newImage);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Progress monitoring if needed
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setMessage({
                text: `Upload is ${progress.toFixed(0)}% done`,
                type: "info",
              });
            },
            reject,
            async () => {
              // Upload completed successfully, get download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              updatedProduct.image = downloadURL;
              resolve();
            }
          );
        });

        // Optionally delete old image if it's from storage
        if (
          editingProduct.image &&
          editingProduct.image.includes("firebasestorage")
        ) {
          try {
            const oldImageRef = ref(storage, editingProduct.image);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error("Error deleting old image: ", error);
          }
        }
      }

      // Update product in Firestore
      const productRef = doc(db, "products", editingProduct.id);
      await updateDoc(productRef, updatedProduct);

      // Update local state
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...updatedProduct, createdAt: p.createdAt }
            : p
        )
      );

      setEditingProduct(null);
      setNewImage(null);
      setImagePreview(null);
      setIsLoading(false);
      setMessage({ text: "Product updated successfully!", type: "success" });
    } catch (error) {
      setIsLoading(false);
      setMessage({
        text: `Error updating product: ${error.message}`,
        type: "error",
      });
    }
  };

  const handleDeleteConfirm = (productId) => {
    setConfirmDelete(productId);
  };

  const handleDelete = async (productId) => {
    try {
      setIsLoading(true);
      setMessage({ text: "Deleting product...", type: "info" });

      // Get the product to delete
      const productToDelete = products.find((p) => p.id === productId);

      // Delete product from Firestore
      await deleteDoc(doc(db, "products", productId));

      // Delete image from Storage if it exists
      if (
        productToDelete.image &&
        productToDelete.image.includes("firebasestorage")
      ) {
        try {
          const imageRef = ref(storage, productToDelete.image);
          await deleteObject(imageRef);
        } catch (error) {
          console.error("Error deleting image: ", error);
        }
      }

      // Update local state
      setProducts(products.filter((p) => p.id !== productId));
      setConfirmDelete(null);
      setIsLoading(false);
      setMessage({ text: "Product deleted successfully!", type: "success" });
    } catch (error) {
      setIsLoading(false);
      setMessage({
        text: `Error deleting product: ${error.message}`,
        type: "error",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Manage Products
      </h1>
      <p className="mb-6">
        View, edit, and delete products in your eco-friendly marketplace.
      </p>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md ${message.type === "error"
              ? "bg-red-100 text-red-700"
              : message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage("add-product")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add New Product
        </button>
        <button
          onClick={() => setCurrentPage("home")}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Back to Home
        </button>
      </div>

      {isLoading && !editingProduct ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">
            No products found. Add your first product!
          </p>
        </div>
      ) : editingProduct ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            Edit Product
          </h2>

          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-2"
              >
                Product Title
              </label>
              <input
                type="text"
                id="title"
                value={editingProduct.title}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    title: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter product title"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Product Description
              </label>
              <textarea
                id="description"
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter product description"
                rows="4"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-gray-700 font-medium mb-2"
              >
                Product Image
              </label>
              <div className="flex items-center space-x-4 mb-2">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Current"
                    className="h-24 w-24 object-cover rounded-md border border-gray-300"
                  />
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {newImage ? "New image selected" : "Current image"}
                  </p>
                  <input
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingProduct.isEco}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      isEco: e.target.checked,
                    })
                  }
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">
                  This is an eco-friendly product
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition mr-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {isLoading ? "Updating..." : "Update Product"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div
                      className="h-16 w-16 bg-gray-200 rounded-md"
                      style={{
                        backgroundImage: `url(${product.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {product.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {product.description}
                    </div>
                  </td>
                  <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    {product.category?.replace("_", " ") || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                  {(product.ownerId === userId  || userType === "admin")  ? (
                      // If this seller owns it, show confirm or Edit/Delete:
                      confirmDelete === product.id ? (
                        <div className="flex space-x-2">
                          {/* Confirm delete */}
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          {/* Edit/Delete buttons */}
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(product.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      )
                    ) : (
                      // Otherwise, show placeholder or nothing
                      <span className="text-gray-400 italic">Not yours</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;
