import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Css/ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // ✅ برای نگهداری همه کاربرا
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://gelatocafe.ir/api/manage-users");
      setUsers(res.data);
      setAllUsers(res.data); // ✅ ذخیره نسخه اصلی
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setForm({
      name: user.name || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      password: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("آیا مطمئنی می‌خوای این کاربر رو حذف کنی؟")) {
      await axios.delete(`https://gelatocafe.ir/api/manage-users/${id}`);
      fetchUsers();
    }
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await axios.put(
          `https://gelatocafe.ir/api/manage-users/${editingUser}`,
          form
        );
      }
      setEditingUser(null);
      setForm({
        name: "",
        lastName: "",
        phone: "",
        password: "",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value.trim();
    if (val === "") {
      setUsers(allUsers); // ✅ اگه خالی بود همه رو نشون بده
    } else {
      const filtered = allUsers.filter(
        (u) =>
          u.name?.includes(val) ||
          u.lastName?.includes(val) ||
          u.phone?.includes(val)
      );
      setUsers(filtered);
    }
  };

  return (
    <section className="users-sec">
      <div className="content">
        <div className="title">
          <span className="material-symbols-outlined">group</span>
          <h3>مدیریت کاربران</h3>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="جستجو بر اساس نام یا شماره تلفن..."
            onChange={handleSearch}
          />
        </div>

        <ul>
          {users.length > 0 ? (
            users.map((u) => (
              <li key={u._id}>
                <div className="user-top">
                  <span>
                    {editingUser === u._id ? (
                      <>
                        <input
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="نام"
                        />
                        <input
                          value={form.lastName}
                          onChange={(e) =>
                            setForm({ ...form, lastName: e.target.value })
                          }
                          placeholder="نام خانوادگی"
                        />
                      </>
                    ) : (
                      <>
                        {u.name} {u.lastName}
                      </>
                    )}
                  </span>

                  <div className="user-actions">
                    {editingUser === u._id ? (
                      <>
                        <input
                          type="password"
                          placeholder="رمز جدید (اختیاری)"
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                          className="password-input"
                        />
                        <button className="save-btn" onClick={handleSave}>
                          ذخیره
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditingUser(null)}
                        >
                          انصراف
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(u)}
                        >
                          ویرایش
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(u._id)}
                        >
                          حذف
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="user-info">
                  <span>
                    <span className="label">
                      <span className="material-symbols-outlined">call</span>{" "}
                      شماره تلفن:
                    </span>{" "}
                    {u.phone}
                  </span>
                  <span>
                    <span className="label">
                      <span className="material-symbols-outlined">
                        home_pin
                      </span>{" "}
                      آدرس:
                    </span>{" "}
                    {`${u.address?.title || "-"} ${
                      u.address?.description || "-"
                    } ${u.address?.extraDesc || "-"}`}
                  </span>
                  <span>
                    <span className="label">
                      <span className="material-symbols-outlined">
                        calendar_month
                      </span>{" "}
                      تاریخ عضویت:
                    </span>{" "}
                    {new Date(u.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <div className="empty">هیچ کاربری یافت نشد</div>
          )}
        </ul>
      </div>
    </section>
  );
};

export default ManageUsers;
