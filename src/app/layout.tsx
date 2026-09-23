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

import { GlobalLayoutWrapper } from "@/components/GlobalLayoutWrapper";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nnennaorjicharityfoundation.org"),
  title: {
    template: "%s | Nnenna Charity Oji Foundation",
    default: "Nnenna Charity Oji Foundation",
  },
  applicationName: "Nnenna Charity Oji Foundation",
  appleWebApp: {
    title: "Nnenna Charity Oji Foundation",
  },
  description:
    "Nnenna Orji Charity Foundation provides practical support to vulnerable families through food, clothing, essential items, volunteers and community giving across Nigeria.",
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
  icons: {
    icon: "/images/favicon.jpg",
    apple: "/images/favicon.jpg",
  },
  openGraph: {
    title: "Nnenna Charity Oji Foundation",
    description:
      "Nnenna Orji Charity Foundation provides practical support to vulnerable families through food, clothing, essential items, volunteers and community giving across Nigeria.",
    url: "https://www.nnennaorjicharityfoundation.org",
    siteName: "Nnenna Charity Oji Foundation",
    images: [
      {
        url: "/images/footer-logo.png",
        width: 1200,
        height: 630,
        alt: "Nnenna Orji Charity Foundation Box of Hope",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nnenna Charity Oji Foundation",
    description: "Nnenna Orji Charity Foundation provides practical support to vulnerable families through food, clothing, essential items, volunteers and community giving across Nigeria.",
    images: ["/images/footer-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Nnenna Charity Oji Foundation",
                alternateName: "Nnenna Orji Charity Foundation",
                url: "https://www.nnennaorjicharityfoundation.org",
              },
              {
                "@context": "https://schema.org",
                "@type": "NGO",
                name: "Nnenna Charity Oji Foundation",
                alternateName: "Nnenna Orji Charity Foundation",
                url: "https://www.nnennaorjicharityfoundation.org",
                logo: "https://www.nnennaorjicharityfoundation.org/images/favicon.jpg",
                description:
                  "Nnenna Orji Charity Foundation provides practical support to vulnerable families through food, clothing, essential items, volunteers and community giving across Nigeria.",
                address: [
                  {
                    "@type": "PostalAddress",
                    streetAddress: "Solomade Estate, Ikorodu, Lagos",
                    addressLocality: "Ikorodu",
                    addressRegion: "Lagos State",
                    addressCountry: "Nigeria",
                  },
                  {
                    "@type": "PostalAddress",
                    streetAddress: "Church Road, Sabon Gari, Kano, Nigeria.",
                    addressLocality: "Kano",
                    addressRegion: "Kano State",
                    addressCountry: "Nigeria",
                  },
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "contactus@nnennaorjicharityfoundation.org",
                  telephone: "+2348030000000",
                  contactType: "customer support",
                },
              },
            ]),
          }}
        />
        <GlobalLayoutWrapper>{children}</GlobalLayoutWrapper>
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
      </body>
    </html>
  );
}
