import React from "react";
import Link from "next/link";
import { AnimatedCounter } from "../AnimatedCounter";

export function OurImpact() {
  return (
    <section
      className="relative py-[40px] md:py-[40px] overflow-hidden"
      style={{
        backgroundImage: "url('/images/bg-drop.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#080E18] opacity-[0.99] pointer-events-none" />
      <div className="absolute inset-0 bg-[#FF4500] opacity-5 mix-blend-color pointer-events-none" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-[40%] flex flex-col items-start">
            <div className="flex items-center gap-3 mb-8 md:mb-10">
              <span className="font-heading font-bold text-[9px] md:text-[10px] tracking-[0.1em] uppercase text-[#FF4500]">
                OUR IMPACT
              </span>
            </div>

            <h2 className="font-heading font-bold text-white whitespace-pre-line mb-10 text-[24px]">
              Numbers we publish, not numbers we estimate.
            </h2>

            <p className="font-body text-[12px] md:text-[13px] leading-[1.6] text-[#D0D3D6] max-w-[420px] mb-8">
              Every figure represents a real journey, not just numbers and
              percentages. Real data allows us to track the impact each December
              donation and care event creates in our community.
            </p>

            <p className="font-body text-[12px] md:text-[13px] leading-[1.6] text-[#D0D3D6] max-w-[420px] mb-12">
              We don&apos;t round up, and we don&apos;t count a box twice. If we
              deliver, it&apos;s counted in the impact.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-[#3B424A] rounded-[6px] px-5 py-[11px] font-body text-[11px] md:text-[12px] font-semibold text-[#FFFFFF] hover:border-[#FF4500] hover:text-[#FF4500] transition-colors duration-300 group"
            >
              Read the full report
            </Link>
          </div>

          {/* Right Column - Statistics */}
          <div className="w-full lg:w-[60%] flex flex-col">
            {[
              {
                number: "813+",
                label: "Boxes and meals",
                desc: "Distributed since Boxing Day 2020 Lagos and Kano combined.",
              },
              {
                number: "₦12,500",
                label: "per box",
                desc: "Average cost, fully itemised in every annual report we publish.",
              },
              {
                number: "6",
                label: "consecutive years",
                desc: "Same date. Same street. Same principle  hand it over yourself.",
              },
              {
                number: "100%",
                label: "in-kind goods delivered",
                desc: "Every food and clothing donation reaches a named household.",
              },
            ].map((stat, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-row items-center py-[45px] md:py-[55px] first:pt-0 last:pb-0">
                  <div className="w-[60%] flex flex-col gap-1">
                    <AnimatedCounter
                      value={stat.number}
                      className="font-heading font-bold text-[54px] md:text-[64px] leading-[1] text-[#FF4500] tracking-[-2px]"
                    />
                    <span className="font-body font-semibold text-[10px] md:text-[12px] text-[#FFFFFF]">
                      {stat.label}
                    </span>
                  </div>
                  <div className="w-[40%] flex justify-end">
                    <p className="font-body text-[13px] md:text-[9px] leading-[1.4] text-[#A8ADB3] text-right max-w-[160px]">
                      {stat.desc}
                    </p>
                  </div>
                </div>
                {i < 3 && (
                  <div className="w-full h-[1px] bg-[#252D36] opacity-70" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
