export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://soonipo.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
