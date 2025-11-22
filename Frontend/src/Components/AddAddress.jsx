import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Css/AddAddress.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast.jsx"; // ✅ اضافه شد

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export default function AddressPicker({
  initialPosition = { lat: 35.843423, lng: 50.983083 },
  onChange = (result) => console.log("selected:", result),
}) {
  const navigate = useNavigate();
  const MAX_RADIUS_METERS = 3000;
  const ALLOWED_CENTER = initialPosition;

  const [position, setPosition] = useState(initialPosition);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [extraDesc, setExtraDesc] = useState("");
  const [toast, setToast] = useState(null); // ✅ برای toast
  const mapRef = useRef();
  const lastValidRef = useRef(initialPosition);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // فاصله
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function isInsideAllowed(lat, lon) {
    return (
      haversineDistance(lat, lon, ALLOWED_CENTER.lat, ALLOWED_CENTER.lng) <=
      MAX_RADIUS_METERS
    );
  }

  async function reverseGeocode(lat, lon) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=fa`
      );
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const parts = [
          addr.road,
          addr.pedestrian,
          addr.suburb,
          addr.neighbourhood,
          addr.village,
          addr.town,
          addr.city_district,
        ].filter(Boolean);
        let formatted = parts
          .join("، ")
          .replace(/کرج|ایران|\d+/g, "")
          .trim();
        setDesc(formatted || "ناحیه نامشخص");
      }
    } catch (err) {
      console.error(err);
      setDesc("");
    }
  }

  function MapUpdater() {
    useMapEvents({
      moveend: (e) => {
        const center = e.target.getCenter();
        setPosition({ lat: center.lat, lng: center.lng });
        lastValidRef.current = { lat: center.lat, lng: center.lng };
        reverseGeocode(center.lat, center.lng);
      },
    });
    return null;
  }

  const handleGPS = () => {
    if (!navigator.geolocation)
      return showToast("error", "مرورگر شما GPS را پشتیبانی نمی‌کند");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (!isInsideAllowed(coords.lat, coords.lng)) {
          showToast("warning", "موقعیت فعلی شما خارج از محدوده مجاز است");
          return;
        }
        setPosition(coords);
        lastValidRef.current = coords;
        if (mapRef.current)
          mapRef.current.setView([coords.lat, coords.lng], 16);
        reverseGeocode(coords.lat, coords.lng);
        showToast("success", "موقعیت شما با موفقیت شناسایی شد");
      },
      () => showToast("error", "اجازه دسترسی به موقعیت داده نشد"),
      { enableHighAccuracy: true }
    );
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      if (!isInsideAllowed(position.lat, position.lng)) {
        showToast("warning", "موقعیت انتخابی خارج از محدوده مجاز است ");
        return;
      }

      const googleUrl = `https://www.google.com/maps?q=${position.lat},${position.lng}`;
      const neshanUrl = `https://neshan.org/maps/iframe/places/_bv5-jPxL2FP#c35.839-50.995-18z-0p/${position.lat}/${position.lng}`;

      const data = {
        title,
        description: desc,
        extraDesc,
        lat: position.lat,
        lng: position.lng,
        googleUrl,
        neshanUrl,
      };

      localStorage.setItem("userAddress", JSON.stringify(data));

      const token = localStorage.getItem("token");
      if (!token) {
        showToast("error", "ابتدا وارد حساب کاربری شوید");
        return;
      }

      const res = await axios.post(
        "https://gelatocafe.ir/api/auth/address",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.address) {
        showToast("success", "آدرس با موفقیت ذخیره شد ");
        setTimeout(() => navigate("/user/addresses"), 2000);
      }
    } catch (err) {
      console.error(err);
      showToast("error", "خطا در ذخیره آدرس ");
    }
  };

  return (
    <>
      <form className="address-picker" onSubmit={handleConfirm}>
        <h2>
          <span className="material-symbols-outlined">add_location_alt</span>
          افزودن آدرس
        </h2>

        <div className="map-wrapper">
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={13}
            className="map-container"
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Circle
              center={[ALLOWED_CENTER.lat, ALLOWED_CENTER.lng]}
              radius={MAX_RADIUS_METERS}
              pathOptions={{ color: "blue", fillOpacity: 0.1 }}
            />
            <MapUpdater />
          </MapContainer>

          <div className="center-marker">
            <img src={iconUrl} alt="marker" loading="lazy" />
          </div>

          <button className="gps-btn-map" onClick={handleGPS}>
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>

        <div className="address-fields">
          <div>
            <label>آدرس</label>
            <input
              className="address"
              type="text"
              value={desc}
              readOnly
              style={{ cursor: "default" }}
            />
          </div>

          <div>
            <label>عنوان آدرس</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً خانه، محل کار"
              required
            />
          </div>

          <div className="desc-container">
            <label>توضیحات آدرس</label>
            <input
              className="desc"
              type="text"
              placeholder="پلاک ، واحد ، طبقه"
              value={extraDesc}
              onChange={(e) => setExtraDesc(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="confirm-btn">
            تایید آدرس
          </button>
        </div>
      </form>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
