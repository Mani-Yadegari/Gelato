import "./Css/Cart.css";
import ShoppingBasket from "../assets/ShoppingBasket.jpg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Toast from "./Toast.jsx";

export default function Cart({
  products,
  quantities,
  setQuantities,
  clearCart,
}) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({
    siteActive: true,
    openingHour: "09:00",
    closingHour: "23:00",
  });

  // 📦 فیلتر محصولات در سبد خرید
  const cartItems = products.filter((item) => quantities[item._id] > 0);

  // 💰 محاسبه مجموع قیمت
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * quantities[item._id],
    0
  );

  // ➕ افزایش تعداد محصول
  const addBtn = (id) => {
    const updated = { ...quantities, [id]: (quantities[id] || 0) + 1 };
    setQuantities(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ➖ کاهش تعداد محصول
  const subBtn = (id) => {
    const updated = { ...quantities };
    if (updated[id] > 1) updated[id] -= 1;
    else delete updated[id];
    setQuantities(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🧾 پاک کردن کل سبد
  const handleClearCart = () => {
    setQuantities({});
    localStorage.removeItem("cart");
    clearCart?.();
    setToast({ type: "info", message: "سبد خرید پاک شد." });
  };

  // 🔹 گرفتن تنظیمات فروشگاه از سرور
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("https://gelatocafe.ir/api/settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("خطا در دریافت تنظیمات:", err);
      }
    };
    fetchSettings();
  }, []);

  // ✅ هدایت به چک‌اوت با بررسی ساعت کاری و وضعیت فروشگاه
  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    const now = new Date();
    const currentTime =
      `${now.getHours()}`.padStart(2, "0") +
      ":" +
      `${now.getMinutes()}`.padStart(2, "0");

    if (!token) {
      setToast({
        type: "warning",
        message: "برای ادامه ابتدا وارد حساب کاربری خود شوید.",
      });
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    if (cartItems.length === 0) {
      setToast({ type: "error", message: "سبد خرید شما خالی است!" });
      return;
    }

    // 🔹 بررسی وضعیت فروشگاه
    if (!settings.siteActive) {
      setToast({ type: "error", message: " فروشگاه فعلا غیر فعال است!" });
      return;
    }

    // 🔹 بررسی ساعت کاری
    if (
      currentTime < settings.openingHour ||
      currentTime > settings.closingHour
    ) {
      setToast({
        type: "error",
        message: " خارج از ساعت کاری فروشگاه هستید!",
      });
      return;
    }

    // همه چیز درست بود، هدایت به چک‌اوت
    navigate("/checkout");
  };

  return (
    <section id="cart">
      <div className="container">
        <div className="title-container">
          <button onClick={handleClearCart}>
            <span className="material-symbols-outlined">delete</span>
          </button>
          <div className="title">
            <span className="material-symbols-outlined">shopping_cart</span>
            <h2>سبد خرید شما</h2>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="null">
            <img src={ShoppingBasket} alt="سبد خرید" />
            <p>سبد خرید خالی است!</p>
          </div>
        ) : (
          <ul>
            <div className="items">
              {cartItems.map((item) => (
                <li key={item._id}>
                  <div className="right">
                    <p>{item.name}</p>
                    <p>
                      قیمت کل:{" "}
                      {(item.price * quantities[item._id]).toLocaleString()}{" "}
                      تومان
                    </p>
                  </div>

                  <div className="left">
                    <button id="add" onClick={() => addBtn(item._id)}>
                      <span className="material-symbols-outlined">
                        add_circle
                      </span>
                    </button>

                    <p>{quantities[item._id]}</p>

                    <button onClick={() => subBtn(item._id)}>
                      <span className="material-symbols-outlined">
                        do_not_disturb_on
                      </span>
                    </button>
                  </div>
                </li>
              ))}
            </div>

            <div className="bottom">
              <div>
                <p>رایگان</p>
                <p>هزینه ارسال</p>
              </div>
              <div>
                <p>{totalPrice.toLocaleString()} تومان</p>
                <p>هزینه کل</p>
              </div>
              <div className="button-container">
                <button
                  onClick={handleCheckout}
                  disabled={!settings.siteActive} // غیر فعال وقتی فروشگاه خاموش است
                >
                  {settings.siteActive ? "تکمیل سفارش" : "فروشگاه غیر فعال است"}
                </button>
              </div>
            </div>
          </ul>
        )}
      </div>

      {/* 📢 Toast بالا سمت راست */}
      {toast && (
        <div className="toast-container-top-right">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </section>
  );
}
