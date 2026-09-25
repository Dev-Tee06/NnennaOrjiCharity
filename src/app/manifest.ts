import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nnenna Orji Charity Foundation",
    short_name: "Nnenna Orji Charity Foundation",
    description:
      "Nnenna Orji Charity Foundation provides practical support to vulnerable families through food, clothing, essential items, volunteers and community giving across Nigeria.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#DC3D00",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
