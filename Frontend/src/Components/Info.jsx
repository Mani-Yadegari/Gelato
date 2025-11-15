import { useState, useEffect } from "react";
import "./Css/Info.css";
import Toast from "./Toast.jsx";

export default function Info({ user, setUser, token: propToken }) {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [token, setToken] = useState(
    propToken || localStorage.getItem("token")
  );

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (propToken) setToken(propToken);
  }, [propToken]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (!user)
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>لطفاً وارد شوید</p>
    );

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setToast({
        type: "warning",
        message: "توکن JWT پیدا نشد، لطفاً دوباره وارد شوید.",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToast({
          type: "success",
          message: "اطلاعات با موفقیت به‌روز شد.",
        });
      } else {
        setToast({
          type: "error",
          message: data.error || "خطا در بروزرسانی اطلاعات.",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "ارتباط با سرور برقرار نشد.",
      });
    }
  };

  return (
    <div className="info-bg">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <div>
            <label htmlFor="name">نام</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName">نام خانوادگی</label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="phone-container">
            <label htmlFor="phone">شماره موبایل</label>
            <input type="tel" id="phone" value={formData.phone} readOnly />
            <span className="material-symbols-outlined">lock</span>
          </div>
          <div>
            <label htmlFor="email">ایمیل</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit">ذخیره</button>
      </form>

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
    </div>
  );
}
