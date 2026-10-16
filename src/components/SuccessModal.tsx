"use client";

import { Check, Copy, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

type SuccessTheme = "donation" | "partnership";

interface SuccessModalProps {
  title: string;
  description: string;
  emailLabel: string;
  emailAddress: string;
  buttonText: string;
  onPrimaryAction: () => void;
  onClose?: () => void;
  theme?: SuccessTheme;
}

export function SuccessModal({
  title,
  description,
  emailLabel,
  emailAddress,
  buttonText,
  onPrimaryAction,
  onClose,
  theme = "donation",
}: SuccessModalProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(emailAddress);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = emailAddress;
        textArea.setAttribute("readonly", "true");
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopyStatus("success");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch {
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    }
  };

  const isDonationTheme = theme === "donation";
  const iconClasses = isDonationTheme
    ? "bg-emerald-100 text-emerald-600"
    : "bg-orange-100 text-orangeRed1";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-[1px]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="success-modal-title"
    >
      <div
        className="relative w-full max-w-[420px] rounded-[24px] bg-white p-5 shadow-[0_30px_80px_rgba(11,16,26,0.25)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              "mb-5 flex h-12 w-12 items-center justify-center rounded-full",
              iconClasses,
            )}
          >
            <Check className="h-6 w-6" strokeWidth={2.5} />
          </div>

          <h2
            id="success-modal-title"
            className="font-heading text-[28px] font-bold leading-none tracking-[-0.03em] text-blackKnight"
          >
            {title}
          </h2>

          <p className="mt-4 text-[15px] leading-[1.7] text-text-secondary">
            {description}
          </p>

          <div className="mt-6 w-full rounded-[12px] border border-[#E6E8EC] bg-[#F7F7F7] p-3 text-left">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-blackKnight/80">
                {emailLabel}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#D9DDE3] bg-white text-blackKnight transition-colors hover:border-orangeRed1 hover:text-orangeRed1"
                aria-label={`Copy support email ${emailAddress}`}
              >
                {copyStatus === "success" ? (
                  <CheckCheck className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="mt-3">
              <a
                href={`mailto:${emailAddress}`}
                className="block break-all font-body text-[15px] font-medium text-blackKnight underline decoration-black/20 underline-offset-4"
              >
                {emailAddress}
              </a>
            </div>

            {copyStatus !== "idle" && (
              <p className="mt-2 text-[12px] text-emerald-600">
                {copyStatus === "success" ? "Email copied!" : "Unable to copy email."}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={onPrimaryAction}
            className="mt-6 w-full justify-center rounded-[11px] px-5 py-3.5 text-base font-medium"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
