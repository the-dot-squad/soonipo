import { connection } from "next/server";

export default async function sitemap() {
  await connection();
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://soonipo.com";

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];
}
