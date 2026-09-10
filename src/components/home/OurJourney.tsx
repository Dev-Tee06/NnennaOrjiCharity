"use client";

import React, { useRef, useState } from "react";

const timeline = [
  {
    year: "2020",
    number: "01",
    title: "Project 26 begins",
    desc: "A single Boxing Day meal drive in Ajah, Lagos with over 200+ hot meals cooked and shared by a group of friends.",
    active: false,
  },
  {
    year: "2021",
    number: "02",
    title: "More Items Added",
    desc: "The drive becomes a package with raw food items, cleaning utensils and essentials packed for 150+ households.",
    active: false,
  },
  {
    year: "2022",
    number: "03",
    title: "Restrategized",
    desc: "A clearer strategy emerges, shaped by what we learned along the way. And with it, the idea for the box came to life.",
    active: true,
  },
  {
    year: "2023",
    number: "04",
    title: "Project 26 Resumes",
    desc: " We resumed the project, adding new items to make the pack more complete. The goal was to create a pack capable of feeding a family of five.",
    active: false,
  },
  {
    year: "2024",
    number: "05",
    title: "Kano Opens",
    desc: " Project 26 expands to Kano, marking its first step beyond the South-West. From there, the idea of the box begins to come to life.",
    active: false,
  },
  {
    year: "2025",
    number: "06",
    title: "Breakfast With Nnenna",
    desc: "A breakfast session bringing together the founder and people from across the community.",
    active: false,
  },
  {
    year: "2026",
    number: "07",
    title: "Year-round giving",
    desc: "Food, clothing, medicals and cash channels run all year, with Boxing Day remaining the flagship outreach.",
    active: false,
  },
];

export function OurJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="bg-[#FDF8F6] pt-[80px] pb-[100px] md:pt-[100px] md:pb-[120px] overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12 flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-start gap-4 mb-[50px] md:mb-[60px]">
          <div className="flex items-center gap-3">
            
            <span className="font-heading font-bold text-[9px] md:text-[10px] tracking-[0.1em] uppercase text-[#FF4500]">
              OUR JOURNEY
            </span>
          </div>

          <h2 className="font-heading font-bold md: leading-[1.1] tracking-tight text-[19px]">
            2020 – 2026
          </h2>

          <p className="font-body font-normal text-[16px] leading-[24.8px] text-[#171717] mt-2">
            From a single street in Ikeja to a two-city operation with
            year-round giving channels.
          </p>
        </div>
      </div>

      {/* Cards Track */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-5 md:gap-6 px-4 md:px-8 xl:px-[calc((100vw-1320px)/2+48px)] hide-scrollbar cursor-grab active:cursor-grabbing snap-x md:snap-none pb-4"
        style={{ paddingRight: "24px" }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {timeline.map((item, i) => (
          <div
            key={i}
            className={`flex-shrink-0 w-[240px] md:w-[280px] min-h-[155px] rounded-[8px] p-6 relative transition-transform duration-300 hover:-translate-y-1 snap-start ${
              item.active
                ? "shadow-md text-[#FFFFFF]"
                : "bg-[#FFFFFF] border border-[#E8E4E2] text-[#171717]"
            }`}
            style={
              item.active
                ? {
                    background:
                      "linear-gradient(180deg, #E6A48B 0%, #7F7F82 100%)",
                  }
                : {}
            }
          >
            {/* Number */}
            <span
              className={`absolute top-6 right-6 font-body font-medium text-[10px] ${
                item.active ? "text-white/80" : "text-[#8A8A8A]"
              }`}
            >
              {item.number}
            </span>

            {/* Year */}
            <div
              className={`font-heading font-bold text-[26px] leading-[1] ${item.active ? "text-[#FF4500]" : "text-[#FF4500]"}`}
            >
              {item.year}
            </div>

            {/* Title */}
            <h3
              className={`font-heading font-bold text-[16px] mt-[16px] mb-2 ${item.active ? "text-[#FFFFFF]" : "text-[#171717]"}`}
            >
              {item.title}
            </h3>

            {/* Description */}
            <p
              className={`font-body text-[12px] leading-[1.5] ${item.active ? "text-[#FFFFFF]" : "text-[#777777]"}`}
            >
              {item.desc}
            </p>
          </div>
        ))}
        {/* Spacer for right edge */}
        <div className="w-[1px] flex-shrink-0" />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </section>
  );
}
