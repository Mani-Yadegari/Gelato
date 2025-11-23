import { Link } from "react-router-dom";
import MainHero from "../assets/Banner.png";
import MainTablet from "../assets/Gelato-Banner900.png";
import MainMobile from "../assets/Gelato-Banner700.png";
import "./Css/Gelato-Banner.css";
export default function GelatoBanner() {
  return (
    <>
      <div className="hero-image">
        <Link className="pic">
          <picture>
            <source media="(max-width: 768px)" srcSet={MainMobile} />
            <source media="(max-width: 992px)" srcSet={MainTablet} />
            <img src={MainHero} alt="بستنی مخصوص خودتو بساز" loading="lazy" />
          </picture>
        </Link>
      </div>
    </>
  );
}
