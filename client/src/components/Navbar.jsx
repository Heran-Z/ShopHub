
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { readCart } from "../services/cartUtils";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const userId = user?._id || user?.id || null;

  const [search, setSearch]                 = useState("");
  const [searchOpen, setSearchOpen]         = useState(false);
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [cartCount, setCartCount]           = useState(0);

  const searchInputRef = useRef(null);
  const searchWrapRef  = useRef(null);

  // ── cart count badge ─────────────────────────────
  const refreshCartCount = () => {
    try {
      const cart  = readCart(userId);
      const total = cart.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
    window.addEventListener("cartUpdated", refreshCartCount);
    return () => window.removeEventListener("cartUpdated", refreshCartCount);
  }, [userId]);

  // ── auto-focus search ────────────────────────────
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // ── close search on outside click ───────────────
  useEffect(() => {
    const handler = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── close drawer on route change / resize ───────
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 820) setDrawerOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── search submit ────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setSearch("");
    setSearchOpen(false);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate("/login");
  };

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <header className="navbar">
        <div className="nav-container">

          {/* Logo */}
          <Link to="/" className="logo" onClick={closeDrawer}>
            Shop<span>Hub.</span>
          </Link>

          {/* Desktop nav links (hidden on mobile) */}
          <nav className="nav-links" aria-label="Main navigation">
            <Link to="/">Home</Link>
            <Link to="/products">Shop</Link>
            {isAuthenticated && (
              <>
                <Link to="/my-orders">My Orders</Link>
                <Link to="/profile">Profile</Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className="admin-nav-link">
                <LayoutDashboard size={15} />
                Admin
              </Link>
            )}
          </nav>

          {/* Actions row */}
          <div className="nav-actions">

            {/* Search */}
            <div
              className={`nav-search-wrap ${searchOpen ? "nav-search-wrap--open" : ""}`}
              ref={searchWrapRef}
            >
              <button
                className="nav-icon-btn nav-search-trigger"
                aria-label={searchOpen ? "Close search" : "Open search"}
                onClick={() => setSearchOpen((v) => !v)}
              >
                {searchOpen ? <X size={19} /> : <Search size={19} />}
              </button>

              <form
                className="nav-search-form"
                onSubmit={handleSearch}
                aria-hidden={!searchOpen}
              >
                <Search size={15} className="nav-search-icon" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  aria-label="Search products"
                  tabIndex={searchOpen ? 0 : -1}
                />
                {search && (
                  <button
                    type="button"
                    className="nav-search-clear"
                    onClick={() => { setSearch(""); searchInputRef.current?.focus(); }}
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
                <button
                  type="submit"
                  className="nav-search-submit"
                  tabIndex={searchOpen ? 0 : -1}
                >
                  Go
                </button>
              </form>
            </div>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="nav-icon-btn"
              aria-label="Favorites"
              onClick={closeDrawer}
            >
              <Heart size={19} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="nav-icon-btn nav-cart-btn"
              aria-label="Cart"
              onClick={closeDrawer}
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="nav-cart-badge">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Desktop auth / user pill */}
            {!isAuthenticated ? (
              <>
                <Link to="/login"    className="nav-auth-btn nav-auth-btn--ghost">Login</Link>
                <Link to="/register" className="nav-auth-btn nav-auth-btn--solid">Register</Link>
              </>
            ) : (
              <div className="nav-user-menu">
                <Link to="/profile" className="nav-user-pill" aria-label="My profile">
                  <div className="nav-user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="nav-user-name">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
                <button
                  type="button"
                  className="nav-icon-btn nav-logout-btn"
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="mobile-menu"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              {drawerOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── rendered outside nav-container
           so it always spans 100vw and never overflows      */}
      <nav
        className={`nav-drawer ${drawerOpen ? "open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!drawerOpen}
      >
        <Link to="/"         onClick={closeDrawer}>Home</Link>
        <Link to="/products" onClick={closeDrawer}>Shop</Link>

        {isAuthenticated && (
          <>
            <Link to="/my-orders" onClick={closeDrawer}>My Orders</Link>
            <Link to="/profile"   onClick={closeDrawer}>My Profile</Link>
            <Link to="/cart"      onClick={closeDrawer}>
              My Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link to="/favorites" onClick={closeDrawer}>Favourites</Link>
          </>
        )}

        {isAdmin && (
          <Link to="/admin" className="admin-nav-link" onClick={closeDrawer}>
            <LayoutDashboard size={15} />
            Admin Dashboard
          </Link>
        )}

        <div className="nav-drawer-divider" />

        {!isAuthenticated ? (
          <div className="nav-drawer-auth">
            <Link
              to="/login"
              className="nav-auth-btn nav-auth-btn--ghost"
              onClick={closeDrawer}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="nav-auth-btn nav-auth-btn--solid"
              onClick={closeDrawer}
            >
              Register
            </Link>
          </div>
        ) : (
          <button
            className="nav-drawer-logout"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        )}
      </nav>
    </>
  );
}

export default Navbar;
