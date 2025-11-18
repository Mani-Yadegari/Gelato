import { useEffect, useState } from "react";
import "./Css/Orders.css";
import Seo from "./Seo.jsx";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";
import axios from "axios";
import NoOrderIMG from "../assets/NoOrder.png";

dayjs.extend(jalaliday);
dayjs.locale("fa");

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 📦 گرفتن userId از localStorage یا از context (بسته به سیستم لاگینت)
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData._id) {
          console.warn("کاربر لاگین نیست!");
          setOrders([]);
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `https://gelatocafe.ir/api/orders/user/${userData._id}`
        );

        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("خطا در دریافت سفارش‌ها:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <section className="user-orders-sec">
        <div className="loading">در حال بارگذاری سفارش‌ها...</div>
      </section>
    );
  }

  return (
    <>
      <Seo
        title="سفارش‌های شما | Gelato Cafe"
        description="لیست سفارش‌های ثبت شده شما در کافه جلاتو"
        url="https://gelatocafe.ir/user/orders"
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "سفارش‌های کاربر",
          numberOfItems: orders.length,
        }}
      />
      <section className="user-orders-sec">
        <div className="content">
          <div className="title">
            <span className="material-symbols-outlined">receipt_long</span>
            <h2>سفارش‌های شما</h2>
          </div>

          {orders.length === 0 ? (
            <div className="empty">
              <img src={NoOrderIMG} alt="No Order" />
              <h3>هیچ سفارشی ثبت نشده است.</h3>
            </div>
          ) : (
            <ul className="user-ul">
              {orders.map((order, index) => {
                const persianDate = order.createdAt
                  ? dayjs(order.createdAt)
                      .calendar("jalali")
                      .format("DD MMMM YYYY")
                  : "تاریخ نامشخص";

                let statusClass = "";
                if (order.status === "ارسال شد") statusClass = "yellow";
                else if (order.status === "تکمیل شد") statusClass = "green";
                else if (order.status === "لغو شد") statusClass = "red";
                else statusClass = "blue"; // در حال پردازش

                return (
                  <li key={index}>
                    <div className="top">
                      <p>{persianDate}</p>
                      <p>مبلغ: {order.totalPrice?.toLocaleString()} تومان</p>
                      <div className={`status ${statusClass}`}>
                        {order.status || "در حال پردازش"}
                      </div>
                    </div>

                    <ul className="items">
                      {(order.items || []).map((item, i) => (
                        <li className="value" key={i}>
                          <p>{item.name || "محصول نامشخص"}</p>
                          <p>تعداد: {item.quantity || 0}</p>
                          <p>
                            قیمت:{" "}
                            {(item.price * item.quantity).toLocaleString() || 0}{" "}
                            تومان
                          </p>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
