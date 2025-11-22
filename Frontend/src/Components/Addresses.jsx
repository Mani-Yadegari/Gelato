import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Addresses.css";
import NoAddressImg from "../assets/NoAddress.jpg";
import Toast from "./Toast.jsx";
import Seo from "./Seo.jsx"; // اضافه شد

export default function Addresses() {
  const navigate = useNavigate();
  const [savedAddress, setSavedAddress] = useState(
    JSON.parse(localStorage.getItem("userAddress"))
  );
  const [toastData, setToastData] = useState({
    show: false,
    type: "info",
    message: "",
    onConfirm: null,
  });

  const token = localStorage.getItem("token");

  const showToast = (message, type = "info", onConfirm = null) => {
    setToastData({ show: true, message, type, onConfirm });
  };

  const handleAddClick = () => navigate("/user/add-address");
  const handleEditClick = () => navigate("/user/add-address");

  const handleDelete = () => {
    showToast("آیا از حذف آدرس مطمئن هستید؟", "confirm", async () => {
      try {
        const res = await fetch("https://gelatocafe.ir/api/auth/address", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.removeItem("userAddress");
          setSavedAddress(null);
          showToast("آدرس با موفقیت حذف شد", "success");
        } else {
          showToast(data.error || "خطا در حذف آدرس", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("ارتباط با سرور برقرار نشد", "error");
      }
    });
  };

  return (
    <>
      <Seo
        title="آدرس‌های شما | Gelato Cafe"
        description="صفحه مدیریت آدرس‌های ثبت شده کاربر در کافه جلاتو"
        url="https://gelatocafe.ir/user/addresses"
        schema={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: savedAddress?.title || "کاربر",
          address: savedAddress
            ? {
                "@type": "PostalAddress",
                streetAddress: savedAddress.description,
              }
            : undefined,
        }}
      />

      <div className="addresses-bg">
        <div className="container">
          <div
            className="title"
            style={savedAddress ? { justifyContent: "end" } : {}}
          >
            {!savedAddress && (
              <button type="button" onClick={handleAddClick}>
                <span className="material-symbols-outlined">add</span>
                اضافه کردن
              </button>
            )}

            <div className="title-text">
              <span className="material-symbols-outlined">location_on</span>
              <h2>آدرس‌های شما</h2>
            </div>
          </div>

          <ul>
            {savedAddress ? (
              <li>
                <div className="buttons">
                  <button type="button" onClick={handleEditClick}>
                    <span className="material-symbols-outlined">edit</span>
                    ویرایش
                  </button>
                  <button
                    type="button"
                    className="delete"
                    onClick={handleDelete}
                  >
                    <span className="material-symbols-outlined">delete</span>
                    حذف
                  </button>
                </div>

                <div className="address-info">
                  <h3>{savedAddress.title || "بدون عنوان"}</h3>
                  <p>{savedAddress.description || ""}</p>
                  <span>{savedAddress.extraDesc || ""}</span>
                </div>
              </li>
            ) : (
              <div className="no-address">
                <img src={NoAddressImg} alt="No saved address" loading="lazy" />
                <h3>آدرسی ثبت نشده است</h3>
              </div>
            )}
          </ul>
        </div>

        {toastData.show && (
          <Toast
            type={toastData.type}
            message={toastData.message}
            onClose={() => setToastData({ ...toastData, show: false })}
            onConfirm={toastData.onConfirm}
          />
        )}
      </div>
    </>
  );
}
