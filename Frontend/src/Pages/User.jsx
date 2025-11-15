import "./Css/User.css";
import UserNavbar from "../Components/User-Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Info from "../Components/Info.jsx";
import ChangePassword from "../Components/Change-Password.jsx";
import AddAddress from "../Components/AddAddress.jsx";
import Addresses from "../Components/Addresses.jsx";
import Orders from "../Components/Orders.jsx";
export default function User({ user, setUser, token, setToken }) {
  return (
    <section className="user-sec">
      <UserNavbar user={user} setUser={setUser} setToken={setToken} />
      <Routes>
        <Route
          path="info"
          element={<Info user={user} setUser={setUser} token={token} />}
        />
        <Route path="orders" element={<Orders />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="add-address" element={<AddAddress />} />
        <Route
          path="change-password"
          element={<ChangePassword token={token} />}
        />
      </Routes>
    </section>
  );
}
