import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support the Nnenna Orji Charity Foundation. Donate cash, food, clothing, or medical supplies to help those in need.",
  alternates: {
    canonical: "/donate",
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
