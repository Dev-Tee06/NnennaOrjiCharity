import type { Metadata } from "next";
import { Archivo, DM_Sans } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
});

const productSansFallback = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://nocf.org"),
  title: {
    template: "%s | Nnenna Orji Charity Foundation",
    default: "Nnenna Orji Charity Foundation | A Box Full of Hope",
  },
  description:
    "A Nigerian foundation built on one simple December tradition: packing a box, and handing it to someone who did not expect to be remembered. Sharing love everywhere.",
  keywords: [
    "Charity",
    "Foundation",
    "Nigeria",
    "Lagos",
    "Kano",
    "NGO",
    "Donation",
    "Box of Hope",
    "Project 26",
    "Nnenna Orji Charity Foundation",
  ],
  openGraph: {
    title: "Nnenna Orji Charity Foundation",
    description:
      "Sharing Love Everywhere With A Box Full of Hope. Join our mission to deliver essential resources across Nigeria.",
    url: "https://nocf.org",
    siteName: "Nnenna Orji Charity Foundation",
    images: [
      {
        url: "/images/brand-logo.png",
        width: 1200,
        height: 630,
        alt: "NOCF Box of Hope",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nnenna Orji Charity Foundation",
    description: "Sharing Love Everywhere With A Box Full of Hope.",
    images: ["/images/hero2.JPG"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${productSansFallback.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-body bg-offWhite text-blackKnight selection:bg-orangeRed1/20 selection:text-blackKnight">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
