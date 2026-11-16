
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { getProductImageUrl } from "../services/productService";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("shophub_favorites") || "[]"
      );

      setFavorites(Array.isArray(saved) ? saved : []);
    } catch {
      setFavorites([]);
    }
  };

  useEffect(() => {
    loadFavorites();

    window.addEventListener("favoritesUpdated", loadFavorites);

    return () => {
      window.removeEventListener("favoritesUpdated", loadFavorites);
    };
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter(
      (product) => product._id !== id
    );

    localStorage.setItem(
      "shophub_favorites",
      JSON.stringify(updated)
    );

    setFavorites(updated);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  return (
    <main className="favorites-page">
      <div className="favorites-container">
        <span className="favorites-eyebrow">YOUR COLLECTION</span>
        <h1>My Favorites <Heart size={27} /></h1>
        <p>Your favorite ShopHub products in one place.</p>

        {favorites.length === 0 ? (
          <div className="favorites-empty">
            <Heart size={55} />
            <h2>No favorites yet</h2>
            <p>Save products you love to find them here.</p>
            <Link to="/products">
              <ShoppingBag size={18} />
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((product) => (
              <article className="favorite-card" key={product._id}>
                <Link to={`/products/${product._id}`}>
                  <img
                    src={getProductImageUrl(product.image)}
                    alt={product.name}
                  />
                </Link>

                <div className="favorite-info">
                  <h3>{product.name}</h3>

                  <strong>
                    ETB {Number(product.price).toLocaleString()}
                  </strong>

                  <div className="favorite-actions">
                    <Link to={`/products/${product._id}`}>
                      View Product
                    </Link>

                    <button
                      onClick={() => removeFavorite(product._id)}
                      aria-label={`Remove ${product.name} from favorites`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Favorites;
