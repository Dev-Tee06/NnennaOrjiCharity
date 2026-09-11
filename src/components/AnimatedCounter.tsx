"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface AnimatedCounterProps {
  value: string; // e.g. "2,500+", "10,000+", "₦12,500", "100%"
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Extract the numeric part and prefixes/suffixes
  // Handle strings like ₦12,500 by allowing commas in the numbers
  const prefixMatch = value.match(/^[^\d]+/);
  const prefix = prefixMatch ? prefixMatch[0] : "";
  
  const suffixMatch = value.match(/[^\d]+$/);
  const suffix = suffixMatch ? suffixMatch[0] : "";
  
  const numericString = value.replace(/[^\d]/g, "");
  const numericValue = parseInt(numericString, 10) || 0;

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 80,
  });

  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      motionValue.set(numericValue);
    }
  }, [isInView, motionValue, numericValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      let formatted = Math.floor(latest).toLocaleString();
      if (!value.includes(",")) {
        // If original didn't have commas, don't format with commas
        formatted = Math.floor(latest).toString();
      }
      setDisplayValue(formatted);
    });
  }, [springValue, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
