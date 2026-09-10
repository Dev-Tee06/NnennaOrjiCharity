import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { FooterLogo } from "./FooterLogo";

function Facebook({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function Instagram({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function Linkedin({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-blackKnight text-white">
      {/* Subtle Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay"
        style={{
          backgroundImage: "url('/images/bg-drop.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-6">
            <div className="relative h-12 w-[180px]">
              <FooterLogo />
            </div>
            <p className="font-body text-sm text-white/70 leading-relaxed max-w-[280px]">
              A Nigerian foundation built on one simple December tradition:
              packing a box, and handing it to someone who did not expect to be
              remembered.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://www.linkedin.com/company/nnennaorjicharityorganization"
                className="flex items-center justify-center w-10 h-10 rounded-[8px] border border-white/20 hover:border-orangeRed1 hover:bg-orangeRed1 hover:text-white transition-colors text-white/80"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://x.com/nocfhq"
                className="flex items-center justify-center w-10 h-10 rounded-[8px] border border-white/20 hover:border-orangeRed1 hover:bg-orangeRed1 hover:text-white transition-colors text-white/80"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
              </a>
              <a
                href="https://www.tiktok.com/@nocfhq"
                className="flex items-center justify-center w-10 h-10 rounded-[8px] border border-white/20 hover:border-orangeRed1 hover:bg-orangeRed1 hover:text-white transition-colors text-white/80"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4v-12a5 5 0 0 0 5 5" /></svg>
              </a>
              <a
                href="https://www.instagram.com/nnennaorjicharityfoundation"
                className="flex items-center justify-center w-10 h-10 rounded-[8px] border border-white/20 hover:border-orangeRed1 hover:bg-orangeRed1 hover:text-white transition-colors text-white/80"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading font-bold text-[13px] tracking-[0.12em] uppercase text-orangeRed1">
              QUICK LINKS
            </h3>
            <nav className="flex flex-col gap-4">
              {[
                "About Us",
                "Donate",
                "Volunteer",
                "Partner With Us",
                "Stories & Impact",
                "Contact Us",
              ].map((link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase().replace(/ /g, "-").replace(/&-/g, "").split("-")[0]}`}
                  className="font-body text-[15px] text-white/80 hover:text-orangeRed1 transition-colors w-fit"
                >
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Outreach Hubs */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading font-bold text-[13px] tracking-[0.12em] uppercase text-orangeRed1">
              OUTREACH HUBS
            </h3>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <span className="font-body font-medium text-[15px] text-white">
                  Lagos Hub
                </span>
                <p className="font-body text-[14px] text-white/60 leading-relaxed">
                  12 Adeniyi Jones Avenue, Ikeja, Lagos State, Nigeria
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-body font-medium text-[15px] text-white">
                  Kano Hub
                </span>
                <p className="font-body text-[14px] text-white/60 leading-relaxed">
                  8 Zoo Road, Nassarawa, Kano State, Nigeria
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <a
                  href="mailto:eniobadeji@gmail.com"
                  className="flex items-center gap-3 font-body text-[14px] text-white/80 hover:text-orangeRed1 transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-orangeRed1/10 transition-colors">
                    <Mail size={14} className="text-orangeRed1" />
                  </div>
                  eniobadeji@gmail.com
                </a>
                <a
                  href="tel:+2348030000000"
                  className="flex items-center gap-3 font-body text-[14px] text-white/80 hover:text-orangeRed1 transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-orangeRed1/10 transition-colors">
                    <Phone size={14} className="text-orangeRed1" />
                  </div>
                  +234 803 000 0000
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading font-bold text-[13px] tracking-[0.12em] uppercase text-orangeRed1">
              NEWSLETTER
            </h3>
            <p className="font-body text-[14px] text-white/70 leading-relaxed">
              Field notes from Lagos and Kano, sent when there is something real
              to report.
            </p>
            <form className="flex flex-col gap-3 mt-2">
              <input
                type="email"
                placeholder="you@email.com"
                required
                className="w-full bg-white/5 border border-white/15 rounded-[8px] px-4 py-3.5 font-body text-sm text-white placeholder-white/40 focus:outline-none focus:border-orangeRed1 focus:ring-1 focus:ring-orangeRed1 transition-all"
              />
              <Button
                type="button"
                variant="primary"
                className="w-full flex justify-between items-center px-4"
              >
                <span>Subscribe</span>
                <ArrowRight size={16} />
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-[13px] text-white/50 text-center md:text-left">
            © 2026 Nnenna Oriji Charity Foundation. All rights reserved.
          </p>
          <p className="font-body text-[13px] text-white/50 text-center md:text-right">
            Registered in Nigeria — Lagos & Kano.
          </p>
        </div>
      </div>
    </footer>
  );
}
