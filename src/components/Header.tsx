"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/donate", label: "Donate" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/partner", label: "Partner With Us" },
  { href: "/stories", label: "Stories & Impact", externalIcon: true },
  { href: "/contact", label: "Contact Us" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-border/50">
      <div className="mx-auto flex h-[72px] md:h-[88px] max-w-[1320px] items-center justify-between px-4 md:px-8 xl:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative h-10 w-[140px] md:h-12 md:w-[180px]">
            <Image
              src="/images/brand-logo.png"
              alt="NOCF Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative font-body text-sm xl:text-[15px] font-medium transition-colors hover:text-orangeRed1 flex items-center gap-1",
                  isActive ? "text-orangeRed1" : "text-text-primary",
                )}
              >
                {link.label}
                {link.externalIcon && <span className="text-[10px]">↗</span>}
                {isActive && (
                  <span className="absolute -bottom-[4px] left-0 right-0 h-[2px] bg-orangeRed1 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button
            href="/donate"
            variant="primary"
            className="px-5 py-2.5 rounded-[8px]"
          >
            Donate Now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex lg:hidden items-center justify-center h-10 w-10 rounded-md border border-border bg-offWhite/50 text-text-primary hover:text-orangeRed1 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X size={20} strokeWidth={1.8} />
          ) : (
            <Menu size={20} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={cn(
          "fixed inset-x-0 top-[72px] bg-white border-b border-border shadow-sm transition-all duration-300 ease-in-out lg:hidden overflow-hidden",
          mobileMenuOpen
            ? "max-h-[500px] opacity-100 visible"
            : "max-h-0 opacity-0 invisible",
        )}
      >
        <div className="flex flex-col px-4 py-6 gap-6">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "font-body text-base font-medium flex items-center justify-between transition-colors hover:text-orangeRed1",
                    isActive ? "text-orangeRed1" : "text-text-primary",
                  )}
                >
                  <span className="flex items-center gap-1">
                    {link.label}
                    {link.externalIcon && (
                      <span className="text-[10px]">↗</span>
                    )}
                  </span>
                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-orangeRed1" />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-border">
            <Button
              href="/donate"
              variant="primary"
              className="w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Donate Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
