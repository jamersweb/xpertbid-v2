import type { MetadataRoute } from "next";
import { getSitemapSlugs } from "@/lib/api/client";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/properties`, changeFrequency: "hourly", priority: 0.9 },
  ];

  const propertyUrls: MetadataRoute.Sitemap = [];

  try {
    let page = 1;
    let lastPage = 1;
    do {
      const batch = await getSitemapSlugs(page, 200);
      lastPage = batch.meta.last_page;
      for (const item of batch.data) {
        propertyUrls.push({
          url: `${SITE_URL}/properties/${item.slug}`,
          lastModified: item.updated_at ? new Date(item.updated_at) : undefined,
          changeFrequency: "daily",
          priority: 0.7,
        });
      }
      page += 1;
    } while (page <= lastPage && page <= 50);
  } catch {
    // API unavailable during build — return static routes only
  }

  return [...staticRoutes, ...propertyUrls];
}
