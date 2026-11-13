
import { useEffect, useState } from "react";
import { RefreshCw, Package, Truck } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AdminOrders.css";

const STATUSES = [
  "Pending",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Admin orders error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load orders."
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
      setError("Please log in as an administrator.");
    }
  }, [token]);

  const updateStatus = async (orderId, status) => {
    try {
      setSavingId(orderId);
      setError("");

      const response = await api.patch(
        `/orders/admin/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: response.data.order.status }
            : order
        )
      );
    } catch (err) {
      console.error("Status update error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to update order status."
      );
    } finally {
      setSavingId("");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-ET", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getStatusClass = (status) =>
    `admin-status admin-status-${status.toLowerCase()}`;

  return (
    <main className="admin-orders-page">
      <section className="admin-orders-container">

        <header className="admin-orders-header">
          <div>
            <span className="admin-eyebrow">
              SHOPHUB MANAGEMENT
            </span>
            <h1>Order Management</h1>
            <p>Manage and track customer orders.</p>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={fetchOrders}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh Orders
          </button>
        </header>

        <div className="admin-orders-stats">
          <div className="admin-stat-card">
            <Package size={24} />
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="admin-stat-card">
            <Truck size={24} />
            <span>Pending Orders</span>
            <strong>
              {orders.filter(
                (order) => order.status === "Pending"
              ).length}
            </strong>
          </div>

          <div className="admin-stat-card">
            <Package size={24} />
            <span>Delivered Orders</span>
            <strong>
              {orders.filter(
                (order) => order.status === "Delivered"
              ).length}
            </strong>
          </div>
        </div>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-message">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-message">
            No customer orders found.
          </div>
        ) : (
          <div className="admin-orders-list">
            {orders.map((order) => (
              <article
                className="admin-order-card"
                key={order._id}
              >
                <div className="admin-order-top">
                  <div>
                    <span>ORDER ID</span>
                    <h3>
                      #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <small>
                      {formatDate(order.createdAt)}
                    </small>
                  </div>

                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </div>

                <div className="admin-customer-info">
                  <h4>Customer Information</h4>

                  <p>
                    <strong>Name:</strong>{" "}
                    {order.delivery?.fullName ||
                      order.user?.name ||
                      "Not available"}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {order.user?.email || "Not available"}
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

                <div className="admin-order-products">
                  <h4>Ordered Products</h4>

                  {order.items.map((item, index) => (
                    <div
                      className="admin-order-product"
                      key={item._id || index}
                    >
                      <span>
                        {item.product?.name ||
                          "Product unavailable"}
                      </span>

                      <span>
                        Qty: {item.quantity}
                      </span>

                      <strong>
                        ETB{" "}
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="admin-order-bottom">
                  <div>
                    <span>Total Amount</span>
                    <strong>
                      ETB{" "}
                      {Number(
                        order.totalAmount
                      ).toLocaleString()}
                    </strong>
                  </div>

                  <div className="admin-status-control">
                    <label>Update Status</label>

                    <select
                      value={order.status}
                      disabled={savingId === order._id}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                    >
                      {STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>

                    {savingId === order._id && (
                      <small>Saving...</small>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </section>
    </main>
  );
}

export default AdminOrders;
