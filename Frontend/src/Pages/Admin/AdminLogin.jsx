import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Css/Login.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("https://gelatocafe.ir/api/admin/login", {
        username,
        password,
      });

      // 🔹 ذخیره توکن در localStorage
      localStorage.setItem("adminToken", res.data.token);

      // 🔹 هدایت به صفحه داشبورد
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "خطایی رخ داده است");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-sec">
      <div className="login-box">
        <h2>
          <span className="material-symbols-outlined">manage_accounts</span>
          ورود به پنل مدیریت
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="username">نام کاربری</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="password">رمز عبور</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </section>
  );
}
