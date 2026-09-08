"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

const IMAGES = [
  "/images/hero1.JPG",
  "/images/hero2.JPG",
  "/images/hero3.JPG",
  "/images/hero4.jpg",
];

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 6000); // 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-blackKnight min-h-[100svh] h-auto lg:h-[85vh] lg:min-h-[700px] lg:max-h-[900px] flex flex-col">
      {/* Slideshow */}
      {IMAGES.map((src, index) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={cn(
                "w-full h-full transform transition-transform ease-out duration-[10000ms]",
                index === currentIndex ? "scale-105" : "scale-100",
              )}
            >
              <Image
                src={src}
                alt="NOCF Hero"
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          </div>
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(1, 13, 25, 0.78), rgba(1, 13, 25, 0.35), rgba(1, 13, 25, 0.10))",
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 flex-1 w-full max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12 flex flex-col justify-center pt-[120px] pb-[100px] lg:pt-0 lg:pb-0">
        <div className="max-w-[700px] flex flex-col gap-6 lg:gap-8 mt-auto lg:mt-0 mb-auto lg:mb-0">
          <div className="flex items-center gap-2 border border-white/20 px-4 py-1.5 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-[#FF4500]" />
            <span className="font-heading font-bold text-[11px] md:text-[13px] tracking-[0.16em] uppercase text-white/90">
              Serving Lagos & Kano
            </span>
          </div>

          <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[44px] leading-[1.05] text-white tracking-[-0.02em]">
            Sharing Love Everywhere
            <br className="hidden md:block" /> With A{" "}
            <span className="text-[#F82C00] font-bold  px-2 leading-normal inline-block mt-1">
              Box Full of Hope
            </span>
          </h1>

          <p className="font-body font-normal text-[15px] md:text-[17px] leading-[1.6] md:leading-[28.05px] tracking-[0px] text-white/90 max-w-[650px]">
            Every year, we bring together food, clothing, essential items and
            the generosity of people who believe that no one should feel
            forgotten during the season of giving. Through our Box of Hope
            outreaches, NOCF reaches families and communities in Lagos and Kano
            with something practical, something needed and, most importantly, a
            reminder that someone cares.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
            <Button
              href="/donate"
              variant="primary"
              className="flex-1 sm:flex-none sm:w-auto px-4 sm:px-8"
            >
              Donate Now
            </Button>
            <Button
              href="/volunteer"
              className="flex-1 sm:flex-none sm:w-auto px-4 sm:px-8 bg-white/10 text-white hover:bg-white/20 border border-white/10"
            >
              Become a volunteer
            </Button>
          </div>
        </div>

        {/* Bottom Information */}
        <div className="absolute bottom-4 lg:bottom-10 left-4 md:left-8 xl:left-12 flex items-center gap-2">
          <span className="font-body font-normal text-[12px] leading-[18.6px] text-white/80">
            Boxing Day outreach, Kano ·
          </span>
          <span className="font-heading font-semibold text-[10px] leading-[15.5px] tracking-[1.4px] uppercase text-[#F82C00]">
            Project ‘24
          </span>
        </div>
      </div>
    </section>
  );
}
