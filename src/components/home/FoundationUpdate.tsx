import React from "react";

export function FoundationUpdate() {
  return (
    <section className="bg-[#FDF8F6] pt-[50px] pb-[50px] md:pt-[60px] md:pb-[60px] border-t border-[#E9E5E3] border-b">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row relative">
          {/* Vertical Divider (Desktop Only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#E9E5E3] opacity-70 -translate-x-1/2" />

          {/* Left Column */}
          <div className="w-full md:w-1/2 flex relative md:pr-[40px] lg:pr-[60px] mb-10 md:mb-0">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] md:w-[3px] h-[105px] md:h-[120px] bg-[#FF4500]" />
            <div className="flex flex-col pl-[20px] md:pl-[24px] justify-center">
              <span className="font-heading font-bold text-[9px] md:text-[10px] tracking-[0.08em] uppercase text-[#FF4500] mb-[10px] md:mb-[12px] block">
                FOUNDATION UPDATE
              </span>
              <h2 className="font-heading font-bold md: leading-[1.1] md:leading-[1.2] tracking-[-0.025em] mb-[10px] md:mb-[12px] truncate text-[24px]">
                Stay close to the work.
              </h2>
              <p className="font-body font-normal text-[10px] md:text-[12px] leading-[1.5] md:leading-[1.6] text-[#777777] max-w-[390px] md:max-w-[420px]">
                We send field notes about our work what we delivered, what it
                cost, and what we learned. No parade or ceremony. Just the
                record.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 flex flex-col justify-center md:pl-[40px] lg:pl-[60px]">
            <label className="font-heading font-semibold md:font-bold text-[9px] md:text-[10px] text-[#171717] mb-[8px] md:mb-[10px] block">
              Your email address
            </label>
            <form className="flex flex-col sm:flex-row gap-[8px] md:gap-[10px] mb-[9px] md:mb-[12px]">
              <input
                type="email"
                placeholder="you@email.com"
                required
                className="w-full sm:w-[70%] md:w-[75%] bg-[#FFFFFF] border border-[#E4DFDD] rounded-[7px] h-[43px] md:h-[46px] px-[15px] font-body text-[10px] md:text-[12px] text-[#777777] outline-none placeholder:text-[#9A9A9A] focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] transition-all"
              />
              <button
                type="submit"
                className="group w-full sm:w-[30%] md:w-[25%] flex items-center justify-center gap-[4px] md:gap-[6px] bg-[#FF4500] text-[#FFFFFF] rounded-[7px] h-[43px] md:h-[46px] px-[18px] md:px-[22px] font-heading font-semibold md:font-bold text-[10px] md:text-[11px] transition-all hover:bg-[#E63E00]"
              >
                Subscribe
              </button>
            </form>
            <span className="font-body font-normal text-[9px] md:text-[10px] leading-[1.4] text-[#999999]">
              Get occasional updates. Unsubscribe anytime.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
