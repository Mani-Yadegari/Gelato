import GelatoBanner from "../Components/Gelato-Banner.jsx";
import Products from "../Components/Products.jsx";
import "./Css/Home.css";

export default function Home({ products, quantities, setQuantities }) {
  return (
    <section className="home">
      <GelatoBanner />
      <Products
        products={products}
        quantities={quantities}
        setQuantities={setQuantities}
      />
    </section>
  );
}
