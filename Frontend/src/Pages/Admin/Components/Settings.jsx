import { useState, useEffect } from "react";
import axios from "axios";
import "./Css/Settings.css";

export default function Settings() {
  const BACKEND_URL = "https://gelatocafe.ir/api";
  const [openingHour, setOpeningHour] = useState("09:00");
  const [closingHour, setClosingHour] = useState("23:00");
  const [siteActive, setSiteActive] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/settings`);
        if (res.data) {
          setOpeningHour(res.data.openingHour || "09:00");
          setClosingHour(res.data.closingHour || "23:00");
          setSiteActive(res.data.siteActive ?? true);
        }
      } catch (err) {
        console.error("❌ خطا در دریافت تنظیمات:", err);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/settings`, {
        openingHour,
        closingHour,
        siteActive,
      });
      setStatus("✅ تنظیمات با موفقیت ذخیره شد");
      setTimeout(() => setStatus(""), 2500);
    } catch (err) {
      console.error("❌ خطا در ذخیره تنظیمات:", err);
      setStatus("❌ خطا در ذخیره تنظیمات");
    }
  };

  return (
    <section className="admin-products-sec">
      <div className="products-content">
        <div className="products-title">
          <span className="material-symbols-outlined">settings</span>
          <h3>تنظیمات</h3>
        </div>

        <div className="settings-list">
          <div className="setting-item">
            <label>وضعیت فروشگاه:</label>
            <div className="toggle-container">
              <span
                className={`toggle-status ${
                  siteActive ? "active" : "inactive"
                }`}
              >
                {siteActive ? "فعال ✅" : "غیرفعال ❌"}
              </span>
              <button
                className={`toggle-btn ${siteActive ? "off" : "on"}`}
                onClick={() => setSiteActive(!siteActive)}
              >
                {siteActive ? "غیرفعال کن" : "فعال کن"}
              </button>
            </div>
          </div>

          <div className="setting-item">
            <label>ساعت شروع ثبت سفارش:</label>
            <input
              type="time"
              value={openingHour}
              onChange={(e) => setOpeningHour(e.target.value)}
            />
          </div>

          <div className="setting-item">
            <label>ساعت پایان ثبت سفارش:</label>
            <input
              type="time"
              value={closingHour}
              onChange={(e) => setClosingHour(e.target.value)}
            />
          </div>

          <div className="setting-actions">
            <button onClick={saveSettings} className="save-btn">
              ذخیره تنظیمات 💾
            </button>
          </div>

          {status && <p className="status">{status}</p>}
        </div>
      </div>
    </section>
  );
}
