import type { MetadataRoute } from "next";
import { TRACKS } from "@/lib/tracks";

const BASE_URL = "https://theebug.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/learn`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/docs`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/play`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/leaderboard`, changeFrequency: "daily", priority: 0.5 },
    { url: `${BASE_URL}/about`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/faq`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const trackRoutes: MetadataRoute.Sitemap = TRACKS.filter((t) => !t.comingSoon).flatMap((track) => [
    { url: `${BASE_URL}/learn/${track.id}`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/docs/${track.id}`, changeFrequency: "monthly" as const, priority: 0.7 },
  ]);

  return [...staticRoutes, ...trackRoutes];
}
