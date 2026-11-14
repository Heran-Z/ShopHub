
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProductImageUrl } from "../services/productService";
import { readCart, writeCart, clearCart as clearCartStorage } from "../services/cartUtils";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?._id || user?.id || null;

  const [cartItems, setCartItems] = useState([]);

  // Read the cart for the current user.
  const loadCart = () => {
    setCartItems(readCart(userId));
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, [userId]);

  // Save changes to localStorage and update the page.
  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);
    writeCart(userId, updatedCart);
  };

  // Increase or decrease an item's quantity.
  const updateQuantity = (productId, change) => {
    const updatedCart = cartItems.map((item) => {
      if (item.productId !== productId) return item;
      const newQuantity = item.quantity + change;
      if (newQuantity < 1 || newQuantity > item.stockQuantity) return item;
      return { ...item, quantity: newQuantity };
    });
    saveCart(updatedCart);
  };

  // Remove one product.
  const removeItem = (productId) => {
    saveCart(cartItems.filter((item) => item.productId !== productId));
  };

  // Remove every product.
  const handleClearCart = () => {
    setCartItems([]);
    clearCartStorage(userId);
  };

  // Calculate the total price.
  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  return (
    <main className="cart-page">
      <section className="cart-content">
        <div className="cart-heading">
          <div>
            <span className="cart-eyebrow">YOUR SHOPPING BAG</span>
            <h1>Shopping Cart</h1>
            <p>
              {cartItems.length}{" "}
              {cartItems.length === 1 ? "product" : "products"} in your cart
            </p>
          </div>

          {cartItems.length > 0 && (
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>
              You haven't added any products yet. Explore our collection
              and find something you'll love.
            </p>
            <Link to="/products" className="cart-shop-btn">
              Explore Products →
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-section">
              <div className="cart-table-heading">
                <span>PRODUCT</span>
                <span>PRICE</span>
                <span>QUANTITY</span>
                <span>SUBTOTAL</span>
              </div>

              {cartItems.map((item) => (
                <article className="cart-item" key={item.productId}>
                  <div className="cart-product">
                    <Link to={`/products/${item.productId}`}>
                      <img
                        src={getProductImageUrl(item.image)}
                        alt={item.name}
                      />
                    </Link>

                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="cart-product-name"
                      >
                        {item.name}
                      </Link>

                      <span className="cart-product-stock">
                        {item.stockQuantity} available
                      </span>

                      <button
                        className="remove-item-btn"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-price">
                    ETB {Number(item.price).toLocaleString()}
                  </div>

                  <div className="cart-quantity">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      disabled={item.quantity >= item.stockQuantity}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>

                  <strong className="cart-subtotal">
                    ETB{" "}
                    {(Number(item.price) * item.quantity).toLocaleString()}
                  </strong>
                </article>
              ))}
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-line">
                <span>Items ({cartItems.length})</span>
                <span>ETB {totalPrice.toLocaleString()}</span>
              </div>

              <div className="summary-line">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <strong>ETB {totalPrice.toLocaleString()}</strong>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout →
              </button>

              <Link to="/products" className="back-to-shop">
                ← Continue Shopping
              </Link>

              <p className="cart-secure-note">
                ✓ Your cart is private to your account.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default Cart;
