import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Toast from "../Components/Toast.jsx";

export default function Verify() {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [toast, setToast] = useState(null); // ✅ برای کنترل toast
  const MAX_RESENDS = 5;

  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone;

  if (!phone) {
    navigate("/login");
    return null;
  }

  // تایمر کاهش زمان
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // تأیید کد
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();

      if (res.ok) {
        setToast({ type: "success", message: "کد با موفقیت تأیید شد ✅" });
        navigate("/complete-profile", { state: { phone } });
      } else {
        setToast({ type: "error", message: data.error || "کد اشتباه است ❌" });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "خطا در تایید کد ❌" });
    }
  };

  // ارسال مجدد کد
  const handleResend = async () => {
    if (!canResend) return;

    if (resendCount >= MAX_RESENDS) {
      setToast({
        type: "error",
        message: "شما حداکثر دفعات ارسال کد را در این ساعت استفاده کرده‌اید ❌",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (res.ok) {
        setToast({ type: "success", message: "کد جدید ارسال شد 📩" });
        setTimer(60);
        setCanResend(false);
        setResendCount((prev) => prev + 1);
      } else {
        setToast({
          type: "error",
          message: data.error || "مشکل در ارسال کد ❌",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "خطا در ارسال کد ❌" });
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
            <label htmlFor="code">
              <span className="material-symbols-outlined">sms</span>
              کد تأیید ارسال‌ شده را وارد کنید
            </label>
            <input
              id="code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link to="../login" className="edit">
              <span className="material-symbols-outlined">edit</span> ویرایش
              شماره موبایل
            </Link>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || resendCount >= MAX_RESENDS}
            >
              {resendCount >= MAX_RESENDS
                ? "حداکثر دفعات ارسال انجام شد"
                : canResend
                ? "ارسال مجدد"
                : `ارسال مجدد (${timer})`}
            </button>
          </div>

          <button type="submit">ادامه</button>
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
