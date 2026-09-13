import React from "react";
import Image from "next/image";

const stories = [
  {
    category: "LAGOS",
    title: "The morning the van left at 5am",
    desc: "How a Kano loading run turned into 600 boxes delivered before noon.",
    image: "/images/stories1.jpg",
  },
  {
    category: "LAGOS",
    title: "Cooking for a street you don’t know",
    desc: "Notes from the community kitchen that feeds the Ikeja outreach every December.",
    image: "/images/stories2.jpg",
  },
  {
    category: "FIELD NOTEs",
    title: "What families actually ask for",
    desc: "Three years of listening changed what we put inside the box.",
    image: "/images/stories3.jpg",
  },
];

export function StoriesAndImpact() {
  return (
    <section className="bg-[#FDF8F6] pt-[75px] pb-[75px] md:pt-[90px] md:pb-[90px]">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12 flex flex-col">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="font-heading font-bold text-[12px] md:text-[10px] tracking-[0.08em] uppercase text-[#FF4500]">
                STORIES & IMPACT
              </span>
            </div>
            <h2 className="font-heading font-bold md: leading-[1.15] md:leading-[1.25] tracking-[-0.025em] max-w-[500px] text-[24px]">
              What actually happened, written by the people who were there.
            </h2>
          </div>

          <button className="group flex items-center justify-center gap-2 bg-[#070D16] text-[#FFFFFF] rounded-[6px] h-[43px] md:h-[48px] px-[20px] md:px-[24px] font-body font-semibold text-[10px] md:text-[12px] transition-transform duration-300 hover:-translate-y-1">
            Read Our Stories
          </button>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[24px]">
          {stories.map((story, i) => (
            <div
              key={i}
              className="group flex flex-col bg-[#FFFFFF] rounded-[7px] md:rounded-[9px] border border-[#E9E5E3] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-sm"
            >
              <div className="relative w-full h-[200px] md:h-[220px] overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-400 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-col p-[18px] md:p-[20px] flex-1">
                <span className="font-heading font-bold text-[9px] md:text-[10px] tracking-[0.08em] uppercase text-[#FF4500] mt-[2px] md:mt-[4px]">
                  {story.category}
                </span>
                <h3 className="font-heading font-bold text-[16px] md:text-[18px] leading-[1.25] text-[#171717] mt-[12px] md:mt-[15px]">
                  {story.title}
                </h3>
                <p className="font-body font-normal text-[11px] md:text-[12px] leading-[1.5] text-[#777777] mt-[10px] md:mt-[12px]">
                  {story.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
