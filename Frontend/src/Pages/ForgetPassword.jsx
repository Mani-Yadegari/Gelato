import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Toast from "../Components/Toast.jsx";

export default function ForgetPassword() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(60);
  const [toast, setToast] = useState(null); // 👈 مدیریت toast
  const location = useLocation();
  const navigate = useNavigate();

  const { phone } = location.state || {};

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setToast({
          type: "success",
          message: "رمز جدید با موفقیت ثبت شد ✅",
          onClose: () => navigate("/login"),
        });
      } else {
        setToast({
          type: "error",
          message: data.error || "کد نادرست یا مشکلی رخ داد ❌",
          onClose: () => setToast(null),
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "مشکل در ارتباط با سرور ❌",
        onClose: () => setToast(null),
      });
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({
          type: "info",
          message: "کد جدید ارسال شد 📩",
          onClose: () => setToast(null),
        });
        setTimer(60);
      } else {
        setToast({
          type: "error",
          message: data.error || "ارسال مجدد کد با خطا مواجه شد ❌",
          onClose: () => setToast(null),
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "ارتباط با سرور برقرار نشد ❌",
        onClose: () => setToast(null),
      });
    }
  };

  return (
    <section className="login-sec">
      <div className="login-box" style={{ height: "370px" }}>
        <h2>
          <span className="material-symbols-outlined">lock_reset</span>
          بازیابی رمز عبور
        </h2>
        <form onSubmit={handleVerifyAndReset}>
          <div className="input-container">
            <label htmlFor="code">
              <span className="material-symbols-outlined">sms</span>
              کد تأیید
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="newPassword">
              <span className="material-symbols-outlined">key</span>
              رمز عبور جدید
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div style={{ justifyContent: "end" }}>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={timer > 0}
            >
              {timer > 0 ? `ارسال مجدد (${timer})` : "ارسال مجدد"}
            </button>
          </div>

          <button type="submit">تایید و تغییر رمز</button>
        </form>
      </div>

      {/* ✅ Toast نمایش */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={toast.onClose}
        />
      )}
    </section>
  );
}
