import { Helmet } from "react-helmet";

export default function Seo({
  title = "بستنی فروشی جلاتو - بهترین بستنی‌های دست‌ساز",
  description = "سفارش آنلاین بستنی طبیعی با کیفیت عالی و مواد اولیه تازه از بستنی فروشی جلاتو",
  keywords = "بستنی, بستنی طبیعی, بستنی دستساز, جلاتو, سفارش بستنی, بستنی میوه ای, بستنی قهوه ای",
  url = "https://gelatocafe.ir",
  image = "https://gelatocafe.ir/logo.png",
  schema = null, // اسکیما سفارشی اگر خواستی اضافه کنی
}) {
  return (
    <Helmet>
      {/* Title & Description */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Social Sharing */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org JSON (optional if exists) */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
