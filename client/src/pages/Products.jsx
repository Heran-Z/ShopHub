
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";

import {
  getProducts,
  getProductImageUrl,
} from "../services/productService";

import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states
  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Load saved favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("shophub_favorites") || "[]"
      );
    } catch {
      return [];
    }
  });

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(
          Array.isArray(data) ? data : data.products || []
        );
      } catch (err) {
        console.error("Product fetching error:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sync navbar search with URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Update search and URL
  const handleSearchChange = (value) => {
    setSearch(value);

    const updatedParams = new URLSearchParams(searchParams);

    if (value.trim()) {
      updatedParams.set("search", value);
    } else {
      updatedParams.delete("search");
    }

    setSearchParams(updatedParams, { replace: true });
  };

  // Toggle favorite
  const toggleFavorite = (product) => {
    const productId = product._id;

    const isAlreadyFavorite = favorites.some(
      (item) => item._id === productId
    );

    const updatedFavorites = isAlreadyFavorite
      ? favorites.filter((item) => item._id !== productId)
      : [...favorites, product];

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "shophub_favorites",
      JSON.stringify(updatedFavorites)
    );

    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  // Check favorite status
  const isFavorite = (productId) => {
    return favorites.some(
      (item) => item._id === productId
    );
  };

  // Get unique categories
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  // Search, filter and sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search by name
    if (search.trim()) {
      result = result.filter((product) =>
        String(product.name || "")
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      );
    }

    // Category filter
    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    // Minimum price
    if (minPrice !== "") {
      result = result.filter(
        (product) => Number(product.price) >= Number(minPrice)
      );
    }

    // Maximum price
    if (maxPrice !== "") {
      result = result.filter(
        (product) => Number(product.price) <= Number(maxPrice)
      );
    }

    // Price sorting
    if (sort === "low-high") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sort === "high-low") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    return result;
  }, [products, search, category, sort, minPrice, maxPrice]);

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
    setMinPrice("");
    setMaxPrice("");
    setSearchParams({});
  };

  return (
    <main className="products-page">

      {/* Hero section */}
      <section className="products-hero">
        <div>
          <span className="products-eyebrow">
            DISCOVER YOUR NEXT FAVORITE
          </span>

          <h1>
            Find products
            <br />
            you'll <span>love.</span>
          </h1>

          <p>
            Explore our collection of quality products
            selected for your everyday needs.
          </p>

          <a href="#product-catalog" className="shop-now-btn">
            Explore Collection →
          </a>
        </div>

        <div className="products-hero-decoration">
          <span>SHOP</span>
          <strong>SMART.</strong>
          <span>LIVE BETTER.</span>
        </div>
      </section>

      {/* Product catalog */}
      <section
        className="product-catalog"
        id="product-catalog"
      >
        <div className="catalog-heading">
          <div>
            <span className="products-eyebrow">
              OUR COLLECTION
            </span>

            <h2>Explore Products</h2>
          </div>

          <span className="product-count">
            {filteredProducts.length} products
          </span>
        </div>

        {/* Search and filters */}
        <div className="product-filters">

          {/* Search */}
          <div className="product-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                handleSearchChange(e.target.value)
              }
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>

          {/* Minimum price */}
          <input
            type="number"
            placeholder="Minimum price"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          {/* Maximum price */}
          <input
            type="number"
            placeholder="Maximum price"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          {/* Sorting */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="low-high">
              Price: Low to High
            </option>
            <option value="high-low">
              Price: High to Low
            </option>
          </select>

          {/* Clear filters */}
          <button
            type="button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

        {/* Loading */}
        {loading && (
          <div className="products-message">
            <div className="products-spinner"></div>
            <p>Loading your products...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="products-message error-message">
            <p>{error}</p>

            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="products-grid">

                {filteredProducts.map((product) => (
                  <article
                    className="product-card"
                    key={product._id}
                  >
                    <div className="product-image-container">

                      <Link to={`/products/${product._id}`}>
                        <img
                          src={getProductImageUrl(product.image)}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </Link>

                      <span className="product-category">
                        {product.category}
                      </span>

                      {/* Favorite button */}
                      <button
                        type="button"
                        className={`product-favorite-btn ${
                          isFavorite(product._id)
                            ? "is-favorite"
                            : ""
                        }`}
                        onClick={() => toggleFavorite(product)}
                        aria-label={
                          isFavorite(product._id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        title={
                          isFavorite(product._id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <Heart
                          size={21}
                          fill={
                            isFavorite(product._id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                    </div>

                    <div className="product-card-info">

                      <h3>{product.name}</h3>

                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-card-bottom">
                        <strong>
                          ETB {Number(product.price).toLocaleString()}
                        </strong>

                        <Link
                          to={`/products/${product._id}`}
                          className="view-product-btn"
                        >
                          View Details →
                        </Link>
                      </div>

                      <span
                        className={
                          product.stockQuantity > 0
                            ? "stock-available"
                            : "stock-unavailable"
                        }
                      >
                        {product.stockQuantity > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>

                    </div>
                  </article>
                ))}

              </div>
            ) : (
              <div className="products-message">
                <h3>No products found</h3>

                <p>
                  Try another search or adjust your filters.
                </p>

                <button onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}

      </section>
    </main>
  );
}

export default Products;
