// src/pages/GreenProductsPage.jsx
import React, { useState, useEffect } from "react";
import "./ProductsPage.css";

const ProductsPage = ({ setCurrentPage, addToCart }) => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sustainability: "",
    material: "",
    category: "",
    priceRange: { min: 0, max: 1000 },
  });

  const ecoCategories = {
    electronics: "Energy-Efficient Electronics",
    jewelery: "Sustainable Jewelry",
    "men's clothing": "Ethical Men's Fashion",
    "women's clothing": "Sustainable Women's Fashion",
  };

  const materialsByCategory = {
    electronics: ["recycled plastic", "biodegradable", "energy star"],
    jewelery: ["recycled metals", "lab-grown gems", "sustainable wood"],
    "men's clothing": ["organic cotton", "hemp", "recycled polyester"],
    "women's clothing": ["organic cotton", "hemp", "recycled polyester"],
  };

  const certifications = [
    "Green Seal",
    "Energy Star",
    "USDA Organic",
    "Fair Trade Certified",
    "Rainforest Alliance",
    "LEED Certified",
    "FSC Certified",
    "Carbon Neutral",
    "B Corp",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        const greenProducts = data.map((product) => {
          const category = product.category;
          const possibleMaterials = materialsByCategory[category] || [
            "recycled",
            "organic",
            "biodegradable",
          ];

          return {
            ...product,
            title: addEcoPrefix(product.title, category),
            description: enhanceDescription(product.description, category),
            material:
              possibleMaterials[
                Math.floor(Math.random() * possibleMaterials.length)
              ],
            categoryDisplay: ecoCategories[category] || "Sustainable Products",
            certifications: getRandomCertifications(),
            carbonReduction: Math.floor(Math.random() * 85) + 15,
            sustainabilityScore: Math.floor(Math.random() * 40) + 60,
            waterConservation: Math.floor(Math.random() * 70) + 30,
            recycledContent: Math.floor(Math.random() * 70) + 30,
            sustainabilityLevel: ["bronze", "silver", "gold", "platinum"][
              Math.floor(Math.random() * 4)
            ],
          };
        });

        setProducts(greenProducts);
        setVisibleProducts(greenProducts);
        setLoading(false);
      } catch (err) {
        setError("Failed to load green products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addEcoPrefix = (title, category) => {
    const ecoPrefixes = {
      electronics: ["Energy-Efficient", "Solar-Powered", "Low-Impact"],
      jewelery: ["Ethical", "Sustainable", "Eco-Friendly"],
      "men's clothing": ["Organic", "Fair-Trade", "Sustainable"],
      "women's clothing": ["Organic", "Fair-Trade", "Sustainable"],
    };
    const prefixes = ecoPrefixes[category] || [
      "Eco-Friendly",
      "Sustainable",
      "Green",
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    if (title.includes(prefix)) return title;
    return `${prefix} ${title}`;
  };

  const enhanceDescription = (description) => {
    const ecoDescriptions = [
      "Made with sustainable materials and eco-friendly manufacturing processes.",
      "Designed to minimize environmental impact while maximizing performance.",
      "Produced using renewable energy and responsibly sourced materials.",
      "Manufactured with a commitment to reducing carbon emissions and waste.",
      "Created with environmental sustainability as a core principle.",
    ];
    return `${description} ${
      ecoDescriptions[Math.floor(Math.random() * ecoDescriptions.length)]
    }`;
  };

  const getRandomCertifications = () =>
    certifications.filter(() => Math.random() > 0.6);

  useEffect(() => {
    const filtered = products.filter((p) => {
      if (
        filters.sustainability &&
        p.sustainabilityLevel !== filters.sustainability
      )
        return false;
      if (filters.material && !p.material.includes(filters.material))
        return false;
      if (filters.category && p.category !== filters.category) return false;
      if (p.price < filters.priceRange.min || p.price > filters.priceRange.max)
        return false;
      return true;
    });
    setVisibleProducts(filtered);
  }, [products, filters]);

  const categories = [...new Set(products.map((p) => p.category))];
  const materials = [
    ...new Set(products.flatMap((p) => (p.material ? [p.material] : []))),
  ];

  const getSustainabilityColor = (score) => {
    if (score >= 90) return "score-green-700";
    if (score >= 80) return "score-green-600";
    if (score >= 70) return "score-green-500";
    return "score-yellow-600";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading sustainable products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-box">
        <svg className="error-icon" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667
               1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34
               16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="error-message">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-error"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <section className="hero">
        <h1>EcoMarket: Green Products Marketplace</h1>
        <p>
          Shop our curated selection of sustainable, eco-friendly products that
          help reduce your environmental footprint.
        </p>
        <div className="hero-tags">
          <span>Carbon Neutral Shipping</span>
          <span>Plastic-Free Packaging</span>
          <span>1% For The Planet</span>
        </div>
      </section>

      <section className="filters">
        <h2>Filter Sustainable Products</h2>
        <div className="filter-grid">
          <div className="filter-group">
            <label>Sustainability Level</label>
            <select
              value={filters.sustainability}
              onChange={(e) =>
                setFilters({ ...filters, sustainability: e.target.value })
              }
            >
              <option value="">All Levels</option>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sustainable Material</label>
            <select
              value={filters.material}
              onChange={(e) =>
                setFilters({ ...filters, material: e.target.value })
              }
            >
              <option value="">All Materials</option>
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {ecoCategories[c] || c}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>
              Price: ${filters.priceRange.min} – ${filters.priceRange.max}
            </label>
            <div className="price-sliders">
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange.min}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: {
                      ...filters.priceRange,
                      min: +e.target.value,
                    },
                  })
                }
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange.max}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: {
                      ...filters.priceRange,
                      max: +e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
        <button
          onClick={() =>
            setFilters({
              sustainability: "",
              material: "",
              category: "",
              priceRange: { min: 0, max: 1000 },
            })
          }
          className="btn btn-reset"
        >
          Reset Filters
        </button>
      </section>

      <div className="results-header">
        <p>
          Showing {visibleProducts.length} of {products.length} eco-friendly
          products
        </p>
        <small>Helping you reduce your carbon footprint since 2024</small>
      </div>

      <section className="products-grid">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className={`badge badge-${product.sustainabilityLevel}`}>
                {product.sustainabilityLevel.charAt(0).toUpperCase() +
                  product.sustainabilityLevel.slice(1)}{" "}
                Level
              </div>
              <div className="image-wrapper">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-info">
                <span className="category-label">
                  {ecoCategories[product.category] || "Product"}
                </span>
                <h3>{product.title}</h3>
                <div className="price">
                  <strong>${product.price.toFixed(2)}</strong>{" "}
                  <small>Includes eco-tax</small>
                </div>

                <div className="sustainability-score">
                  <span>Sustainability Score</span>
                  <span
                    className={`score ${getSustainabilityColor(
                      product.sustainabilityScore
                    )}`}
                  >
                    {product.sustainabilityScore}/100
                  </span>
                  <div className="score-bar">
                    <div
                      className="fill"
                      style={{ width: `${product.sustainabilityScore}%` }}
                    />
                  </div>
                </div>

                <div className="eco-metrics">
                  <div>-{product.carbonReduction}% CO₂</div>
                  <div>-{product.waterConservation}% Water</div>
                  <div>{product.recycledContent}% Recycled</div>
                  <div>{product.material}</div>
                </div>

                {product.certifications.length > 0 && (
                  <div className="certifications">
                    {product.certifications.slice(0, 2).map((c, i) => (
                      <span key={i}>{c}</span>
                    ))}
                    {product.certifications.length > 2 && (
                      <span>+{product.certifications.length - 2} more</span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => addToCart(product)}
                  className="btn btn-addcart"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No eco-friendly products match your current filters.</p>
            <button
              onClick={() =>
                setFilters({
                  sustainability: "",
                  material: "",
                  category: "",
                  priceRange: { min: 0, max: 1000 },
                })
              }
              className="btn btn-reset"
            >
              View All
            </button>
          </div>
        )}
      </section>

      <section className="commitment">
        <h2>Our Commitment to Sustainability</h2>
        <div className="commitment-grid">
          <div className="commitment-item">
            <h3>Renewable Energy</h3>
            <p>
              All our products are manufactured using 100% renewable energy
              sources, reducing carbon emissions.
            </p>
          </div>
          <div className="commitment-item">
            <h3>Plastic-Free Packaging</h3>
            <p>
              We use compostable, recycled, and plastic-free packaging for all
              our products and shipping.
            </p>
          </div>
          <div className="commitment-item">
            <h3>Carbon Offset</h3>
            <p>
              Every purchase includes a carbon offset contribution to support
              climate action projects worldwide.
            </p>
          </div>
        </div>
      </section>

      <button onClick={() => setCurrentPage("home")} className="btn btn-back">
        Back to Home
      </button>
    </div>
  );
};

export default ProductsPage;
