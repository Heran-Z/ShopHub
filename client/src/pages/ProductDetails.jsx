
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProductById,
  getProductImageUrl,
} from "../services/productService";
import { readCart, writeCart } from "../services/cartUtils";
import { useAuth } from "../context/AuthContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?._id || user?.id || null;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        setProduct(data.product || data);
      } catch (err) {
        console.error("Product details error:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity((previous) => previous + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((previous) => previous - 1);
    }
  };

  // Save the selected product to the current user's cart
  const addToCart = () => {
    if (!product || product.stockQuantity < 1) return;

    try {
      const existingCart = readCart(userId);
      const existingItem = existingCart.find(
        (item) => item.productId === product._id
      );

      if (existingItem) {
        if (existingItem.quantity + quantity > product.stockQuantity) {
          setMessage("You cannot add more than the available stock.");
          return;
        }
        existingItem.quantity += quantity;
      } else {
        existingCart.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          stockQuantity: product.stockQuantity,
        });
      }

      writeCart(userId, existingCart);
      setMessage(`${product.name} added to your cart!`);
    } catch (err) {
      console.error("Cart error:", err);
      setMessage("Unable to add this product to your cart.");
    }
  };

  if (loading) {
    return (
      <div className="details-message">
        <div className="products-spinner"></div>
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="details-message">
        <h2>Product not found</h2>
        <p>{error || "This product may have been removed."}</p>
        <Link to="/products">Back to Shopping</Link>
      </div>
    );
  }

  const outOfStock = product.stockQuantity < 1;

  return (
    <main className="details-page">
      {/* Navigation */}
      
       
      
        
      

      {/* Breadcrumb */}
      <div className="details-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Product information */}
      <section className="details-container">
        <div className="details-image">
          <img
            src={getProductImageUrl(product.image)}
            alt={product.name}
          />
        </div>

        <div className="details-information">
          <span className="details-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <div className="details-price">
            ETB {Number(product.price).toLocaleString()}
          </div>

          <div className="details-divider"></div>

          <h3>Product Description</h3>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-stock">
            <span className={outOfStock ? "out-stock" : "in-stock"}>
              {outOfStock ? "Out of Stock" : "In Stock"}
            </span>

            {!outOfStock && (
              <span>
                {product.stockQuantity} units available
              </span>
            )}
          </div>

          {!outOfStock && (
            <div className="details-purchase">
              <div className="quantity-selector">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stockQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className="add-cart-btn"
                onClick={addToCart}
              >
                Add to Cart →
              </button>
            </div>
          )}

          {message && (
            <p className="cart-feedback" role="status">
              {message}
            </p>
          )}

          <div className="details-benefits">
            <div>
              <span>✓</span>
              Quality products
            </div>

            <div>
              <span>✓</span>
              Secure shopping
            </div>

            <div>
              <span>✓</span>
              Reliable service
            </div>
          </div>
        </div>
      </section>

      <div className="details-back">
        <Link to="/products">← Back to all products</Link>
      </div>
    </main>
  );
}

export default ProductDetails;
