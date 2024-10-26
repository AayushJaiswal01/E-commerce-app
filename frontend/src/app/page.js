"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  // Fetch products from the server
  const fetchProducts = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await axios.get(
        "https://e-commerce-app-g2yu.onrender.com/products"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Upload image to Cloudinary
  const uploadImage = async (file) => {
    const CLOUDINARY_URL =
      "https://api.cloudinary.com/v1_1/djh4kobdl/image/upload";
    const FORM_DATA = new FormData();
    FORM_DATA.append("file", file);
    FORM_DATA.append("upload_preset", "idyyu9fq");

    try {
      const response = await axios.post(CLOUDINARY_URL, FORM_DATA);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      console.error("Image file is required");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);

    try {
      const uploadedImageUrl = await uploadImage(imageFile);

      const response = await axios.post(
        "https://e-commerce-app-g2yu.onrender.com/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsModalOpen(false);
      resetForm();
      router.push("/");
      location.reload();
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a product
  const handleEditProduct = (product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setQuantity(product.quantity);
    setEditingProductId(product.id);
    setIsEditModalOpen(true);
  };

  // Handle updating a product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const uploadedImageUrl = await uploadImage(imageFile);
    formData.append("image", imageFile);

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);

    setLoading(true);

    try {
      await axios.put(
        `https://e-commerce-app-g2yu.onrender.com/products/${editingProductId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchProducts();
      resetForm();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setImageFile(null);
    setEditingProductId(null);
  };

  // Handle deleting a product
  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `https://e-commerce-app-g2yu.onrender.com/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {loading && (
        <div className="flex items-center justify-center my-4">
          <div className="loader" /> {/* Circular loader */}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow  "
          >
            <img
              className="rounded-t-lg object-cover h-60 w-full" // Set fixed height and width for images
              src={product.imageUrl}
              alt={product.name}
            />
            <div className="p-5">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 ">
                {product.name}
              </h5>
              <p className="mb-3 font-normal text-gray-700 ">
                {product.description}
              </p>
              <div className="flex justify-between">
                <span className="font-bold text-lg">${product.price}</span>
                <span className="font-bold text-lg">{product.quantity}</span>
              </div>
              {/* Render Edit and Delete buttons only if authenticated */}
              {isAuthenticated && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-3 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAuthenticated && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-4 right-4 px-8 py-4 border-b-4 border border-red-500 text-red-500 hover:text-white hover:bg-red-500 transition-all duration-200"
        >
          Add Product
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="relative z-0 w-full mb-5">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product Name"
                  required
                  className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                />
              </div>
              <div className="relative z-0 w-full mb-5">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  required
                  className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                />
              </div>
              <div className="relative z-0 w-full mb-5">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  required
                  className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                />
              </div>
              <div className="relative z-0 w-full mb-5">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                  required
                  className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                />
              </div>
              <div className="relative z-0 w-full mb-5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Add Product
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mt-2 w-full text-red-600 hover:text-red-900"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Form Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Edit Product</h2>
            {/* Find the current product being edited */}
            {products.map((product) => {
              if (product.id === editingProductId) {
                return (
                  <form onSubmit={handleUpdateProduct} key={product.id}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Product Name"
                      required
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Product Description"
                      required
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Price"
                      required
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Quantity"
                      required
                      className="w-full p-2 mb-2 border rounded"
                    />

                    {/* Display existing image */}
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt="Current"
                        className="mb-2 rounded"
                      />
                    )}

                    {/* Option to upload a new image */}
                    <input
                      type="file"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full p-2 mb-2"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white p-2 rounded"
                    >
                      Update Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="mt-2 w-full bg-red-500 text-white p-2 rounded"
                    >
                      Cancel
                    </button>
                  </form>
                );
              }
              return null; // Return null for other products
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
