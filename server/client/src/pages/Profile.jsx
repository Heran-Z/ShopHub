
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        <Link to="/" className="profile-logo">
          Shop<span>Hub</span>.
        </Link>

        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <h1>My Account</h1>
        <p className="profile-subtitle">
          Manage your ShopHub account.
        </p>

        <div className="profile-details">
          <div>
            <span>Full Name</span>
            <strong>{user?.name || "Not available"}</strong>
          </div>

          <div>
            <span>Email Address</span>
            <strong>{user?.email || "Not available"}</strong>
          </div>

          <div>
            <span>Account Role</span>
            <strong>{user?.role || "Customer"}</strong>
          </div>
        </div>

        <Link to="/" className="profile-home-button">
          Continue Shopping
        </Link>

        <button
          className="profile-logout-button"
          onClick={handleLogout}
        >
          Log Out
        </button>

      </div>
    </div>
  );
}

export default Profile;
