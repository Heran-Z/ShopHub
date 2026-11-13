
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, RefreshCw } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getProductImageUrl } from "../services/productService";

import "./MyOrders.css";

function MyOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch customer orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Fetching orders failed:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("Please log in to view your orders.");
    }
  }, [token]);

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-ET", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Status styling
  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "status-delivered";

      case "Shipped":
        return "status-shipped";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  };

  return (
    <main className="my-orders-page">

      <section className="orders-container">

        <div className="orders-header">
          <div>
            <span className="orders-eyebrow">
              YOUR SHOPHUB ACCOUNT
            </span>

            <h1>My Orders</h1>

            <p>
              Track your purchases and view your order history.
            </p>
          </div>

          <button
            className="refresh-orders-btn"
            onClick={fetchOrders}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="orders-message">
            <div className="orders-loader"></div>
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="orders-message orders-error">
            <p>{error}</p>

            <button onClick={fetchOrders}>
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-orders-icon">
              <ShoppingBag size={40} />
            </div>

            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
              Start exploring our products!
            </p>

            <Link to="/products" className="shop-orders-btn">
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="orders-list">

            <div className="orders-count">
              <Package size={20} />

              <span>
                You have {orders.length}{" "}
                {orders.length === 1 ? "order" : "orders"}
              </span>
            </div>

            {orders.map((order) => (
              <article className="order-card" key={order._id}>

                <div className="order-card-header">
                  <div>
                    <span className="order-label">
                      ORDER ID
                    </span>

                    <h3>#{order._id.slice(-8).toUpperCase()}</h3>

                    <span className="order-date">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <span
                    className={`order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-products">
                  {order.items.map((item, index) => (
                    <div
                      className="order-product"
                      key={item._id || index}
                    >
                      {item.product ? (
                        <img
                          src={getProductImageUrl(item.product.image)}
                          alt={item.product.name}
                        />
                      ) : (
                        <div className="order-product-placeholder">
                          <Package />
                        </div>
                      )}

                      <div className="order-product-info">
                        <h4>
                          {item.product?.name || "Product unavailable"}
                        </h4>

                        <p>
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <strong>
                        ETB{" "}
                        {(
                          item.price * item.quantity
                        ).toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="order-delivery">
                  <h4>Delivery Information</h4>

                  <p>
                    <strong>Name:</strong>{" "}
                    {order.delivery?.fullName || "Not available"}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.delivery?.phone || "Not available"}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {order.delivery?.address || "Not available"}
                  </p>
                </div>

                <div className="order-card-footer">
                  <span>Total Amount</span>

                  <strong>
                    ETB {Number(order.totalAmount).toLocaleString()}
                  </strong>
                </div>

                {/* Payment info */}
                {order.payment && (
                  <div className="order-payment-info">
                    <div className="order-payment-method">
                      <span className="order-payment-label">
                        Payment Method
                      </span>
                      <span className="order-payment-value">
                        {order.payment.method || "Cash on Delivery"}
                      </span>
                    </div>

                    <div className="order-payment-status">
                      <span className="order-payment-label">
                        Payment Status
                      </span>
                      <span
                        className={`order-payment-badge ${
                          order.payment.status === "Paid"
                            ? "pay-status--paid"
                            : order.payment.status === "Failed"
                              ? "pay-status--failed"
                              : "pay-status--pending"
                        }`}
                      >
                        {order.payment.status || "Pending"}
                      </span>
                    </div>
                  </div>
                )}

              </article>
            ))}
          </div>
        )}

      </section>
    </main>
  );
}

export default MyOrders;
