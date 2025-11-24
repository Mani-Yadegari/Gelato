import GelatoBanner from "../Components/Gelato-Banner.jsx";
import Products from "../Components/Products.jsx";
import Seo from "../Components/Seo.jsx";
import "./Css/Home.css";

export default function Home({ products, quantities, setQuantities }) {
  return (
    <>
      <Seo
        title="کافه جلاتو کرج | Gelato Cafe"
        description="کافه جلاتو کرج – بستنی ایتالیایی و دسرهای خاص با ارسال سریع. سفارش آنلاین انواع بستنی طبیعی، میوه‌ای و دست‌ساز."
        url="https://gelatocafe.ir/"
        schema={{
          "@context": "https://schema.org",
          "@type": "IceCreamShop",
          name: "کافه جلاتو",
          alternateName: "Gelato Cafe",
          telephone: "09123456789",
          image: "https://gelatocafe.ir/images/Banner.png",
          logo: "https://gelatocafe.ir/images/Logo.png",
          priceRange: "$$",
          servesCuisine: "Gelato, Ice Cream, Dessert",
          address: {
            "@type": "PostalAddress",
            streetAddress: "بلوار ملاصدرا",
            addressLocality: "Karaj",
            addressRegion: "Alborz",
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
