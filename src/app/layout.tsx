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

export const metadata: Metadata = {
  metadataBase: new URL("https://nnennaorjicharityfoundation.org"),
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
    url: "https://nnennaorjicharityfoundation.org",
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
    images: ["/images/brand-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/images/Icon.jpg",
    apple: "/images/Icon.jpg",
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              name: "Nnenna Orji Charity Foundation",
              url: "https://nnennaorjicharityfoundation.org",
              logo: "https://nnennaorjicharityfoundation.org/images/brand-logo.png",
              description: "A Nigerian foundation built on one simple December tradition: packing a box, and handing it to someone who did not expect to be remembered. Sharing love everywhere.",
              address: [
                {
                  "@type": "PostalAddress",
                  streetAddress: "12 Adeniyi Jones Avenue",
                  addressLocality: "Ikeja",
                  addressRegion: "Lagos State",
                  addressCountry: "Nigeria"
                },
                {
                  "@type": "PostalAddress",
                  streetAddress: "8 Zoo Road, Nassarawa",
                  addressLocality: "Kano",
                  addressRegion: "Kano State",
                  addressCountry: "Nigeria"
                }
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "eniobadeji@gmail.com",
                telephone: "+2348030000000",
                contactType: "customer support"
              }
            })
          }}
        />
        <GlobalLayoutWrapper>{children}</GlobalLayoutWrapper>
        <Analytics />
      </body>
    </html>
  );
}
