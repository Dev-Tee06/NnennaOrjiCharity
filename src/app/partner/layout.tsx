import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner with Us",
  description: "Partner with the Nnenna Orji Charity Foundation. Become a corporate or community partner to scale our impact.",
  alternates: {
    canonical: "/partner",
  },
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
