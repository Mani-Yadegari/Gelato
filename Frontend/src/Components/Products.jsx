import "./Css/Products.css";
import { useState, useEffect, useRef } from "react";
import Cart from "./Cart.jsx";
import axios from "axios";

export default function Products({ quantities, setQuantities }) {
  const [categories, setCategories] = useState({});
  const [cartPosition, setCartPosition] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const cartRef = useRef(null);

  const API_URL = "https://gelatocafe.ir/api";
  const BASE_URL = "https://gelatocafe.ir";

  const addBtn = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const subBtn = (id) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));

  const clearCart = () => setQuantities({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        const products = res.data;
        const grouped = {};

        products.forEach((p) => {
          if (!grouped[p.category]) grouped[p.category] = [];
          grouped[p.category].push(p);
        });

        Object.keys(grouped).forEach((cat) => {
          grouped[cat].sort((a, b) =>
            a.available === false ? 1 : b.available === false ? -1 : 0
          );
        });

        setCategories(grouped);
      } catch (err) {
        console.error("خطا در دریافت محصولات:", err);
      }
    };
    fetchProducts();
  }, []);

  const allProducts = Object.values(categories).flat();

  useEffect(() => {
    const handleScroll = () => {
      const cart = cartRef.current;
      const footer = document.querySelector("footer");
      if (!cart) return;

      const cartHeight = cart.offsetHeight;
      const maxScroll = footer ? footer.offsetTop - cartHeight - 20 : Infinity;
      const scrollY = window.scrollY;

      if (scrollY >= maxScroll) setCartPosition("stopped");
      else if (scrollY >= 450) setCartPosition("fixed");
      else setCartPosition("default");
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section className="products-sec" id="products">
      <div className={`cart-column ${cartPosition}`} ref={cartRef}>
        <Cart
          products={allProducts}
          setQuantities={setQuantities}
          quantities={quantities}
          subBtn={subBtn}
          clearCart={clearCart}
        />
      </div>

      <div className="products-column">
        {Object.entries(categories).map(([categoryName, products]) => (
          <div key={categoryName} className="category-section">
            <div className="title">
              <div className="line"></div>
              <h2>{categoryName}</h2>
              <div className="line"></div>
            </div>

            <div className="products-container">
              {products.map((elem) => (
                <div
                  key={elem._id}
                  className={`product ${
                    !elem.available
                      ? "unavailable"
                      : quantities[elem._id] > 0
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setSelectedProduct(elem)}
                >
                  <img
                    src={`${BASE_URL}${elem.image}`}
                    alt={elem.name}
                    loading="lazy"
                  />
                  <div>
                    <h3>{elem.name}</h3>
                    {elem.available ? (
                      <span>تومان {elem.price.toLocaleString()}</span>
                    ) : (
                      <span className="unavailable-text">ناموجود ❌</span>
                    )}
                    <div className="button-container">
                      {elem.available && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addBtn(elem._id);
                            }}
                          >
                            <span className="material-symbols-outlined">
                              add_circle
                            </span>
                          </button>
                          {quantities[elem._id] > 0 && (
                            <>
                              <span>{quantities[elem._id]}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  subBtn(elem._id);
                                }}
                              >
                                <span className="material-symbols-outlined">
                                  do_not_disturb_on
                                </span>
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedProduct(null)}
            >
              ✖
            </button>
            <img
              src={`${BASE_URL}${selectedProduct.image}`}
              alt={selectedProduct.name}
            />
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description || "بدون توضیحات"}</p>
            <span className="price">
              {selectedProduct.available
                ? `تومان ${selectedProduct.price.toLocaleString()}`
                : "ناموجود ❌"}
            </span>

            <div className="button-container modal-btns">
              {selectedProduct.available && (
                <>
                  <button onClick={() => addBtn(selectedProduct._id)}>
                    <span className="material-symbols-outlined">
                      add_circle
                    </span>
                  </button>

                  {quantities[selectedProduct._id] > 0 && (
                    <>
                      <span>{quantities[selectedProduct._id]}</span>
                      <button onClick={() => subBtn(selectedProduct._id)}>
                        <span className="material-symbols-outlined">
                          do_not_disturb_on
                        </span>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="cart-btn"
        onClick={() => setIsCartModalOpen(true)}
      >
        <span className="material-symbols-outlined">shopping_cart</span>
      </button>

      {isCartModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsCartModalOpen(false)}
        >
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setIsCartModalOpen(false)}
            >
              ✖
            </button>
            <Cart
              products={allProducts}
              setQuantities={setQuantities}
              quantities={quantities}
              clearCart={clearCart}
            />
          </div>
        </div>
      )}
    </section>
  );
}
