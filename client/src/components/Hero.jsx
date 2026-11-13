
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero hero-animated">

      {/* Animated mesh gradient orbs */}
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      <div className="hero-orb hero-orb-3"></div>

      {/* Dot-grid texture */}
      <div className="hero-dots" aria-hidden="true"></div>

      {/* ── LEFT CONTENT ── */}
      <div className="hero-content hero-reveal">

        <div className="hero-label-pill">
          <span className="hero-label-dot"></span>
          NEW SEASON ARRIVALS
        </div>

        <h1>
          Shop Smarter,
          <br />
          Live <span className="hero-gradient-text">Better.</span>
        </h1>

        <p>
          Discover thousands of curated products at
          unbeatable prices. Fast delivery, easy returns,
          and a shopping experience you'll love.
        </p>

        <div className="hero-buttons">
          <Link to="/products" className="primary-btn">
            Shop Now <span className="btn-arrow">→</span>
          </Link>

          <a href="#categories" className="secondary-btn">
            Browse Categories
          </a>
        </div>

        {/* Trust badges */}
        <div className="hero-trust">
          <div className="hero-trust-item">
            <span>🚚</span>
            <small>Free Delivery</small>
          </div>
          <div className="hero-trust-divider"></div>
          <div className="hero-trust-item">
            <span>🔄</span>
            <small>Easy Returns</small>
          </div>
          <div className="hero-trust-divider"></div>
          <div className="hero-trust-item">
            <span>🔒</span>
            <small>Secure Checkout</small>
          </div>
          <div className="hero-trust-divider"></div>
          <div className="hero-trust-item">
            <span>⭐</span>
            <small>4.9 / 5 Rating</small>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>10k+</strong>
            <small>Happy Customers</small>
          </div>
          <div className="hero-stat-sep"></div>
          <div className="hero-stat">
            <strong>500+</strong>
            <small>Quality Products</small>
          </div>
          <div className="hero-stat-sep"></div>
          <div className="hero-stat">
            <strong>50+</strong>
            <small>Top Brands</small>
          </div>
        </div>

      </div>

      {/* ── RIGHT IMAGE ── */}
      <div className="hero-image hero-image-animated">

        <div className="hero-image-frame">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85"
            alt="Fashion shopping"
            loading="eager"
          />
          <div className="hero-image-overlay"></div>
        </div>

        {/* Floating deal card */}
        <div className="hero-floating-card">
          <div className="hero-card-icon">🔥</div>
          <div>
            <strong>Flash Sale</strong>
            <small>Up to 40% off today</small>
          </div>
          <span className="hero-card-arrow">→</span>
        </div>

        {/* Floating rating badge */}
        <div className="hero-floating-badge">
          <div className="hero-badge-stars">★★★★★</div>
          <div>
            <strong>Trusted Store</strong>
            <small>10,000+ reviews</small>
          </div>
        </div>

        {/* Floating delivery pill */}
        <div className="hero-floating-pill">
          <span>✅</span>
          <span>Free Shipping on orders over ETB 500</span>
        </div>

      </div>

    </section>
  );
}

export default Hero;
