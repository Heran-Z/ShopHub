import {
  Laptop,
  Shirt,
  Watch,
  ShoppingBasket,
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Laptop },
  { name: "Fashion", icon: Shirt },
  { name: "Accessories", icon: Watch },
  { name: "Lifestyle", icon: ShoppingBasket },
];

function CategorySection() {
  return (
    <section className="categories-section" id="categories">
      <div className="section-heading">
        <div>
          <span className="section-label">EXPLORE</span>
          <h2>Shop by Category</h2>
        </div>

        <p>Everything you need, all in one place.</p>
      </div>

      <div className="category-grid">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <a
              href="#products"
              className="category-card"
              key={category.name}
            >
              <div className="category-icon">
                <Icon size={30} />
              </div>

              <h3>{category.name}</h3>
              <span>Explore →</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default CategorySection;