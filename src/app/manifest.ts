import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nnenna Orji Charity Foundation",
    short_name: "Nnenna Orji Charity Foundation",
    description:
      "A Nigerian foundation built on one simple December tradition: packing a box, and handing it to someone who did not expect to be remembered.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#DC3D00",
    icons: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
