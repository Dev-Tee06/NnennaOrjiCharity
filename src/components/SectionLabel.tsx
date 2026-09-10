import React from 'react';

interface SectionLabelProps {
  text: string;
}

export function SectionLabel({ text }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      
      <span className="font-heading font-bold text-[10px] sm:text-[12px] tracking-[0.16em] uppercase text-orangeRed1">
        {text}
      </span>
    </div>
  );
}
