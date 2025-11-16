import { useState, useEffect } from "react";
import "./Css/Change-Password.css";
import Toast from "./Toast.jsx";
import Seo from "./Seo.jsx"; // اضافه شد

export default function ChangePassword({ user: propUser, token: propToken }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    prevPass: "",
    newPass: "",
    newPassRepeat: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    setUser(propUser || storedUser || null);
    setToken(propToken || storedToken || null);
    setLoading(false);
  }, [propUser, propToken]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token)
      return setToast({
        type: "error",
        message: "توکن JWT پیدا نشد، لطفاً دوباره وارد شوید.",
      });

    if (formData.newPass !== formData.newPassRepeat)
      return setToast({
        type: "warning",
        message: "رمز عبور جدید و تکرارش مطابقت ندارند.",
      });

    setSubmitting(true);

    try {
      const res = await fetch(
        "https://gelatocafe.ir/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prevPass: formData.prevPass,
            newPass: formData.newPass,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setToast({
          type: "success",
          message: data.message || "رمز عبور با موفقیت تغییر یافت ",
        });
        setFormData({ prevPass: "", newPass: "", newPassRepeat: "" });
      } else {
        setToast({
          type: "error",
          message: data.error || "خطا در تغییر رمز ",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "ارتباط با سرور برقرار نشد ",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="loading">در حال بارگذاری...</p>;
  if (!user) return <p className="login-msg">لطفا وارد شوید</p>;

  return (
    <>
      <Seo
        title="تغییر رمز عبور | Gelato Cafe"
        description="صفحه تغییر رمز عبور برای کاربران ثبت نام شده کافه جلاتو"
        url="https://gelatocafe.ir/user/change-password"
      />

      <div className="password-bg">
        <form onSubmit={handleSubmit}>
          <div className="title-container">
            <h2 className="title">تغییر رمز عبور</h2>
            <span className="material-symbols-outlined" aria-label="رمز عبور">
              lock_reset
            </span>
          </div>

          <div className="input-container">
            <label htmlFor="prevPass">رمز عبور فعلی</label>
            <input
              type="password"
              id="prevPass"
              value={formData.prevPass}
              onChange={handleChange}
              required
            />

            <label htmlFor="newPass">رمز عبور جدید</label>
            <input
              type="password"
              id="newPass"
              value={formData.newPass}
              onChange={handleChange}
              required
            />

            <label htmlFor="newPassRepeat">تکرار رمز عبور جدید</label>
            <input
              type="password"
              id="newPassRepeat"
              value={formData.newPassRepeat}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </form>

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
    </>
  );
}
