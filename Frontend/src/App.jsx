import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Menu from "./Components/Menu.jsx";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Cart from "./Components/Cart.jsx";
import Login from "./Pages/Login.jsx";
import Verify from "./Pages/Verify.jsx";
import Password from "./Pages/Password.jsx";
import Complete from "./Pages/Complete.jsx";
import ForgetPassword from "./Pages/ForgetPassword.jsx";
import User from "./Pages/User.jsx";
import Footer from "./Components/Footer.jsx";
import Checkout from "./Pages/Checkout.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx"; // ✅ اضافه شد
import "./style.css";

// صفحات ادمین
import AdminLogin from "./Pages/Admin/AdminLogin.jsx";
import Admin from "./Pages/Admin/Admin.jsx";
import Dashboard from "./Pages/Admin/Components/Dashboard.jsx";
import Orders from "./Pages/Admin/Components/Orders.jsx";
import ManageProducts from "./Pages/Admin/Components/ManageProducts.jsx";
import ManageUsers from "./Pages/Admin/Components/ManageUsers.jsx";
import Settings from "./Pages/Admin/Components/Settings.jsx";

function App() {
  const [quantities, setQuantities] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : {};
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin");

  // ذخیره سبد خرید در localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(quantities));
  }, [quantities]);

  // ذخیره اطلاعات کاربر و توکن
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (token) localStorage.setItem("token", token);
  }, [user, token]);

  const addBtn = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const subBtn = (id) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));

  return (
    <>
      {!hideLayout && (
        <Menu user={user} setUser={setUser} setToken={setToken} />
      )}

      {/* ✅ هر بار تغییر مسیر، اسکرول به بالا */}
      <ScrollToTop />

      <Routes>
        {/* صفحات عمومی */}
        <Route
          path="/"
          element={
            <Home
              quantities={quantities}
              setQuantities={setQuantities}
              addBtn={addBtn}
              subBtn={subBtn}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart quantities={quantities} />} />
        <Route
          path="/login"
          element={<Login setUser={setUser} setToken={setToken} />}
        />
        <Route path="/verify" element={<Verify />} />
        <Route
          path="/password"
          element={<Password setUser={setUser} setToken={setToken} />}
        />
        <Route
          path="/complete-profile"
          element={<Complete setUser={setUser} setToken={setToken} />}
        />
        <Route
          path="/forget-password"
          element={<ForgetPassword setToken={setToken} />}
        />
        <Route
          path="/user/*"
          element={
            <User
              user={user}
              token={token}
              setUser={setUser}
              setToken={setToken}
            />
          }
        />
        <Route path="/checkout" element={<Checkout />} />

        {/* صفحات ادمین */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
