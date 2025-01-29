import Head from "next/head"
import type React from "react" // Import React

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
}

const SEO: React.FC<SEOProps> = ({ title, description, canonical, ogImage }) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
    {canonical && <link rel="canonical" href={canonical} />}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage || "https://example.com/default-og-image.jpg"} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage || "https://example.com/default-og-image.jpg"} />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Multi BIN CC Generator",
        description: description,
        url: canonical || "https://example.com",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
      })}
    </script>
  </Head>
)

export default SEO

