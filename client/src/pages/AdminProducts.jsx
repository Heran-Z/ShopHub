
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Package,
  X,
  ImagePlus,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getProductImageUrl } from "../services/productService";

import "./AdminProducts.css";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stockQuantity: "",
};

function AdminProducts() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Fetch products error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPEG, PNG, WEBP or GIF image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Reset form
  const resetForm = () => {
    setFormData(emptyForm);
    setImage(null);

    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview("");
    setEditingId(null);
    setShowForm(false);
  };

  // Open add product form
  const openAddForm = () => {
    resetForm();
    setShowForm(true);
    setMessage("");
    setError("");
  };

  // Open edit product form
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stockQuantity: String(product.stockQuantity),
    });

    setImage(null);
    setPreview(getProductImageUrl(product.image));
    setEditingId(product._id);
    setShowForm(true);
    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Create or update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Please log in as an administrator.");
      return;
    }

    if (!editingId && !image) {
      setError("Please select a product image.");
      return;
    }

    if (
      Number(formData.price) < 0 ||
      Number(formData.stockQuantity) < 0 ||
      !Number.isFinite(Number(formData.price)) ||
      !Number.isInteger(Number(formData.stockQuantity))
    ) {
      setError("Enter a valid price and whole-number stock quantity.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", formData.price);
      data.append("category", formData.category.trim());
      data.append("stockQuantity", formData.stockQuantity);

      if (image) {
        data.append("image", image);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingId) {
        await api.put(
          `/products/${editingId}`,
          data,
          config
        );

        setMessage("Product updated successfully!");
      } else {
        await api.post("/products", data, config);

        setMessage("Product added successfully!");
      }

      resetForm();
      await fetchProducts();

    } catch (err) {
      console.error("Save product error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((previous) =>
        previous.filter((product) => product._id !== id)
      );

      setMessage("Product deleted successfully!");

      if (editingId === id) {
        resetForm();
      }

    } catch (err) {
      console.error("Delete product error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to delete product."
      );
    }
  };

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stockQuantity || 0),
    0
  );

  return (
    <main className="admin-products-page">
      <div className="admin-products-container">

        <header className="admin-products-header">
          <div>
            <span className="admin-products-eyebrow">
              SHOPHUB MANAGEMENT
            </span>

            <h1>Product Management</h1>

            <p>
              Manage your products, prices, images and inventory.
            </p>
          </div>

          <button
            className="admin-add-product-btn"
            onClick={openAddForm}
          >
            <Plus size={19} />
            Add Product
          </button>
        </header>

        {/* Statistics */}
       {/* Statistics */}
<section className="admin-product-stats">

  <div className="admin-product-stat">
    <Package />
    <span>Total Products</span>
    <strong>{products.length}</strong>
  </div>

  <div className="admin-product-stat">
    <Package />
    <span>Total Stock</span>
    <strong>{totalStock.toLocaleString()}</strong>
  </div>

  <div className="admin-product-stat">
    <Package />
    <span>Low Stock (5 or less)</span>
    <strong>
      {products.filter(
        (product) => product.stockQuantity > 0 &&
        product.stockQuantity <= 5
      ).length}
    </strong>
  </div>

  <div className="admin-product-stat">
    <Package />
    <span>Out of Stock</span>
    <strong>
      {products.filter(
        (product) => product.stockQuantity === 0
      ).length}
    </strong>
  </div>

</section>

        {/* Notifications */}
        {error && (
          <div className="admin-product-error">
            {error}
          </div>
        )}

        {message && (
          <div className="admin-product-success">
            {message}
          </div>
        )}

        {/* Product Form */}
        {showForm && (
          <section className="admin-product-form-card">

            <div className="admin-product-form-header">
              <div>
                <h2>
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>

                <p>
                  Enter the product information below.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="admin-form-close"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="admin-form-grid">

                <div className="admin-form-group">
                  <label>Product Name</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category</label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Electronics"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Price (ETB)</label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Stock Quantity</label>

                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="Enter quantity"
                    required
                  />
                </div>

                <div className="admin-form-group admin-full-width">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your product..."
                    rows="4"
                    required
                  />
                </div>

                <div className="admin-form-group admin-full-width">
                  <label>Product Image</label>

                  <label className="admin-image-upload">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Product preview"
                      />
                    ) : (
                      <>
                        <ImagePlus size={35} />
                        <span>Select product image</span>
                        <small>JPEG, PNG, WEBP or GIF · Max 5 MB</small>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageChange}
                    />
                  </label>

                  {editingId && (
                    <small>
                      Leave the image unchanged to keep the existing image.
                    </small>
                  )}
                </div>

              </div>

              <div className="admin-form-actions">

                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Save Product"}
                </button>

              </div>

            </form>
          </section>
        )}

        {/* Product List */}
        <section className="admin-products-list-section">

          <div className="admin-products-list-header">
            <div>
              <h2>All Products</h2>
              <p>{products.length} products in your catalog</p>
            </div>

            <button
              className="admin-refresh-products"
              onClick={fetchProducts}
              disabled={loading}
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="admin-products-empty">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="admin-products-empty">
              <Package size={40} />
              <h3>No products found</h3>
              <p>Add your first product to get started.</p>
            </div>
          ) : (
            <div className="admin-products-grid">

              {products.map((product) => (
                <article
                  className="admin-product-card"
                  key={product._id}
                >

                  <div className="admin-product-image">
                    <img
                      src={getProductImageUrl(product.image)}
                      alt={product.name}
                    />
                  </div>

                  <div className="admin-product-info">

                    <span className="admin-product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p className="admin-product-description">
                      {product.description}
                    </p>

                    <div className="admin-product-details">
                      <strong>
                        ETB {Number(product.price).toLocaleString()}
                      </strong>

                      <span
                        className={
                          product.stockQuantity > 0
                            ? "admin-stock-available"
                            : "admin-stock-empty"
                        }
                      >
                        {product.stockQuantity > 0
                          ? `${product.stockQuantity} in stock`
                          : "Out of stock"}
                      </span>
                    </div>

                    <div className="admin-product-actions">

                      <button
                        className="admin-edit-product"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        className="admin-delete-product"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default AdminProducts;
