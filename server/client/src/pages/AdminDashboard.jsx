import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowRight,
  Store,
  AlertTriangle,
  BarChart2,
  CircleDollarSign,
  ShoppingBag,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getProductImageUrl } from "../services/productService";

import "./AdminDashboard.css";

/* ── helpers ───────────────────────────────────────── */
const fmt = (n) => Number(n || 0).toLocaleString();
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-ET", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const STATUS_META = {
  Pending:   { color: "#d97706", bg: "#fef9c3", label: "Pending" },
  Shipped:   { color: "#2563eb", bg: "#dbeafe", label: "Shipped" },
  Delivered: { color: "#16a34a", bg: "#dcfce7", label: "Delivered" },
  Cancelled: { color: "#dc2626", bg: "#fee2e2", label: "Cancelled" },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.Pending;
  return (
    <span
      className="dash-status-badge"
      style={{ color: m.color, background: m.bg }}
    >
      {m.label}
    </span>
  );
}

/* ── mini bar chart (pure CSS) ─────────────────────── */
function MiniBarChart({ data }) {
  if (!data?.length) return <p className="dash-no-data">No data yet</p>;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="dash-bar-chart">
      {data.map((d) => (
        <div className="dash-bar-col" key={d._id}>
          <div
            className="dash-bar-fill"
            style={{ height: `${Math.max((d.count / max) * 100, 4)}%` }}
            title={`${d.count} orders`}
          />
          <span className="dash-bar-label">
            {d._id?.slice(5)} {/* MM-DD */}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── category revenue rows ─────────────────────────── */
function CategoryRevenue({ data }) {
  if (!data?.length) return <p className="dash-no-data">No data yet</p>;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="dash-cat-list">
      {data.map((d) => (
        <div className="dash-cat-row" key={d._id || "unknown"}>
          <span className="dash-cat-name">{d._id || "Uncategorised"}</span>
          <div className="dash-cat-bar-wrap">
            <div
              className="dash-cat-bar"
              style={{ width: `${(d.revenue / max) * 100}%` }}
            />
          </div>
          <span className="dash-cat-rev">
            ETB {fmt(d.revenue)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                     */
/* ═══════════════════════════════════════════════════ */
function AdminDashboard() {
  const { token, user } = useAuth();

  const [stats, setStats]               = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock]         = useState([]);
  const [catRevenue, setCatRevenue]     = useState([]);
  const [ordersByDay, setOrdersByDay]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [lastRefresh, setLastRefresh]   = useState(null);

  const fetchStats = useCallback(async () => {
    if (!token) {
      setError("Please log in as an administrator.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
      setLowStock(data.lowStockProducts || []);
      setCatRevenue(data.revenueByCategory || []);
      setOrdersByDay(data.ordersByDay || []);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  /* ── KPI card definitions ─── */
  const kpiCards = stats
    ? [
        {
          label: "Total Revenue",
          value: `ETB ${fmt(stats.totalRevenue)}`,
          icon: CircleDollarSign,
          accent: "#f97316",
          bg: "#fff7ed",
          sub: "All non-cancelled orders",
        },
        {
          label: "Total Orders",
          value: fmt(stats.totalOrders),
          icon: ShoppingBag,
          accent: "#2563eb",
          bg: "#eff6ff",
          sub: `${fmt(stats.pendingOrders)} pending`,
        },
        {
          label: "Customers",
          value: fmt(stats.totalCustomers),
          icon: Users,
          accent: "#7c3aed",
          bg: "#f5f3ff",
          sub: "Registered accounts",
        },
        {
          label: "Products",
          value: fmt(stats.totalProducts),
          icon: Package,
          accent: "#0891b2",
          bg: "#ecfeff",
          sub: `${lowStock.length} low / out of stock`,
        },
      ]
    : [];

  const orderStatusCards = stats
    ? [
        { label: "Pending",   value: stats.pendingOrders,   icon: Clock,        color: "#d97706" },
        { label: "Shipped",   value: stats.shippedOrders,   icon: Truck,        color: "#2563eb" },
        { label: "Delivered", value: stats.deliveredOrders, icon: CheckCircle,  color: "#16a34a" },
        { label: "Cancelled", value: stats.cancelledOrders, icon: XCircle,      color: "#dc2626" },
      ]
    : [];

  return (
    <main className="dash-page">
      <div className="dash-wrap">

        {/* ── TOP BAR ── */}
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <div className="dash-topbar-icon">
              <LayoutDashboard size={22} />
            </div>
            <div>
              <p className="dash-eyebrow">SHOPHUB ADMIN</p>
              <h1 className="dash-title">Store Overview</h1>
            </div>
          </div>

          <div className="dash-topbar-right">
            {lastRefresh && (
              <span className="dash-last-refresh">
                Updated {fmtDate(lastRefresh)}
              </span>
            )}
            <button
              className="dash-refresh-btn"
              onClick={fetchStats}
              disabled={loading}
              aria-label="Refresh dashboard"
            >
              <RefreshCw size={15} className={loading ? "dash-spin" : ""} />
              Refresh
            </button>
            <Link to="/" className="dash-visit-btn">
              <Store size={15} />
              Visit Store
            </Link>
          </div>
        </header>

        {/* ── WELCOME BANNER ── */}
        <div className="dash-welcome">
          <div className="dash-welcome-left">
            <span className="dash-welcome-wave">👋</span>
            <div>
              <h2>Welcome back, {user?.name || "Admin"}!</h2>
              <p>Here's what's happening in your store today.</p>
            </div>
          </div>
          <div className="dash-welcome-links">
            <Link to="/admin/products" className="dash-shortcut">
              <Package size={16} /> Manage Products
            </Link>
            <Link to="/admin/orders" className="dash-shortcut">
              <ShoppingCart size={16} /> Manage Orders
            </Link>
          </div>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div className="dash-error">
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        {/* ── LOADING SKELETONS ── */}
        {loading && (
          <div className="dash-skeleton-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="dash-skeleton-card" key={i} />
            ))}
          </div>
        )}

        {!loading && stats && (
          <>
            {/* ── KPI CARDS ── */}
            <section className="dash-kpi-grid">
              {kpiCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    className="dash-kpi-card"
                    key={card.label}
                    style={{ "--accent": card.accent, "--bg": card.bg }}
                  >
                    <div className="dash-kpi-icon">
                      <Icon size={22} />
                    </div>
                    <div className="dash-kpi-body">
                      <span className="dash-kpi-label">{card.label}</span>
                      <strong className="dash-kpi-value">{card.value}</strong>
                      <span className="dash-kpi-sub">{card.sub}</span>
                    </div>
                    <ArrowUpRight size={18} className="dash-kpi-arrow" />
                  </article>
                );
              })}
            </section>

            {/* ── ORDER STATUS ROW ── */}
            <section className="dash-status-row">
              <div className="dash-section-label">
                <TrendingUp size={15} />
                Order Breakdown
              </div>
              <div className="dash-status-cards">
                {orderStatusCards.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      className="dash-status-card"
                      key={s.label}
                      style={{ "--c": s.color }}
                    >
                      <Icon size={18} style={{ color: s.color }} />
                      <span>{s.label}</span>
                      <strong style={{ color: s.color }}>{fmt(s.value)}</strong>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── TWO-COLUMN ANALYTICS ── */}
            <div className="dash-analytics-row">

              {/* Orders last 7 days */}
              <div className="dash-panel">
                <div className="dash-panel-header">
                  <div>
                    <h3>Orders — Last 7 Days</h3>
                    <p>Daily order volume</p>
                  </div>
                  <BarChart2 size={18} />
                </div>
                <MiniBarChart data={ordersByDay} />
              </div>

              {/* Revenue by category */}
              <div className="dash-panel">
                <div className="dash-panel-header">
                  <div>
                    <h3>Revenue by Category</h3>
                    <p>Top-performing product categories</p>
                  </div>
                  <CircleDollarSign size={18} />
                </div>
                <CategoryRevenue data={catRevenue} />
              </div>

            </div>

            {/* ── RECENT ORDERS + LOW STOCK ── */}
            <div className="dash-bottom-row">

              {/* Recent orders */}
              <div className="dash-panel dash-panel--tall">
                <div className="dash-panel-header">
                  <div>
                    <h3>Recent Orders</h3>
                    <p>Last 5 customer orders</p>
                  </div>
                  <Link to="/admin/orders" className="dash-panel-link">
                    View All <ArrowRight size={14} />
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <p className="dash-no-data">No orders yet.</p>
                ) : (
                  <div className="dash-orders-table">
                    <div className="dash-orders-thead">
                      <span>Order</span>
                      <span>Customer</span>
                      <span>Amount</span>
                      <span>Status</span>
                      <span>Date</span>
                    </div>
                    {recentOrders.map((o) => (
                      <div className="dash-orders-row" key={o._id}>
                        <span className="dash-order-id">
                          #{o._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="dash-order-customer">
                          {o.user?.name || o.delivery?.fullName || "—"}
                        </span>
                        <span className="dash-order-amount">
                          ETB {fmt(o.totalAmount)}
                        </span>
                        <StatusBadge status={o.status} />
                        <span className="dash-order-date">
                          {fmtDate(o.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Low / out of stock */}
              <div className="dash-panel dash-panel--tall">
                <div className="dash-panel-header">
                  <div>
                    <h3>Stock Alerts</h3>
                    <p>Low or out-of-stock products</p>
                  </div>
                  <Link to="/admin/products" className="dash-panel-link">
                    Manage <ArrowRight size={14} />
                  </Link>
                </div>

                {lowStock.length === 0 ? (
                  <p className="dash-no-data">✅ All products are well stocked.</p>
                ) : (
                  <div className="dash-stock-list">
                    {lowStock.map((p) => (
                      <div className="dash-stock-row" key={p._id}>
                        <img
                          src={getProductImageUrl(p.image)}
                          alt={p.name}
                          className="dash-stock-img"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                        <div className="dash-stock-info">
                          <span className="dash-stock-name">{p.name}</span>
                          <span className="dash-stock-cat">{p.category}</span>
                        </div>
                        <span
                          className={`dash-stock-qty ${
                            p.stockQuantity === 0
                              ? "dash-stock-qty--zero"
                              : "dash-stock-qty--low"
                          }`}
                        >
                          {p.stockQuantity === 0
                            ? "Out of stock"
                            : `${p.stockQuantity} left`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* ── MANAGEMENT SHORTCUTS ── */}
            <section className="dash-mgmt-grid">
              <Link to="/admin/products" className="dash-mgmt-card">
                <div className="dash-mgmt-icon">
                  <Package size={28} />
                </div>
                <h3>Products</h3>
                <p>Add, edit, delete products and manage inventory.</p>
                <span className="dash-mgmt-cta">
                  Manage Products <ArrowRight size={15} />
                </span>
              </Link>

              <Link to="/admin/orders" className="dash-mgmt-card">
                <div className="dash-mgmt-icon">
                  <ShoppingCart size={28} />
                </div>
                <h3>Orders</h3>
                <p>Review customer orders and update delivery statuses.</p>
                <span className="dash-mgmt-cta">
                  Manage Orders <ArrowRight size={15} />
                </span>
              </Link>

              <Link to="/admin/messages" className="dash-mgmt-card">
                <div className="dash-mgmt-icon" style={{ background: "#f0f9ff", color: "#0891b2" }}>
                  <MessageSquare size={28} />
                </div>
                <h3>Messages</h3>
                <p>Read and reply to customer contact form enquiries.</p>
                <span className="dash-mgmt-cta" style={{ color: "#0891b2" }}>
                  View Messages <ArrowRight size={15} />
                </span>
              </Link>

              <div className="dash-mgmt-card dash-mgmt-card--stat">
                <div className="dash-mgmt-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                  <CheckCircle size={28} />
                </div>
                <h3>Fulfilment Rate</h3>
                <strong className="dash-mgmt-big">
                  {stats.totalOrders > 0
                    ? `${Math.round((stats.deliveredOrders / stats.totalOrders) * 100)}%`
                    : "—"}
                </strong>
                <p>Orders successfully delivered</p>
              </div>

              <div className="dash-mgmt-card dash-mgmt-card--stat">
                <div className="dash-mgmt-icon" style={{ background: "#fef9c3", color: "#d97706" }}>
                  <AlertTriangle size={28} />
                </div>
                <h3>Needs Attention</h3>
                <strong className="dash-mgmt-big" style={{ color: "#d97706" }}>
                  {fmt(stats.pendingOrders)}
                </strong>
                <p>Orders waiting to be shipped</p>
              </div>
            </section>

          </>
        )}

      </div>
    </main>
  );
}

export default AdminDashboard;
