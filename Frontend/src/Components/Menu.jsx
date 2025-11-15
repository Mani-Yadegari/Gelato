import { Link } from "react-router-dom";
import styles from "./Css/Menu.module.css";
import Logo from "/images/Logo.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Toast from "./Toast.jsx"; // استفاده از Toast موجود

export default function Menu({ user, setUser, setToken }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutToast, setLogoutToast] = useState(false); // state برای نمایش Toast خروج
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // بستن دارپ‌داون وقتی بیرون کلیک میشه
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  // خروج واقعی
  const performLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setLogoutToast(false);
    navigate("/");
  };

  // کلیک روی دکمه خروج => نمایش Toast تایید
  const handleLogoutClick = () => {
    setLogoutToast(true);
  };

  return (
    <header>
      <nav>
        {/* لوگو */}
        <div className={styles.logoContainer}>
          <Link className={styles.links} to="/">
            <img src={Logo} alt="Gelato Cafe" />
            <h1>کافه جلاتو</h1>
          </Link>
        </div>

        {/* منوی دسکتاپ */}
        <div className={styles.menuContainer}>
          <ul className={styles.menuList}>
            {/* حساب کاربری */}
            <li ref={dropdownRef} className={styles.userMenu}>
              {user ? (
                <>
                  <button
                    type="button"
                    className={styles.links}
                    id={styles.login}
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    <p>{user.name}</p>
                    <span className="material-symbols-outlined">
                      account_circle
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className={styles.dropDown}>
                      <div className={styles.info}>
                        <p>
                          {[user.name, user.lastName].filter(Boolean).join(" ")}
                        </p>
                        <p>{user.phone}</p>
                      </div>
                      <ul className={styles.pages}>
                        <li>
                          <Link
                            to="/user/info"
                            onClick={() => setDropdownOpen(false)}
                          >
                            اطلاعات من
                            <span className="material-symbols-outlined">
                              info
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/user/orders"
                            onClick={() => setDropdownOpen(false)}
                          >
                            سفارش‌ها
                            <span className="material-symbols-outlined">
                              receipt_long
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/user/addresses"
                            onClick={() => setDropdownOpen(false)}
                          >
                            آدرس‌ها
                            <span className="material-symbols-outlined">
                              distance
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/user/change-password"
                            onClick={() => setDropdownOpen(false)}
                          >
                            تغییر رمز
                            <span className="material-symbols-outlined">
                              lock_reset
                            </span>
                          </Link>
                        </li>
                      </ul>
                      <div className={styles.exitBar}>
                        <button onClick={handleLogoutClick}>
                          خروج
                          <span className="material-symbols-outlined">
                            logout
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link className={styles.links} id={styles.login} to="/login">
                  <p>ورود</p>
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>
                </Link>
              )}
            </li>

            {/* لینک‌های دیگر */}
            <li>
              <a className={styles.links} href="#footer">
                <p>درباره ما</p>
                <span className="material-symbols-outlined">info</span>
              </a>
            </li>
            <li>
              <Link className={styles.links} to="/">
                <p>صفحه اصلی</p>
                <span className="material-symbols-outlined">home</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* دکمه همبرگر موبایل */}
        <div
          className={styles.menuToggle}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span className={mobileMenuOpen ? styles.barActive : ""}></span>
          <span className={mobileMenuOpen ? styles.barActive : ""}></span>
          <span className={mobileMenuOpen ? styles.barActive : ""}></span>
        </div>

        {/* منوی موبایل */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              صفحه اصلی
              <span className="material-symbols-outlined">home</span>
            </Link>
            <a href="#footer" onClick={() => setMobileMenuOpen(false)}>
              درباره ما
              <span className="material-symbols-outlined">info</span>
            </a>
            <div className="line"></div>
            {user ? (
              <>
                <Link to="/user/info" onClick={() => setMobileMenuOpen(false)}>
                  اطلاعات من
                  <span className="material-symbols-outlined">person</span>
                </Link>
                <Link
                  to="/user/orders"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  سفارش‌ها
                  <span className="material-symbols-outlined">
                    receipt_long
                  </span>
                </Link>
                <Link
                  to="/user/addresses"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  آدرس‌ها
                  <span className="material-symbols-outlined">distance</span>
                </Link>
                <Link
                  to="/user/change-password"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  تغییر رمز
                  <span className="material-symbols-outlined">lock_reset</span>
                </Link>
                <button onClick={handleLogoutClick}>
                  خروج
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                ورود
                <span className="material-symbols-outlined">
                  account_circle
                </span>
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Toast تایید خروج با استفاده از Toast موجود */}
      {logoutToast && (
        <div className="toast-container-top-right">
          <Toast
            type="confirm"
            message="آیا مطمئن هستید می‌خواهید خارج شوید؟"
            onConfirm={performLogout}
            onClose={() => setLogoutToast(false)}
          />
        </div>
      )}
    </header>
  );
}
