import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://plunktemplates.com",
      lastModified: new Date(),
    },
  ];
}
