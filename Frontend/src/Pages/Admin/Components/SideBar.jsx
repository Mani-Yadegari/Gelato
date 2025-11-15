import { Link, useNavigate } from "react-router-dom";
import "./Css/SideBar.css";

export default function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("آیا مطمئن هستید می‌خواهید خارج شوید؟");
    if (confirmed) {
      // حذف توکن ادمین
      localStorage.removeItem("adminToken");
      // ریدایرکت به صفحه لاگین
      navigate("/admin/login");
    }
  };

  return (
    <div className="side-bar">
      <ul>
        <li>
          <Link to="/admin/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <p>داشبورد</p>
          </Link>
        </li>
        <li>
          <Link to="/admin/orders">
            <span className="material-symbols-outlined">receipt_long</span>
            <p>سفارش‌ها</p>
          </Link>
        </li>
        <li>
          <Link to="/admin/manage-products">
            <span className="material-symbols-outlined">inventory_2</span>
            <p>محصولات</p>
          </Link>
        </li>
        <li>
          <Link to="/admin/manage-users">
            <span className="material-symbols-outlined">group</span>
            <p>کاربران</p>
          </Link>
        </li>
        <li>
          <Link to="/admin/settings">
            <span className="material-symbols-outlined">settings</span>
            <p>تنظیمات</p>
          </Link>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            <p>خروج</p>
          </button>
        </li>
      </ul>
    </div>
  );
}
