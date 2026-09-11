import Image from "next/image";
import Link from "next/link";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { SectionLabel } from "@/components/SectionLabel";
import { Button } from "@/components/Button";
import { ShieldCheck, HeartHandshake, Box, MapPin, Truck } from "lucide-react";

import dynamic from "next/dynamic";
import { OurImpact } from "@/components/home/OurImpact";
import { WhatPeopleSay } from "@/components/home/WhatPeopleSay";
import { StoriesAndImpact } from "@/components/home/StoriesAndImpact";
import { FoundationUpdate } from "@/components/home/FoundationUpdate";

const OurJourney = dynamic(() => import("@/components/home/OurJourney").then(mod => mod.OurJourney), {
  ssr: true,
});

import { AnimatedCounter } from "@/components/AnimatedCounter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Nnenna Orji Charity Foundation. Sharing Love Everywhere With A Box Full of Hope across Lagos and Kano, Nigeria.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <HeroSlideshow />

      {/* Impact Statistics */}
      <section className="bg-white py-14 border-b border-border-subtle">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border-subtle">
            <div className="flex flex-col gap-2 lg:px-8 first:pl-0 last:pr-0">
              <AnimatedCounter value="813+" className="font-heading font-bold text-4xl text-orangeRed1" />
              <span className="font-body text-sm text-text-secondary">
                Gift Boxes Distributed
              </span>
            </div>
            <div className="flex flex-col gap-2 lg:px-8 first:pl-0 last:pr-0">
              <AnimatedCounter value="₦7M+" className="font-heading font-bold text-4xl text-orangeRed1" />
              <span className="font-body text-sm text-text-secondary">
                Estimated Aid Value
              </span>
            </div>
            <div className="flex flex-col gap-2 lg:px-8 first:pl-0 last:pr-0">
              <AnimatedCounter value="2 Hubs" className="font-heading font-bold text-4xl text-orangeRed1" />
              <span className="font-body text-sm text-text-secondary">
                Outreach Locations
              </span>
            </div>
            <div className="flex flex-col gap-2 lg:px-8 first:pl-0 last:pr-0">
              <AnimatedCounter value="500+" className="font-heading font-bold text-4xl text-orangeRed1" />
              <span className="font-body text-sm text-text-secondary">
                Activities & Donors
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Story That Started It All */}
      <section className="py-16 md:py-24 lg:py-[120px] bg-offWhite">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/3] w-full rounded-[14px] overflow-hidden">
              <Image
                src="/images/who-we-are.jpg"
                alt="One December"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-6">
              <SectionLabel text="Who we are" />
              <h2 className="font-heading font-bold leading-[31.92px] tracking-[-0.57px] text-blackKnight text-[24px]">
                It began with one December, one street, and 120 plates of food.
              </h2>
              <div className="font-body text-[17px] leading-[28.05px] text-text-secondary flex flex-col gap-4">
                <p>
                  In 2020, a small group of friends in Ajah, Lagos, Nigeria,
                  cooked and served meals on Boxing Day. They called it Project
                  26, after the date. The next year they added a box: rice, oil,
                  clothing, soap. Families told us the box mattered more than
                  the meal, because it lasted.
                </p>
                <p>
                  Today NOCF is a registered Nigerian foundation operating from
                  Lagos and Kano, with a volunteer roster, published delivery
                  counts and partner reporting. The tradition has not changed.
                  The scale has.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Box of Hope */}
      <section className="relative py-20 lg:py-[120px] bg-blackKnight overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: "url('/images/bg-drop.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="flex flex-col items-start gap-6">
              <SectionLabel text="A BOX FULL OF HOPE" />
              <h2 className="font-heading font-bold leading-[31.92px] tracking-[-0.57px] text-white text-[24px]">
                It began with one December, one street, and 120 plates of food.
              </h2>
              <div className="font-body text-[17px] leading-[28.05px] text-white/70 flex flex-col gap-4">
                <p>
                  Today NOCF is a registered Nigerian foundation operating from
                  Lagos and Kano, with a volunteer roster, published delivery
                  counts and partner reporting. The tradition has not changed.
                  The scale has.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading font-semibold text-[12px] leading-[18.6px] tracking-[1.68px] uppercase text-[#F82C00]">
                    Inside a box
                  </h3>
                  <p className="font-body font-normal text-[14px] leading-[21.7px] text-[#FFFFFFA6]">
                    Rice, oil, staples, clothing, soap and a handwritten note.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading font-semibold text-[12px] leading-[18.6px] tracking-[1.68px] uppercase text-[#F82C00]">
                    Cost per box
                  </h3>
                  <p className="font-body font-normal text-[14px] leading-[21.7px] text-[#FFFFFFA6]">
                    ₦12,500 average, fully itemised in our annual report.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading font-semibold text-[12px] leading-[18.6px] tracking-[1.68px] uppercase text-[#F82C00]">
                    Delivered by
                  </h3>
                  <p className="font-body font-normal text-[14px] leading-[21.7px] text-[#FFFFFFA6]">
                    Volunteers, in person, household by household.
                  </p>
                </div>
              </div>

              <Button href="/donate" variant="primary" className="mt-4">
                Sponsor a Box
              </Button>
            </div>
            <div className="relative aspect-[4/3] w-full rounded-[14px] overflow-hidden grayscale">
              <Image
                src="/images/hero2.JPG"
                alt="Box of Hope"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Five Ways to Put Something in the Box */}
      <section className="py-20 lg:py-[120px] bg-offWhite">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12 flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <span className="font-heading font-semibold text-[12px] leading-[18.6px] tracking-[1.68px] uppercase text-[#F82C00]">Ways to help</span>
            <h2 className="font-heading font-bold leading-[31.92px] tracking-[-0.57px] text-blackKnight text-[24px]">
              Five ways to put something in the box.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Donate Cash",
                desc: "Fund box contents, transport and cooking at scale. Every naira is reported against a delivery run.",
                icon: <span className="text-xl">₦</span>,
                cta: "Give now",
                href: "/donate/cash",
              },
              {
                title: "Donate Food",
                desc: "Rice, oil, garri, beans, tomatoes; staples that carry a household through the season.",
                icon: <Box size={24} />,
                cta: "Pledge now",
                href: "/donate/food",
              },
              {
                title: "Donate Medical Supply",
                desc: "Bandages, gloves, basic diagnostic kits, and over-the-counter medicines go directly to our outreach clinics in Lagos and Kano.",
                icon: <ShieldCheck size={24} />,
                cta: "Pledge Medical supplies",
                href: "/donate/medicals",
              },
              {
                title: "Donate Clothing",
                desc: "Clean, wearable clothing for children and adults, sorted by our volunteers before delivery.",
                icon: <HeartHandshake size={24} />,
                cta: "Pledge Clothing",
                href: "/donate/clothing",
              },
              {
                title: "Volunteer",
                desc: "Pack, sort, cook, drive, document. December runs on people who show up early.",
                icon: <Truck size={24} />,
                cta: "Join the team",
                href: "/volunteer",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-[14px] p-8 flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-offWhite border border-border flex items-center justify-center text-orangeRed1">
                  {item.icon}
                </div>
                <h3 className="font-heading font-semibold text-[20px] leading-[25px] tracking-[-0.3px] text-blackKnight">
                  {item.title}
                </h3>
                <p className="font-body font-normal text-[15px] leading-[23.25px] tracking-[0px] text-text-secondary flex-1">
                  {item.desc}
                </p>
                <Link
                  href={item.href}
                  className="font-body text-sm font-semibold text-orangeRed1 hover:underline mt-2"
                >
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OurJourney />
      <OurImpact />
      <WhatPeopleSay />
      <StoriesAndImpact />
      <FoundationUpdate />
    </>
  );
}
