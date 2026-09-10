import React from "react";

const testimonials = [
  {
    quote:
      "I did not expect someone to knock on my door that morning. My children had never seen them before. If my husband had the box, so we say thank you and mean it.",
    category: "RESIDENT",
    location: "Kano Hub",
  },
  {
    quote:
      "People think giving is easy. It is not. It requires logistics, patience, and money. NOCF has found a way to standardize love. That is the only way I can describe what happens here.",
    category: "VOLUNTEER",
    location: "Lagos Hub",
  },
  {
    quote:
      "I have supplied the medical kits for three years. They don't just ask for a discount, they ask for the expiration dates. They care about what goes in.",
    category: "PARTNER",
    location: "Logistics Partner",
  },
  {
    quote:
      "There are no cameras in our faces when they come. They give us the box, they ask how we are doing, and they leave. It is respectful.",
    category: "RESIDENT",
    location: "Lagos Hub",
  },
];

export function WhatPeopleSay() {
  return (
    <section className="bg-[#FFFFFF] pt-[75px] pb-[75px] md:pt-[90px] md:pb-[90px]">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12 flex flex-col">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-[55px] md:mb-[70px]">
          <div className="flex items-center gap-3">
            
            <span className="font-heading font-bold text-[12px] md:text-[10px] tracking-[0.1em] uppercase text-[#FF4500]">
              WHAT PEOPLE SAY
            </span>
          </div>
          ''{" "}
        </div>

        {/* Featured Testimonial */}
        <div className="relative w-[90%] md:w-[95%] mb-[20px] md:mb-[25px]">
          <span className="absolute -top-[20px] -left-[10px] md:-top-[30px] md:-left-[15px] font-heading font-bold text-[75px] md:text-[100px] leading-[1] text-[#F6CFC5] -z-10 select-none">
            “
          </span>
          <h2 className="font-heading font-bold md: leading-[1.25] tracking-[-0.03em] z-10 text-[19px]">
            We have lived in this neighbourhood for eleven years. Nobody has
            ever come to our door with something for us. The volunteers came at
            seven in the morning, before the sun was hot. My husband did not
            know what to say. I told him: say thank you and mean it.
          </h2>
        </div>

        {/* Attribution */}
        <div className="flex items-center gap-3 mb-[35px] md:mb-[45px]">
          
          <span className="font-body font-medium text-[9px] md:text-[11px] text-[#777777]">
            Rashidah, Community, Kano
          </span>
        </div>

        {/* 4 Supporting Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-7 lg:gap-9">
          {testimonials.map((t, i) => (
            <div key={i} className="flex flex-col relative pl-4 md:pl-5">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#FF4500]" />
              <p className="font-body font-medium text-[15px] md:text-[13px] leading-[1.55] text-[#252525] mb-4 flex-1">
                “{t.quote}”
              </p>
              <div className="flex flex-col gap-1">
                <span className="font-heading font-bold text-[9px] md:text-[10px] tracking-[0.08em] uppercase text-[#FF4500]">
                  {t.category}
                </span>
                <span className="font-body font-normal text-[9px] md:text-[10px] text-[#999999]">
                  {t.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
