import { useEffect, useState } from "react";
import "./Css/AdminOrders.css";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";
import axios from "axios";
import NoOrderIMG from "../../../assets/NoOrder.png";

dayjs.extend(jalaliday);
dayjs.locale("fa");

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("همه");

  useEffect(() => {
    axios
      .get("https://gelatocafe.ir/api/orders")
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.log("خطا در دریافت سفارش‌ها:", err));
  }, []);

  const statusOptions = ["در حال پردازش", "ارسال شد", "لغو شد", "تکمیل شد"];

  const handleStatusChange = (orderId, newStatus) => {
    axios
      .put(`https://gelatocafe.ir/api/orders/${orderId}`, {
        status: newStatus,
      })
      .then(() => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch((err) => console.log("خطا در تغییر وضعیت:", err));
  };

  // 🔍 فیلتر و سرچ
  const filteredOrders = orders.filter((order) => {
    const date = order.createdAt
      ? dayjs(order.createdAt).calendar("jalali").format("DD MMMM YYYY")
      : "";

    // 🔍 متن محصولات (برای سرچ)
    const productNames = (order.items || []).map((item) => item.name).join(" ");

    // 🔍 آدرس ترکیبی برای سرچ
    const addressText = `${order.address?.title || ""} ${
      order.address?.description || ""
    }`;

    // ✅ سرچ در نام، شماره، تاریخ، آدرس و محصولات
    const matchesSearch =
      order.userInfo?.fullName?.includes(search) ||
      order.userInfo?.phoneNumber?.includes(search) ||
      date.includes(search) ||
      productNames.includes(search) ||
      addressText.includes(search);

    const matchesStatus =
      filterStatus === "همه" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="orders-sec">
      <div className="content">
        <div className="title">
          <h2>سفارش‌ها</h2>
          <span className="material-symbols-outlined">receipt_long</span>
        </div>

        {/* 🔍 فیلتر و سرچ */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="جستجو بر اساس نام، شماره یا تاریخ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="status-filter">
            <button
              className={filterStatus === "همه" ? "active" : ""}
              onClick={() => setFilterStatus("همه")}
            >
              همه
            </button>
            <button
              className={`blue ${
                filterStatus === "در حال پردازش" ? "active" : ""
              }`}
              onClick={() => setFilterStatus("در حال پردازش")}
            >
              در حال پردازش
            </button>
            <button
              className={`yellow ${
                filterStatus === "ارسال شد" ? "active" : ""
              }`}
              onClick={() => setFilterStatus("ارسال شد")}
            >
              ارسال شد
            </button>
            <button
              className={`green ${filterStatus === "تکمیل شد" ? "active" : ""}`}
              onClick={() => setFilterStatus("تکمیل شد")}
            >
              تکمیل شد
            </button>
            <button
              className={`red ${filterStatus === "لغو شد" ? "active" : ""}`}
              onClick={() => setFilterStatus("لغو شد")}
            >
              لغو شد
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty">
            <img src={NoOrderIMG} alt="No Order" />
            <h3>هیچ سفارشی یافت نشد.</h3>
          </div>
        ) : (
          <ul>
            {filteredOrders.map((order) => {
              const persianDate = order.createdAt
                ? dayjs(order.createdAt)
                    .calendar("jalali")
                    .format("DD MMMM YYYY")
                : "تاریخ نامشخص";

              let statusClass = "";
              if (order.status === "در حال پردازش") statusClass = "blue";
              else if (order.status === "ارسال شد") statusClass = "yellow";
              else if (order.status === "تکمیل شد") statusClass = "green";
              else if (order.status === "لغو شد") statusClass = "red";

              return (
                <li key={order._id}>
                  <div className="top">
                    <p>{persianDate}</p>
                    <p>{order.userInfo?.fullName || "-"}</p>
                    <p>شماره: {order.userInfo?.phoneNumber || "-"}</p>
                    <p>
                      آدرس:{" "}
                      {order.address?.description ? (
                        <a
                          href={order.address.neshanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {order.address.description}
                          <span className="material-symbols-outlined">
                            open_in_new
                          </span>
                        </a>
                      ) : (
                        <>{"تحویل حضوری"}</>
                      )}
                    </p>

                    {/* 💰 نمایش قیمت کل سفارش */}
                    <p className="total-price">
                      مجموع سفارش: {order.totalPrice?.toLocaleString() || 0}{" "}
                      تومان
                    </p>

                    <select
                      className={`status ${statusClass}`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
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
  );
}
