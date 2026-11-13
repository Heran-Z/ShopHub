import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import api from "../services/api";
import "./Contact.css";

const SUBJECTS = [
  "Order Issue",
  "Payment Problem",
  "Product Enquiry",
  "Returns & Refunds",
  "Account Help",
  "Delivery Status",
  "Other",
];

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const [touched, setTouched]   = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isValid = {
    name:    form.name.trim().length >= 2,
    email:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
    subject: form.subject !== "",
    message: form.message.trim().length >= 10,
  };

  const allValid = Object.values(isValid).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });

    if (!allValid) {
      setError("Please fill in all fields correctly.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/contact", {
        name:    form.name.trim(),
        email:   form.email.trim(),
        subject: form.subject,
        message: form.message.trim(),
      });

      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTouched({});
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">

      {/* ── HERO ── */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <span className="contact-eyebrow">
            <MessageSquare size={13} />
            GET IN TOUCH
          </span>
          <h1>We'd love to <span>hear from you.</span></h1>
          <p>
            Have a question, a problem with your order, or just want
            to say hello? Drop us a message and we'll get back to
            you within 24 hours.
          </p>
        </div>
      </section>

      <div className="contact-body">

        {/* ── INFO CARDS ── */}
        <aside className="contact-info">

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <Mail size={22} />
            </div>
            <div>
              <h3>Email Us</h3>
              <p>support@shophub.et</p>
              <small>We reply within 24 hours</small>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <Phone size={22} />
            </div>
            <div>
              <h3>Call Us</h3>
              <p>+251 911 234 567</p>
              <small>Mon – Sat, 8 AM – 6 PM</small>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <MapPin size={22} />
            </div>
            <div>
              <h3>Visit Us</h3>
              <p>Bole Road, Addis Ababa</p>
              <small>Ethiopia</small>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <Clock size={22} />
            </div>
            <div>
              <h3>Working Hours</h3>
              <p>Mon – Sat: 8 AM – 6 PM</p>
              <small>Sunday: Closed</small>
            </div>
          </div>

          {/* Quick links */}
          <div className="contact-quick-links">
            <h4>Quick Help</h4>
            <Link to="/my-orders">Track My Order →</Link>
            <Link to="/products">Browse Products →</Link>
            <Link to="/cart">View My Cart →</Link>
          </div>

        </aside>

        {/* ── FORM ── */}
        <div className="contact-form-wrap">

          {success ? (
            <div className="contact-success">
              <div className="contact-success-icon">
                <CheckCircle size={48} />
              </div>
              <h2>Message Sent!</h2>
              <p>
                Thanks for reaching out. Our team will get back to
                you at <strong>{form.email || "your email"}</strong> within 24 hours.
              </p>
              <button
                className="contact-send-another"
                onClick={() => setSuccess(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="contact-form-header">
                <h2>Send a Message</h2>
                <p>All fields are required.</p>
              </div>

              {error && (
                <div className="contact-error">{error}</div>
              )}

              {/* Name + Email */}
              <div className="contact-row">
                <div
                  className={`contact-field ${
                    touched.name && !isValid.name ? "contact-field--err" : ""
                  } ${
                    touched.name && isValid.name ? "contact-field--ok" : ""
                  }`}
                >
                  <label htmlFor="contact-name">Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                  {touched.name && !isValid.name && (
                    <span className="contact-hint">
                      Enter at least 2 characters
                    </span>
                  )}
                </div>

                <div
                  className={`contact-field ${
                    touched.email && !isValid.email ? "contact-field--err" : ""
                  } ${
                    touched.email && isValid.email ? "contact-field--ok" : ""
                  }`}
                >
                  <label htmlFor="contact-email">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {touched.email && !isValid.email && (
                    <span className="contact-hint">
                      Enter a valid email address
                    </span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div
                className={`contact-field ${
                  touched.subject && !isValid.subject ? "contact-field--err" : ""
                } ${
                  touched.subject && isValid.subject ? "contact-field--ok" : ""
                }`}
              >
                <label htmlFor="contact-subject">Subject</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select a subject…</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {touched.subject && !isValid.subject && (
                  <span className="contact-hint">Please choose a subject</span>
                )}
              </div>

              {/* Message */}
              <div
                className={`contact-field ${
                  touched.message && !isValid.message ? "contact-field--err" : ""
                } ${
                  touched.message && isValid.message ? "contact-field--ok" : ""
                }`}
              >
                <label htmlFor="contact-message">
                  Message
                  <span className="contact-char-count">
                    {form.message.length} chars
                    {form.message.length > 0 && form.message.length < 10 &&
                      ` (${10 - form.message.length} more needed)`}
                  </span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe your issue or question in detail…"
                  rows={6}
                />
                {touched.message && !isValid.message && (
                  <span className="contact-hint">
                    Message must be at least 10 characters
                  </span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="contact-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="contact-spinner" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </main>
  );
}

export default Contact;
