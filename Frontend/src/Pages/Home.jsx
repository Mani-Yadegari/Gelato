import GelatoBanner from "../Components/Gelato-Banner.jsx";
import Products from "../Components/Products.jsx";
import Seo from "../Components/Seo.jsx";
import "./Css/Home.css";

export default function Home({ products, quantities, setQuantities }) {
  return (
    <>
      <Seo
        title="خانه | کافه جلاتو"
        description="سفارش آنلاین انواع بستنی طبیعی، میوه‌ای و دست‌ساز از کافه جلاتو با بهترین کیفیت و مواد اولیه تازه."
        url="https://gelatocafe.ir/"
        schema={{
          "@context": "https://schema.org",
          "@type": "IceCreamShop",
          name: "Gelato Cafe",
          telephone: "09123456789",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Karaj",
            addressCountry: "IR",
          },
        }}
      />

      <section className="home">
        <GelatoBanner />
        <Products
          products={products}
          quantities={quantities}
          setQuantities={setQuantities}
        />
      </section>
    </>
  );
}
