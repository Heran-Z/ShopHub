
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { getProductImageUrl } from "../services/productService";
import { readCart, clearCart } from "../services/cartUtils";
import { useAuth } from "../context/AuthContext";

import "./Checkout.css";

// Payment method options
const PAYMENT_METHODS = [
  {
    id: "Telebirr",
    label: "Telebirr",
    description: "Pay via Telebirr mobile money",
    icon: "📱",
  },
  {
    id: "CBE Birr",
    label: "CBE Birr",
    description: "Pay via Commercial Bank of Ethiopia",
    icon: "🏦",
  },
  {
    id: "Cash on Delivery",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: "💵",
  },
];

function Checkout() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const userId = user?._id || user?.id || null;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [delivery, setDelivery] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Telebirr");

  // Load cart from localStorage (per-user)
  useEffect(() => {
    try {
      setCartItems(readCart(userId));
    } catch (err) {
      console.error("Unable to load cart:", err);
      setCartItems([]);
    }
  }, [userId]);

  // Calculate total
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  // Handle delivery form field changes
  const handleChange = (e) => {
    setDelivery({ ...delivery, [e.target.name]: e.target.value });
  };

  // Place order then process payment
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your shopping cart is empty.");
      return;
    }

    if (
      !delivery.fullName.trim() ||
      !delivery.phone.trim() ||
      !delivery.address.trim()
    ) {
      setError("Please complete all delivery information.");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      product: item.productId,
      quantity: Number(item.quantity),
    }));

    setLoading(true);

    try {
      // Step 1 — create the order
      const orderResponse = await api.post(
        "/orders",
        {
          items: orderItems,
          delivery: {
            fullName: delivery.fullName.trim(),
            phone: delivery.phone.trim(),
            address: delivery.address.trim(),
          },
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.success) {
        setError("Unable to place your order. Please try again.");
        setLoading(false);
        return;
      }

      const createdOrder = orderResponse.data.order;

      // Step 2 — process payment
      const paymentResponse = await api.post(
        "/payments",
        {
          orderId: createdOrder._id,
          paymentMethod,
          simulateResult: "success",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear cart regardless of payment status
      clearCart(userId);
      window.dispatchEvent(new Event("cartUpdated"));

      // Navigate to My Orders with the result
      navigate("/my-orders", {
        state: {
          orderSuccess: true,
          order: createdOrder,
          paymentStatus: paymentResponse.data.paymentStatus || "Pending",
          paymentMethod,
        },
      });
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Unable to complete your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page">
      <div className="checkout-container">

        <Link to="/cart" className="back-to-cart">
          ← Back to Cart
        </Link>

        <h1>Checkout</h1>
        <p>Fill in your delivery details and choose how you'd like to pay.</p>

        {error && (
          <div className="checkout-error">{error}</div>
        )}

        {cartItems.length === 0 ? (
          <div className="checkout-card">
            <h2>Your cart is empty</h2>
            <Link to="/products">Continue shopping</Link>
          </div>
        ) : (
          <div className="checkout-layout">

            {/* LEFT COLUMN — delivery + payment */}
            <form className="checkout-form-col" onSubmit={handlePlaceOrder}>

              {/* Delivery Information */}
              <div className="checkout-card">
                <h2>Delivery Information</h2>

                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={delivery.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={delivery.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />

                <label>Delivery Address</label>
                <textarea
                  name="address"
                  value={delivery.address}
                  onChange={handleChange}
                  placeholder="Enter your delivery address"
                  rows="4"
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="checkout-card">
                <h2>Payment Method</h2>

                <div className="payment-methods">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`payment-option ${
                        paymentMethod === method.id
                          ? "payment-option--selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                      />

                      <span className="payment-option-icon">
                        {method.icon}
                      </span>

                      <div className="payment-option-text">
                        <span className="payment-option-label">
                          {method.label}
                        </span>
                        <span className="payment-option-desc">
                          {method.description}
                        </span>
                      </div>

                      {paymentMethod === method.id && (
                        <span className="payment-option-check" aria-hidden="true">
                          ✓
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                {paymentMethod === "Cash on Delivery" && (
                  <div className="cod-notice">
                    💡 You'll pay in cash when your package arrives. No
                    upfront payment required.
                  </div>
                )}

                {paymentMethod !== "Cash on Delivery" && (
                  <div className="mobile-pay-notice">
                    🔒 Your payment is securely simulated. In a live
                    environment this would redirect to {paymentMethod}.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="place-order-btn"
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "Cash on Delivery"
                    ? "Place Order"
                    : `Pay ETB ${totalPrice.toLocaleString()} via ${paymentMethod}`}
              </button>
            </form>

            {/* RIGHT COLUMN — order summary */}
            <aside className="checkout-card checkout-summary-col">
              <h2>Order Summary</h2>

              {cartItems.map((item) => (
                <div className="checkout-item" key={item.productId}>
                  <img
                    src={getProductImageUrl(item.image)}
                    alt={item.name}
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <strong>
                      ETB{" "}
                      {(
                        Number(item.price) * Number(item.quantity)
                      ).toLocaleString()}
                    </strong>
                  </div>
                </div>
              ))}

              <hr />

              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span>ETB {totalPrice.toLocaleString()}</span>
              </div>

              <div className="checkout-summary-row">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>

              <hr />

              <div className="checkout-total">
                <span>Total</span>
                <strong>ETB {totalPrice.toLocaleString()}</strong>
              </div>

              <div className="checkout-payment-badge">
                <span>Payment via</span>
                <strong>{paymentMethod}</strong>
              </div>
            </aside>

          </div>
        )}
      </div>
    </main>
  );
}

export default Checkout;
