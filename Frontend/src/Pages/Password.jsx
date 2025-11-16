import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Toast from "../Components/Toast.jsx";
import "./Css/Login.css";

export default function Password({ setUser }) {
  const [password, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotDisabled, setForgotDisabled] = useState(false);
  const [counter, setCounter] = useState(0);
  const [toast, setToast] = useState(null); // ✅ برای کنترل Toast

  const location = useLocation();
  const navigate = useNavigate();
  const { phone } = location.state || {};

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setForgotDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [counter]);

  // تابع ورود
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://gelatocafe.ir/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (!data.token) {
          setToast({ type: "error", message: "توکن JWT دریافت نشد ❌" });
          return;
        }

        localStorage.setItem("token", data.token);

        const { address, ...userWithoutAddress } = data.user || {};
        localStorage.setItem("user", JSON.stringify(userWithoutAddress));

        if (address) {
          localStorage.setItem("userAddress", JSON.stringify(address));
        }

        setUser?.(userWithoutAddress);

        try {
          const ordersRes = await fetch(
            `https://gelatocafe.ir/api/orders/user/${userWithoutAddress._id}`,
            {
              headers: { Authorization: `Bearer ${data.token}` },
            }
          );
          const ordersData = await ordersRes.json();

          if (ordersRes.ok) {
            const normalizedOrders = ordersData.map((order) => ({
              ...order,
              cartItems: order.cartItems || order.items || [],
            }));
            localStorage.setItem("orders", JSON.stringify(normalizedOrders));
          } else {
            console.error("خطا در دریافت سفارش‌ها:", ordersData.message);
          }
        } catch (err) {
          console.error("ارتباط با سرور برای دریافت سفارش‌ها برقرار نشد:", err);
        }

        navigate("/");
      } else {
        setToast({ type: "error", message: data.error || "رمز اشتباه است ❌" });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "مشکل در ارتباط با سرور ❌" });
    } finally {
      setLoading(false);
    }
  };

  // تابع فراموشی رمز عبور
  const handleForgotPassword = async () => {
    if (forgotDisabled) return;
    setForgotDisabled(true);
    setCounter(30);

    try {
      const res = await fetch(
        "https://gelatocafe.ir/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setToast({ type: "success", message: "کد تأیید برای شما ارسال شد " });
        navigate("/forget-password", { state: { phone } });
      } else {
        setToast({
          type: "error",
          message: data.error || "مشکل در ارسال کد ",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "ارتباط با سرور برقرار نشد " });
    }
  };

  return (
    <section className="login-sec">
      <div className="login-box">
        <h2>
          <span className="material-symbols-outlined">account_circle</span> ورود
          به حساب
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="password">
              <span className="material-symbols-outlined">key</span> رمز عبور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
          </div>

          <div style={{ justifyContent: "end" }}>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="forgot-btn"
              disabled={forgotDisabled}
            >
              {forgotDisabled
                ? `فرستادن دوباره (${counter})`
                : "فراموشی رمز عبور؟"}
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
