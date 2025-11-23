import { Link } from "react-router-dom";
import "./Css/Footer.css";
import Telgram from "../assets/Telegram.png";
import Whatsapp from "../assets/Whatsapp.png";
import Instagram from "../assets/Instagram.png";
import Phone from "../assets/Phone.png";

export default function Footer() {
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
              <Link to="#about">درباره ما</Link>
            </li>
            <li>
              <Link to="#account">حساب کاربری</Link>
            </li>
            <li>
              <Link to="#support">پشتیبانی</Link>
            </li>
          </ul>

          <div className="contact" id="contact">
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
          </div>
        </div>
      </div>

      <div className="bottom">
        <p>.تمامی حقوق مادی و معنوی برای کافه جلاتو محفوظ است ©</p>
      </div>
    </footer>
  );
}
