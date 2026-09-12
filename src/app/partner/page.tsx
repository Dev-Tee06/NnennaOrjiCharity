"use client";

import React, { useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { Button } from "@/components/Button";
import {
  Building2,
  Package,
  Megaphone,
  Handshake,
  ArrowRight,
} from "lucide-react";

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const PARTNERSHIP_AVENUES = [
  {
    title: "Corporate Support",
    desc: "Fund a named outreach block, match employee giving, or underwrite a full delivery run. Reported with itemised spend and delivery counts.",
    icon: <Building2 size={24} className="text-orangeRed1" />,
  },
  {
    title: "Outreach Sponsorship",
    desc: "Sponsor boxes at ₦12,500 each  100, 500 or 1,000 units  with your organisation acknowledged on the delivery manifest.",
    icon: <Package size={24} className="text-orangeRed1" />,
  },
  {
    title: "Media Collaborations",
    desc: "Co-produce documentation of the December outreach: photography, film, editorial. We provide access; you provide reach.",
    icon: <Megaphone size={24} className="text-orangeRed1" />,
  },
  {
    title: "Logistics",
    desc: "Vans, warehousing, fuel or bulk supply at cost. Logistics partners remove our single largest operational constraint.",
    icon: <Handshake size={24} className="text-orangeRed1" />,
  },
];

export default function Partner() {
  const [formData, setFormData] = useState({
    organisationName: "",
    representative: "",
    email: "",
    partnershipType: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const isValid =
    formData.organisationName.trim() !== "" &&
    formData.representative.trim() !== "" &&
    formData.email.includes("@") &&
    formData.partnershipType !== "" &&
    formData.message.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('company_requests').insert({
        company_name: formData.organisationName,
        contact_name: formData.representative,
        email: formData.email,
        subject: `Partnership: ${formData.partnershipType}`,
        message: formData.message,
        status: 'New'
      });

      if (error) throw error;

      router.push('/success');
    } catch (error) {
      console.error(error);
      alert("Failed to send enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-offWhite pb-24 min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 px-4 md:px-8 xl:px-12 max-w-[1320px] mx-auto flex flex-col items-center text-center">
        <div className="flex items-center gap-2 bg-white border border-border px-4 py-1.5 rounded-full w-fit mb-8">
          <div className="w-2 h-2 rounded-full bg-orangeRed1" />
          <span className="font-body text-[13px] text-blackKnight font-medium">
            For companies, brands & NGOs
          </span>
        </div>

        <h1 className="font-heading font-bold text-[36px] sm:text-[42px] md:text-[56px] lg:text-[64px] leading-[1.0] md:leading-[0.98] tracking-tight md:tracking-[-0.035em] text-blackKnight max-w-[850px]">
          Partner with an outreach that publishes its numbers.
        </h1>

        <p className="font-body text-base md:text-[17px] text-text-secondary mt-6 max-w-[760px] leading-[1.6]">
          NOCF is small enough to be accountable and established enough to
          deliver at scale. A partnership here does not buy a logo on a banner,
          it buys a documented delivery run with names, counts and photographs
          attached to your contribution.
        </p>
      </section>

      {/* Partnership Avenues */}
      <section className="py-20 lg:py-[100px] bg-white border-y border-border-subtle">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <SectionLabel text="PARTNERSHIP AVENUES" />
          <h2 className="font-heading font-bold md: lg: text-blackKnight mb-12 text-[24px]">
            Four ways to work with us.
          </h2>

          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-5">
            {PARTNERSHIP_AVENUES.map((card, i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-[12px] p-6 lg:p-8 flex flex-col gap-5 transition-shadow hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-[8px] bg-offWhite border border-border flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className="font-heading font-bold text-[20px] md:text-[23px] text-blackKnight leading-[1.1]">
                  {card.title}
                </h3>
                <p className="font-body text-[15px] md:text-[16px] lg:text-[17px] text-text-secondary leading-[1.55]">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Section */}
      <section className="py-20 lg:py-[120px] bg-offWhite">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12 flex flex-col lg:grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 lg:items-center">
          {/* Left Column: Info */}
          <div className="flex flex-col items-start w-full">
            <SectionLabel text="ENQUIRY" />
            <h2 className="font-heading font-bold md: leading-[1.1] text-blackKnight mb-6 max-w-[500px] text-[24px]">
              Tell us what you have in mind.
            </h2>
            <p className="font-body text-[16px] lg:text-[17px] text-text-secondary leading-[1.6] mb-10 max-w-[500px]">
              Partnership enquiries are answered by a member of the board within
              three working days. We are happy to share our annual report and
              delivery data before you commit to anything.
            </p>

            <div className="flex flex-col w-full max-w-[500px]">
              {[
                {
                  label: "TYPICAL LEAD TIME",
                  value: "6–10 weeks before a December outreach",
                },
                {
                  label: "MINIMUM SPONSORSHIP",
                  value: "100 boxes (₦1.25M) or equivalent in kind",
                },
                {
                  label: "REPORTING",
                  value: "Itemised spend, delivery manifest, photography",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col py-4 border-b border-border-subtle last:border-0 last:pb-0"
                >
                  <span className="font-heading font-bold text-[12px] tracking-widest text-orangeRed1 uppercase mb-1">
                    {item.label}
                  </span>
                  <span className="font-body text-[15px] font-medium text-blackKnight">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="w-full bg-[#FAF5F2] border border-border rounded-[14px] p-6 md:p-8 lg:p-10 shadow-sm">
            <h3 className="font-heading font-bold text-[22px] md:text-[25px] text-blackKnight mb-6">
              Partnership enquiry
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col md:grid md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[13px] font-semibold text-blackKnight">
                    Organisation name
                  </label>
                  <input
                    type="text"
                    placeholder="Company or NGO"
                    value={formData.organisationName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organisationName: e.target.value,
                      })
                    }
                    className="w-full bg-white border border-border rounded-[10px] px-4 py-3 font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-1 focus:ring-orangeRed1/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[13px] font-semibold text-blackKnight">
                    Representative
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={formData.representative}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        representative: e.target.value,
                      })
                    }
                    className="w-full bg-white border border-border rounded-[10px] px-4 py-3 font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-1 focus:ring-orangeRed1/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[13px] font-semibold text-blackKnight">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@organisation.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-white border border-border rounded-[10px] px-4 py-3 font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-1 focus:ring-orangeRed1/20 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[13px] font-semibold text-blackKnight">
                  Partnership type
                </label>
                <select
                  value={formData.partnershipType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      partnershipType: e.target.value,
                    })
                  }
                  className="w-full bg-white border border-border rounded-[10px] px-4 py-3 font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-1 focus:ring-orangeRed1/20 transition-all appearance-none"
                >
                  <option value="" disabled>
                    Select a type
                  </option>
                  <option value="Corporate Support">Corporate Support</option>
                  <option value="Outreach Sponsorship">
                    Outreach Sponsorship
                  </option>
                  <option value="Media Collaboration">
                    Media Collaboration
                  </option>
                  <option value="Logistics">Logistics</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[13px] font-semibold text-blackKnight">
                  Message
                </label>
                <textarea
                  placeholder="What would you like to support, and on what timeline?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full min-h-[140px] md:min-h-[170px] bg-white border border-border rounded-[10px] px-4 py-3 font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-1 focus:ring-orangeRed1/20 transition-all resize-y"
                />
              </div>

              <div className="mt-2 pt-6 border-t border-border">
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full md:w-auto flex justify-center items-center gap-2"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Enquiry'}</span>
                  <ArrowRight size={18} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
