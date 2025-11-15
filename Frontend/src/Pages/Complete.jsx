import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Toast from "../Components/Toast.jsx";

export default function CompleteProfile({ setUser, setToken }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null); // 👈 برای کنترل Toast
  const location = useLocation();
  const navigate = useNavigate();

  const phone = location.state?.phone;

  useEffect(() => {
    if (!phone) {
      navigate("/login");
    }
  }, [phone, navigate]);

  const showToast = (type, message, onConfirm) => {
    setToast({ type, message, onConfirm });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      showToast("error", "رمز عبور باید حداقل ۸ کاراکتر باشد ");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, lastName, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (!data.token) {
          showToast("error", "توکن دریافت نشد ");
          return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        setUser(data.user);
        setToken(data.token);

        showToast("success", "پروفایل با موفقیت تکمیل شد ");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        showToast("error", data.error || "خطا در ثبت‌نام ");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "مشکل در ارتباط با سرور 😕");
    }
  };

  return (
    <section className="login-sec">
      <div className="login-box" style={{ height: "380px" }}>
        <h2>
          <span className="material-symbols-outlined">account_circle</span>{" "}
          تکمیل پروفایل
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="name">نام</label>
            <input
              id="name"
              type="text"
              required
              pattern="^[آ-یa-zA-Z]+$"
              title="فقط حروف فارسی یا انگلیسی مجاز است"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="last-name">نام خانوادگی</label>
            <input
              id="last-name"
              type="text"
              required
              pattern="^[آ-یa-zA-Z]+$"
              title="فقط حروف فارسی یا انگلیسی مجاز است"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor="password">انتخاب رمز</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              title="رمز عبور باید حداقل ۸ کاراکتر باشد"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">ادامه</button>
        </form>
      </div>

      {/* 👇 نمایش Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          onConfirm={toast.onConfirm}
        />
      )}
    </section>
  );
}
