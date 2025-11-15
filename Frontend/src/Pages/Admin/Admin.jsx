import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./Components/SideBar.jsx"; // ✅ مسیر درست شد
import "./Css/Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <section className="admin-sec">
      <div className="admin-content">
        <Outlet /> {/* محتوای صفحات داخل این بخش رندر میشه */}
      </div>
      <SideBar />
    </section>
  );
}
