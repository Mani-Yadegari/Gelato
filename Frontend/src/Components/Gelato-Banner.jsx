import { Link } from "react-router-dom";
import Banner from "/images/Banner.png";
import "./Css/Gelato-Banner.css";
export default function GelatoBanner() {
  return (
    <>
      <div className="gelato-banner">
        <Link className="pic">
          <img src={Banner} alt="" />
        </Link>
      </div>
    </>
  );
}
