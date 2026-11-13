import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Check, Eye } from "lucide-react";

import { getProductImageUrl } from "../services/productService";
import { readCart, writeCart } from "../services/cartUtils";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product, onAddedToCart, justAdded }) {
  const { user } = useAuth();
  const userId = user?._id || user?.id || null;
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("shophub_favorites") || "[]"
      );
      return saved.some((item) => item._id === product._id);
    } catch {
      return false;
    }
  });

  // ── ADD TO CART ──────────────────────────────────────────────
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stockQuantity < 1) return;

    try {
      const cart = readCart(userId);
      const existingIndex = cart.findIndex(
        (item) => item.productId === product._id
      );

      if (existingIndex !== -1) {
        const current = cart[existingIndex];
        if (current.quantity < product.stockQuantity) {
          cart[existingIndex] = { ...current, quantity: current.quantity + 1 };
        }
      } else {
        cart.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          stockQuantity: product.stockQuantity,
          quantity: 1,
        });
      }

      writeCart(userId, cart);
      if (onAddedToCart) onAddedToCart(product._id);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  // ── TOGGLE FAVORITE ──────────────────────────────────────────
  const handleToggleFavorite = (e) => {
    e.preventDefault();

    try {
      const saved = JSON.parse(
        localStorage.getItem("shophub_favorites") || "[]"
      );

      const isNowFavorite = !isFavorite;

      const updated = isNowFavorite
        ? [...saved, product]
        : saved.filter((item) => item._id !== product._id);

      localStorage.setItem(
        "shophub_favorites",
        JSON.stringify(updated)
      );

      window.dispatchEvent(new Event("favoritesUpdated"));
      setIsFavorite(isNowFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const isOutOfStock = product.stockQuantity < 1;

  return (
    <article className="pcard">
      {/* ── IMAGE ── */}
      <div className="pcard-image">
        <Link to={`/products/${product._id}`} tabIndex={-1} aria-hidden>
          <img
            src={getProductImageUrl(product.image)}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=700&q=60";
            }}
          />
        </Link>

        {/* Category badge */}
        <span className="pcard-category">{product.category}</span>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="pcard-oos-overlay">Out of Stock</div>
        )}

        {/* Favorite button */}
        <button
          className={`pcard-fav-btn ${isFavorite ? "pcard-fav-btn--active" : ""}`}
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
        >
          <Heart
            size={17}
            fill={isFavorite ? "currentColor" : "none"}
            strokeWidth={isFavorite ? 0 : 2}
          />
        </button>

        {/* Quick view overlay */}
        <Link
          to={`/products/${product._id}`}
          className="pcard-quick-view"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye size={15} />
          Quick View
        </Link>
      </div>

      {/* ── BODY ── */}
      <div className="pcard-body">
        <Link
          to={`/products/${product._id}`}
          className="pcard-name"
        >
          {product.name}
        </Link>

        <p className="pcard-desc">
          {product.description?.slice(0, 72)}
          {product.description?.length > 72 ? "…" : ""}
        </p>

        {/* Price row */}
        <div className="pcard-footer">
          <div className="pcard-price">
            <span className="pcard-price-label">ETB</span>
            <strong>{Number(product.price).toLocaleString()}</strong>
          </div>

          <button
            className={`pcard-cart-btn ${
              justAdded ? "pcard-cart-btn--added" : ""
            } ${isOutOfStock ? "pcard-cart-btn--disabled" : ""}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={
              isOutOfStock
                ? "Out of stock"
                : justAdded
                  ? "Added to cart"
                  : `Add ${product.name} to cart`
            }
            title={
              isOutOfStock
                ? "Out of stock"
                : justAdded
                  ? "Added!"
                  : "Add to cart"
            }
          >
            {justAdded ? (
              <>
                <Check size={15} strokeWidth={3} />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart size={15} />
                Add to Cart
              </>
            )}
          </button>
        </div>

        {/* Stock indicator */}
        <div className="pcard-stock">
          {isOutOfStock ? (
            <span className="pcard-stock--out">Out of stock</span>
          ) : product.stockQuantity <= 5 ? (
            <span className="pcard-stock--low">
              Only {product.stockQuantity} left!
            </span>
          ) : (
            <span className="pcard-stock--in">In stock</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
