import { useEffect, useState } from "react";
import {
  Mail,
  RefreshCw,
  Trash2,
  CheckCheck,
  MessageSquare,
  Clock,
  Filter,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AdminMessages.css";

const STATUS_OPTIONS = ["All", "Unread", "Read", "Replied"];

const STATUS_META = {
  Unread:  { color: "#d97706", bg: "#fef9c3" },
  Read:    { color: "#2563eb", bg: "#dbeafe" },
  Replied: { color: "#16a34a", bg: "#dcfce7" },
};

function AdminMessages() {
  const { token } = useAuth();
  const [messages, setMessages]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [filter, setFilter]           = useState("All");
  const [expandedId, setExpandedId]   = useState(null);
  const [savingId, setSavingId]       = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchMessages(); }, [token]);

  const updateStatus = async (id, status) => {
    setSavingId(id);
    try {
      const { data } = await api.patch(
        `/contact/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: data.contact.status } : m))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setSavingId(null);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete message.");
    }
  };

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-ET", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const filtered =
    filter === "All" ? messages : messages.filter((m) => m.status === filter);

  const counts = {
    All:     messages.length,
    Unread:  messages.filter((m) => m.status === "Unread").length,
    Read:    messages.filter((m) => m.status === "Read").length,
    Replied: messages.filter((m) => m.status === "Replied").length,
  };

  return (
    <main className="adm-msg-page">
      <div className="adm-msg-wrap">

        {/* Header */}
        <header className="adm-msg-header">
          <div>
            <span className="adm-msg-eyebrow">SHOPHUB ADMIN</span>
            <h1>Contact Messages</h1>
            <p>Customer enquiries from the Contact Us form.</p>
          </div>
          <button
            className="adm-msg-refresh"
            onClick={fetchMessages}
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? "adm-spin" : ""} />
            Refresh
          </button>
        </header>

        {/* Stats row */}
        <div className="adm-msg-stats">
          {STATUS_OPTIONS.map((s) => (
            <div
              key={s}
              className={`adm-msg-stat ${filter === s ? "adm-msg-stat--active" : ""}`}
              onClick={() => setFilter(s)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setFilter(s)}
            >
              <span className="adm-msg-stat-label">{s}</span>
              <strong className="adm-msg-stat-val">{counts[s]}</strong>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="adm-msg-filter-bar">
          <Filter size={14} />
          <span>Showing:</span>
          <strong>{filter}</strong>
          <span>({filtered.length} message{filtered.length !== 1 ? "s" : ""})</span>
        </div>

        {error && <div className="adm-msg-error">{error}</div>}

        {/* Loading */}
        {loading && (
          <div className="adm-msg-empty">
            <div className="adm-msg-loader" />
            <p>Loading messages…</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="adm-msg-empty">
            <MessageSquare size={40} />
            <h3>No {filter !== "All" ? filter.toLowerCase() : ""} messages</h3>
            <p>Customer messages will appear here.</p>
          </div>
        )}

        {/* Message list */}
        {!loading && filtered.length > 0 && (
          <div className="adm-msg-list">
            {filtered.map((msg) => {
              const meta = STATUS_META[msg.status] || STATUS_META.Unread;
              const isExpanded = expandedId === msg._id;

              return (
                <article
                  className={`adm-msg-card ${msg.status === "Unread" ? "adm-msg-card--unread" : ""}`}
                  key={msg._id}
                >
                  {/* Card top row */}
                  <div
                    className="adm-msg-top"
                    onClick={() => setExpandedId(isExpanded ? null : msg._id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setExpandedId(isExpanded ? null : msg._id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="adm-msg-avatar">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="adm-msg-meta">
                      <div className="adm-msg-name-row">
                        <span className="adm-msg-name">{msg.name}</span>
                        {msg.status === "Unread" && (
                          <span className="adm-msg-new-dot" aria-label="Unread" />
                        )}
                      </div>
                      <span className="adm-msg-email">{msg.email}</span>
                      <span className="adm-msg-subject">{msg.subject}</span>
                    </div>

                    <div className="adm-msg-right">
                      <span
                        className="adm-msg-status-badge"
                        style={{ color: meta.color, background: meta.bg }}
                      >
                        {msg.status}
                      </span>
                      <span className="adm-msg-date">
                        <Clock size={12} />
                        {fmtDate(msg.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Expanded body */}
                  {isExpanded && (
                    <div className="adm-msg-body">
                      <div className="adm-msg-text">
                        <p>{msg.message}</p>
                      </div>

                      <div className="adm-msg-actions">
                        <div className="adm-msg-status-select">
                          <label>Status:</label>
                          <select
                            value={msg.status}
                            disabled={savingId === msg._id}
                            onChange={(e) => updateStatus(msg._id, e.target.value)}
                          >
                            <option value="Unread">Unread</option>
                            <option value="Read">Read</option>
                            <option value="Replied">Replied</option>
                          </select>
                          {savingId === msg._id && (
                            <span className="adm-msg-saving">Saving…</span>
                          )}
                        </div>

                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}&body=Hi ${encodeURIComponent(msg.name)},%0A%0A`}
                          className="adm-msg-reply-btn"
                          onClick={() => updateStatus(msg._id, "Replied")}
                        >
                          <CheckCheck size={15} />
                          Reply via Email
                        </a>

                        <button
                          className="adm-msg-delete-btn"
                          onClick={() => deleteMessage(msg._id)}
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}

export default AdminMessages;
