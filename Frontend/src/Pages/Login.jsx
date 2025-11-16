import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../Components/Toast.jsx";
import "./Css/Login.css";
import Seo from "../Components/Seo.jsx";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // ✅ sanitize شماره موبایل
  const formatPhone = (input) => {
    let p = input.trim().replace(/\s/g, ""); // حذف فاصله‌ها
    if (p.startsWith("+98")) p = "0" + p.slice(3); // تبدیل +98 به 0
    return p;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    setLoading(true);
    setDisabled(true);

    const formattedPhone = formatPhone(phone);

    try {
      const res = await fetch("https://gelatocafe.ir/api/auth/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone }),
      });
      const data = await res.json();

      if (res.ok || data.exists !== undefined) {
        if (data.exists) {
          navigate("/password", { state: { phone: formattedPhone } });
        } else {
          const codeRes = await fetch(
            "https://gelatocafe.ir/api/auth/send-code",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone: formattedPhone }),
            }
          );
          const codeData = await codeRes.json();
          if (!codeRes.ok) throw new Error(codeData.error || "خطا در ارسال کد");

          navigate("/verify", { state: { phone: formattedPhone } });
        }
      } else {
        throw new Error(data.error || "خطا در بررسی شماره موبایل");
      }
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: err.message || "خطا در ارتباط با سرور ❌",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setDisabled(false), 30000);
    }
  };

  return (
    <>
      <Seo
        title="ورود | کافه جلاتو"
        description="ورود به حساب کاربری کافه جلاتو برای مشاهده سفارش‌ها و مدیریت اطلاعات شخصی"
        url="https://gelatocafe.ir/login"
      />
      <section className="login-sec">
        <div className="login-box" style={{ height: "240px" }}>
          <h2>
            <span className="material-symbols-outlined">account_circle</span>{" "}
            ورود به حساب
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label htmlFor="phone">
                <span className="material-symbols-outlined">call</span> شماره
                موبایل
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                pattern="^09\d{9}$"
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading || disabled}>
              {loading ? "در حال بررسی..." : "ادامه"}
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
    </>
  );
}
