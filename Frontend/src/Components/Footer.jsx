import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Css/Footer.css";
import Telgram from "../assets/Telegram.png";
import Whatsapp from "../assets/Whatsapp.png";
import Instagram from "../assets/Instagram.png";
import Phone from "../assets/Phone.png";
import SupportIMG from "../assets/Support.png";
import RulesIMG from "../assets/Rules.jpg";
import AboutIMG from "../assets/Store.png";
import Enamad from "../assets/Enamad.png";
export default function Footer({ user }) {
  const navigate = useNavigate();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const handleAccountClick = () => {
    if (user) {
      // اگر لاگین بود، به صفحه حساب کاربری بره
      navigate("/user/info");
    } else {
      // اگر لاگین نبود، به صفحه لاگین هدایت کن
      navigate("/login");
    }
  };
  return (
    <footer id="footer">
      <div className="footer-container">
        <div className="left">
          <div className="title">
            <h2>
              آدرس
              <span className="material-symbols-outlined">distance</span>
            </h2>
            <p>کرج، بلوار ملاصدرا، بعد از ابوذر، پلاک 301</p>
          </div>
          <div className="map-wrapper">
            <iframe
              title="map-iframe"
              src="https://neshan.org/maps/iframe/places/9a86724f11e85ad225e3e1ea4ed931e7#c35.844-50.983-18z-0p/35.8436455/50.982549899999995"
              width="100%"
              height="250"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="right">
          <h2>
            کافه جلاتو
            <span className="material-symbols-outlined">storefront</span>
          </h2>
          <ul>
            <li>
              <Link to="/">صفحه اصلی</Link>
            </li>
            <li>
              <button type="button" onClick={() => setIsAboutOpen(true)}>
                درباره ما
              </button>
            </li>
            <li>
              <button type="button" onClick={handleAccountClick}>
                حساب کاربری
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setIsSupportOpen(true)}>
                پشتیبانی
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setIsRulesOpen(true)}>
                قوانین و مقررات
              </button>
            </li>
          </ul>

          {/* <div className="contact" id="contact">
            <h2>
              ارتباط با ما
              <span className="material-symbols-outlined">call</span>
            </h2>
            <div className="social">
              <button className="telegram">
                <img src={Telgram} alt="Telegram" width="28" height="28" />
                <p>Telegram</p>
              </button>

              <button className="whatsapp">
                <img src={Whatsapp} alt="Whatsapp" width="28" height="28" />
                <p>WhatsApp</p>
              </button>

              <button className="instagram">
                <img src={Instagram} alt="Instagram" width="28" height="28" />
                <p>Instagram</p>
              </button>

              <button className="phone">
                <img src={Phone} alt="phone" width="28" height="28" />
                <p>09123456789</p>
              </button>
            </div>
          </div> */}
          <div className="namad">
            <a href="#">
              <img src={Enamad} alt="Enamad" />
            </a>
          </div>
        </div>
      </div>

      <div className="bottom">
        <p>.تمامی حقوق مادی و معنوی برای کافه جلاتو محفوظ است ©</p>
      </div>

      {/* ===== مودال پشتیبانی ===== */}
      {isSupportOpen && (
        <div className="modal-overlay" onClick={() => setIsSupportOpen(false)}>
          <div className="support-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setIsSupportOpen(false)}
            >
              ✖
            </button>
            <img src={SupportIMG} alt="Support" loading="lazy" />
            <h2>پشتیبانی کافه جلاتو</h2>
            <p>
              می‌توانید از طریق تلگرام، واتساپ یا تماس تلفنی با ما ارتباط برقرار
              کنید.
            </p>
            <div className="contact-buttons">
              <a
                href="https://t.me/YourTelegram"
                target="_blank"
                rel="noreferrer"
              >
                تلگرام
              </a>
              <a
                href="https://wa.me/09123456789"
                target="_blank"
                rel="noreferrer"
              >
                واتساپ
              </a>
              <a href="tel:09123456789">تماس تلفنی</a>
            </div>
          </div>
        </div>
      )}

      {/* ===== مودال قوانین و مقررات ===== */}
      {isRulesOpen && (
        <div className="modal-overlay" onClick={() => setIsRulesOpen(false)}>
          <div className="support-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsRulesOpen(false)}>
              ✖
            </button>
            <img src={RulesIMG} alt="Rules" loading="lazy" />
            <h2>قوانین و مقررات سایت کافه جلاتو</h2>
            <div className="rules-text">
              <p>
                <strong>۱. مقدمه:</strong> استفاده از سایت به معنای پذیرش کامل
                قوانین و مقررات است.
              </p>
              <p>
                <strong>۲. شرایط استفاده:</strong> کاربران باید حداقل ۱۸ سال سن
                داشته باشند و اطلاعات صحیح ارائه دهند.
              </p>
              <p>
                <strong>۳. ثبت سفارش و پرداخت:</strong> سفارش‌ها از طریق درگاه
                امن انجام می‌شوند.
              </p>
              <p>
                <strong>۴. تحویل و ارسال:</strong> زمان تحویل ممکن است متغیر
                باشد.
              </p>
              <p>
                <strong>۵. بازگشت کالا:</strong> مرجوعی فقط در صورت خطا یا آسیب
                محصول پذیرفته می‌شود.
              </p>
              <p>
                <strong>۶. حریم خصوصی:</strong> اطلاعات کاربران محفوظ است و تنها
                برای ارسال سفارش و اطلاع‌رسانی استفاده می‌شود.
              </p>
              <p>
                <strong>۷. حقوق معنوی:</strong> محتوای سایت متعلق به کافه جلاتو
                است و کپی بدون مجوز ممنوع است.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== مودال درباره ما ===== */}
      {isAboutOpen && (
        <div className="modal-overlay" onClick={() => setIsAboutOpen(false)}>
          <div className="support-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsAboutOpen(false)}>
              ✖
            </button>
            <img src={AboutIMG} alt="About" loading="lazy" />
            <h2>درباره کافه جلاتو</h2>
            <div className="about-text">
              <p>
                کافه جلاتو با هدف ارائه بهترین بستنی‌های سنتی و ایتالیایی در
                محیطی دوستانه و دلنشین تاسیس شد.
              </p>
              <p>
                ما با استفاده از مواد اولیه تازه و با کیفیت، تجربه‌ای متفاوت از
                طعم واقعی جلاتو برای شما فراهم می‌کنیم.
              </p>
              <p>ماموریت ما رضایت مشتریان و ارائه خدمات سریع و مطمئن است.</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
