import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nnennaorjicharityfoundation.org";
  
  const routes = [
    "",
    "/about",
    "/contact",
    "/donate",
    "/partner",
    "/privacy-policy",
    "/stories",
    "/terms-of-use",
    "/volunteer",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
