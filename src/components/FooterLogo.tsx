"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export function FooterLogo() {
  const [src, setSrc] = useState('/images/brand-logo.png');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = '/images/brand-logo.png';
    // Cross origin might be needed if images are served from another domain, but they are local
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const a = data[i+3];
        
        if (a > 0) {
          // Identify the orange color (#FF4500 is 255, 69, 0)
          // If red is high and blue is low, it's likely part of the orange shape
          const isOrange = r > 150 && b < 100;
          
          if (!isOrange) {
            // Convert non-orange (text) pixels to white
            data[i] = 255;
            data[i+1] = 255;
            data[i+2] = 255;
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setSrc(canvas.toDataURL());
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Image
        src={src}
        alt="NOCF Logo"
        fill
        className="object-contain object-left"
        unoptimized // Prevent Next.js from trying to optimize the base64 data URL
      />
    </>
  );
}
