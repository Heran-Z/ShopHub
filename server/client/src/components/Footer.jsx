import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">

        <div>
          <Link to="/" className="logo">
            Shop<span>Hub.</span>
          </Link>

          <p>
            Your destination for quality products
            and a smarter shopping experience.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/products">Shop</Link>
          <Link to="/cart">My Cart</Link>
          <Link to="/my-orders">My Orders</Link>
        </div>

        <div>
          <h3>Customer Service</h3>
          <Link to="/contact">Contact Us</Link>
          <a href="#footer">Privacy Policy</a>
          <a href="#footer">Terms &amp; Conditions</a>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 ShopHub. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
