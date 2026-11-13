import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";

import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductCard from "../components/ProductCard";

import { getProducts } from "../services/productService";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [addedId, setAddedId] = useState(null); // tracks last added item for toast

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        setError("Unable to load products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Unique categories from real data
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...cats];
  }, [products]);

  // Show up to 8 products, filtered by category
  const displayed = useMemo(() => {
    const pool =
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory);
    return pool.slice(0, 8);
  }, [products, activeCategory]);

  // Notify when cart button fires (for the toast shown by ProductCard)
  const handleAddedToCart = (productId) => {
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 2200);
  };

  return (
    <>
      <main>
        <Hero />
        <CategorySection />
        {/* ── TRENDING PRODUCTS ── */}
        <section className="trending-section" id="products">

          {/* Section header */}
          <div className="trending-header">
            <div className="trending-title-group">
              <span className="trending-eyebrow">
                <TrendingUp size={13} />
                HANDPICKED FOR YOU
              </span>
              <h2 className="trending-title">Trending Products</h2>
              <p className="trending-subtitle">
                Discover our most popular picks loved by thousands of customers.
              </p>
            </div>

            <Link to="/products" className="trending-view-all">
              View All Products
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Category filter tabs */}
          {!loading && !error && categories.length > 1 && (
            <div className="trending-tabs" role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`trending-tab ${
                    activeCategory === cat ? "trending-tab--active" : ""
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="trending-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="product-skeleton" key={i} aria-hidden="true">
                  <div className="skeleton-image" />
                  <div className="skeleton-body">
                    <div className="skeleton-line skeleton-line--short" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line skeleton-line--med" />
                    <div className="skeleton-bottom">
                      <div className="skeleton-price" />
                      <div className="skeleton-btn" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="trending-error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          )}

          {/* Product grid */}
          {!loading && !error && (
            <>
              {displayed.length > 0 ? (
                <div className="trending-grid">
                  {displayed.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddedToCart={handleAddedToCart}
                      justAdded={addedId === product._id}
                    />
                  ))}
                </div>
              ) : (
                <div className="trending-empty">
                  <p>No products in this category yet.</p>
                  <button onClick={() => setActiveCategory("All")}>
                    Show All
                  </button>
                </div>
              )}

              {/* Bottom CTA */}
              <div className="trending-cta">
                <Link to="/products" className="trending-cta-btn">
                  Explore Full Catalogue
                  <ArrowRight size={17} />
                </Link>
              </div>
            </>
          )}

        </section>
      </main>
    </>
  );
}

export default Home;
