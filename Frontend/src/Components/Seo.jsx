import { Helmet } from "react-helmet";

export default function Seo({
  title = "Gelato Cafe | بستنی ایتالیایی و دسرهای خاص",
  description = "تجربه واقعی ژلاتو ایتالیایی. سفارش آنلاین بستنی تازه با ارسال سریع.",
  keywords = "ژلاتو, بستنی, Gelato, بستنی ایتالیایی, بستنی طبیعی, دسر",
  url = "https://gelatocafe.ir",
  image = "https://gelatocafe.ir/images/Banner.png",
  schema = null,
}) {
  return (
    <Helmet>
      {/* Title & Description */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* SEO Robots */}
      <meta name="robots" content="index, follow" />

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="fa_IR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ff66aa" />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
