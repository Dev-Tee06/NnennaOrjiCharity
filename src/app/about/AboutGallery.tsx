"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/Button";

interface AboutGalleryProps {
  images: string[];
}

export function AboutGallery({ images }: AboutGalleryProps) {
  const [visibleCount, setVisibleCount] = useState(6);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleSeeLess = () => {
    setVisibleCount(6);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {images.slice(0, visibleCount).map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F5F5]"
          >
            <Image
              src={src}
              alt={`Outreach Image ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {(visibleCount < images.length || visibleCount > 6) && (
        <div className="flex justify-center gap-4 mb-20">
          {visibleCount < images.length && (
            <button
              onClick={handleLoadMore}
              className="bg-transparent border border-[#E8E4E2] hover:border-[#FF4500] hover:text-[#FF4500] text-[#171717] transition-colors font-heading font-bold text-[11px] px-8 h-[48px] rounded-[6px] tracking-wide uppercase"
            >
              Load More
            </button>
          )}
          {visibleCount > 6 && (
            <button
              onClick={handleSeeLess}
              className="bg-transparent border border-[#E8E4E2] hover:border-[#FF4500] hover:text-[#FF4500] text-[#171717] transition-colors font-heading font-bold text-[11px] px-8 h-[48px] rounded-[6px] tracking-wide uppercase"
            >
              See Less
            </button>
          )}
        </div>
      )}

      <div className="bg-[#FFF0EB] border border-[#FFD6C8] shadow-sm rounded-[16px] p-6 md:p-10 flex flex-col items-center text-center max-w-[550px] mx-auto">
        <h3 className="font-heading font-bold text-[22px] md:text-[26px] text-[#171717] mb-3">
          Ready to make a difference?
        </h3>
        <p className="font-body text-[14px] md:text-[15px] text-[#555555] mb-8 max-w-[480px] leading-[1.6]">
          Join our community of volunteers and help us deliver hope to those who need it most. Whether you can sort items, drive, or help with logistics, your time matters.
        </p>
        <Button
          href="/volunteer"
          className="bg-[#FF4500] hover:bg-[#E63E00] text-white font-heading font-bold text-[11px] px-8 h-[48px] rounded-[6px] tracking-wide"
        >
          Join Our Volunteers
        </Button>
      </div>
    </div>
  );
}
