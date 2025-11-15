import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "./Toast.jsx";
import "./Css/User-Navbar.css";

export default function UserNavbar({ user, setUser, token, setToken }) {
  const navigate = useNavigate();
  const [logoutToast, setLogoutToast] = useState(false); // نمایش Toast تایید خروج

  if (!user) return null; // اگر کاربر وارد نشده، navbar نمایش داده نشه

  // خروج واقعی
  const performLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userAddress");
    localStorage.removeItem("orders");
    localStorage.removeItem("cart");

    setLogoutToast(false); // بستن Toast
    navigate("/"); // هدایت به صفحه اصلی
  };

  // کلیک روی دکمه خروج => نمایش Toast تایید
  const handleLogoutClick = () => {
    setLogoutToast(true);
  };

  return (
    <>
      <div className="navbar-bg">
        <div className="info">
          <h1>
            {user.name} {user.lastName}
          </h1>
          <h1 className="phone-number">{user.phone}</h1>
          <button type="button" onClick={handleLogoutClick}>
            خروج
          </button>
        </div>
        <div className="navbar-links">
          <ul>
            <li>
              <Link to="/user/info">اطلاعات من</Link>
            </li>
            <li>
              <Link to="/user/orders">سفارش‌ ها</Link>
            </li>
            <li>
              <Link to="/user/addresses">آدرس‌ ها</Link>
            </li>
            <li>
              <Link to="/user/change-password">تغییر رمز عبور</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Toast تایید خروج */}
      {logoutToast && (
        <div className="toast-container-top-right">
          <Toast
            type="confirm"
            message="آیا مطمئن هستید می‌خواهید خارج شوید؟"
            onConfirm={performLogout}
            onClose={() => setLogoutToast(false)}
          />
        </div>
      )}
    </>
  );
}
