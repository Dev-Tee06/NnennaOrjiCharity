import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { SectionLabel } from "@/components/SectionLabel";
import Link from "next/link";

const DISPATCHES = [
  {
    category: "KANO",
    date: "December 2025",
    title: "The morning the van left at 5am",
    excerpt:
      "A Kano loading run that turned into 600 boxes delivered before noon, and the three things that nearly went wrong.",
    image: "/images/hero3.JPG",
    href: "https://medium.com/@nnennaorjicharityfoundation",
  },
  {
    category: "LAGOS",
    date: "December 2025",
    title: "Cooking for a street you don't know",
    excerpt:
      "Notes from the community kitchen that feeds the Ikeja outreach every December — 40 pots, 11 hours.",
    image: "/images/about-us-1.jpg",
    href: "https://medium.com/@nnennaorjicharityfoundation",
  },
  {
    category: "FIELD NOTES",
    date: "November 2025",
    title: "What families actually ask for",
    excerpt:
      "Three years of listening changed what we put inside the box. Soap ranked higher than we expected.",
    image: "/images/volunteer4.JPG",
    href: "https://medium.com/@nnennaorjicharityfoundation",
  },
  {
    category: "TRANSPARENCY",
    date: "March 2025",
    title: "Where ₦50 million went",
    excerpt:
      "A line-by-line breakdown of aid delivered since 2020, and how we price a box at market rate.",
    image: "/images/hero2.JPG",
    href: "https://medium.com/@nnennaorjicharityfoundation",
  },
  {
    category: "VOLUNTEERS",
    date: "October 2025",
    title: "Sorting day is the hardest day",
    excerpt:
      "Why the clothing table is the most demanding shift in the calendar, and who keeps showing up for it.",
    image: "/images/volunteer1.JPG",
    href: "https://medium.com/@nnennaorjicharityfoundation",
  },
  {
    category: "ORIGINS",
    date: "December 2024",
    title: "Project 26, five years on",
    excerpt:
      "The founder revisits the street where the first 120 meals were served, with the people who served them.",
    image: "/images/who-we-are.jpg",
    href: "https://medium.com/@nnennaorjicharityfoundation",
  },
];

export const metadata: Metadata = {
  title: "Impact Stories",
  description: "Read inspiring stories of families and individuals whose lives have been touched by the Nnenna Orji Charity Foundation.",
  alternates: {
    canonical: "/stories",
  },
};

export default function Stories() {
  return (
    <div className="bg-offWhite pb-24 min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 px-4 md:px-8 xl:px-12 max-w-[1320px] mx-auto flex flex-col items-center text-center">
        <div className="flex items-center gap-2 bg-white border border-border px-4 py-1.5 rounded-full w-fit mb-8">
          <div className="w-2 h-2 rounded-full bg-orangeRed1" />
          <span className="font-body text-[13px] text-blackKnight font-medium">
            Published on Medium
          </span>
        </div>

        <h1 className="font-heading font-bold text-[34px] md:text-[46px] lg:text-[56px] xl:text-[62px] leading-[1.05] md:leading-[1.0] tracking-tight md:tracking-[-0.035em] text-blackKnight max-w-[850px] xl:max-w-[900px]">
          Stories & Impact the record of what we did with what you gave.
        </h1>

        <p className="font-body text-[15px] md:text-base lg:text-[17px] text-text-secondary mt-6 max-w-[720px] leading-[1.6]">
          We write after every outreach: what was delivered, what it cost, what
          we got wrong. No polished campaign copy, no stock photography. Full
          archive lives on our Medium.
        </p>

        <Button
          href="https://medium.com/@nnennaorjicharityfoundation"
          variant="primary"
          className="mt-8 px-6"
        >
          Read Our Stories
        </Button>
      </section>

      {/* Dispatches Archive */}
      <section className="py-12 lg:py-[60px] bg-white border-y border-border-subtle">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <SectionLabel text="LATEST" />
          <h2 className="font-heading font-bold md: lg: text-blackKnight mb-12 text-[24px]">
            Recent dispatches
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {DISPATCHES.map((card, i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-[12px] lg:rounded-[14px] overflow-hidden flex flex-col group"
              >
                <div className="relative w-full aspect-[1.3/1] lg:aspect-[1.45/1] bg-border overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5 lg:p-7 flex flex-col flex-1 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-heading font-bold text-[10px] lg:text-[12px] tracking-[0.14em] uppercase text-orangeRed1">
                      {card.category}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <span className="font-body text-[13px] lg:text-[14px] text-text-secondary">
                      {card.date}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-[18px] lg:text-[21px] text-blackKnight leading-[1.15] mb-3 group-hover:text-orangeRed1 transition-colors">
                    {card.title}
                  </h3>

                  <p className="font-body text-[14px] lg:text-[15px] text-text-secondary leading-[1.55] mb-6">
                    {card.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border-subtle">
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-1 font-body font-semibold text-[14px] lg:text-[15px] text-orangeRed1 group/link"
                      target="_blank"
                    >
                      Read on Medium
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
