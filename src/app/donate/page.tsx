"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type DonationType = "cash" | "food" | "clothing" | "medical";

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000];

export default function Donate() {
  const [activeTab, setActiveTab] = useState<DonationType>("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // State for cash
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");

  // State for other forms
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
  });

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const isCashValid =
    selectedAmount !== null ||
    (customAmount.trim() !== "" &&
      !isNaN(Number(customAmount)) &&
      Number(customAmount) > 0);
  const isPledgeValid =
    formData.name.trim() !== "" &&
    (formData.email.trim() !== "" || formData.phone.trim() !== "") &&
    formData.location !== "" &&
    formData.description.trim() !== "";

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPledgeValid) return;
    
    setIsSubmitting(true);
    try {
      // 1. Insert Donor
      const [firstName, ...lastNameParts] = formData.name.split(' ');
      const lastName = lastNameParts.join(' ');
      const donorId = crypto.randomUUID();
      
      const { error: donorError } = await supabase
        .from('donors')
        .insert({
          id: donorId,
          first_name: firstName,
          last_name: lastName || null,
          email: formData.email || null,
          phone: formData.phone || null,
          address: formData.location
        });
        
      if (donorError) throw donorError;

      // 2. Insert Donation
      const dbDonationType = activeTab === 'clothing' ? 'cloth' : 
                             activeTab === 'medical' ? 'medical_supply' : 'food';

      const { error: donationError } = await supabase
        .from('donations')
        .insert({
          donor_id: donorId,
          donation_type: dbDonationType,
          quantity: 1, // Defaulting to 1 as it's unquantified in the form text
          notes: formData.description,
          status: 'Pending'
        });

      if (donationError) throw donationError;

      router.push('/success');
    } catch (error) {
      console.error(error);
      alert("Failed to submit pledge. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCashSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCashValid) {
      const amount =
        selectedAmount !== null ? selectedAmount : Number(customAmount);
      window.location.href = `https://checkout.korapay.com/pay/fZYXkT4JpY1Z1j7?amount=${amount}`;
    }
  };

  return (
    <div className="bg-offWhite pb-24 min-h-screen">
      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-16 px-4 md:px-8 max-w-[1096px] mx-auto flex flex-col items-start lg:items-center lg:text-center">
        <div className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-full w-fit mb-6">
          <div className="w-2 h-2 rounded-full bg-orangeRed1" />
          <span className="font-body text-[13px] text-blackKnight font-medium">
            Lagos & Kano
          </span>
        </div>

        <h1 className="font-heading font-bold text-[26px] sm:text-[30px] md:text-[42px] lg:text-[48px] xl:text-[52px] leading-[1.05] tracking-tight text-blackKnight max-w-[700px]">
          Choose How You'd
          <br className="lg:hidden" /> Like to Give
        </h1>

        <p className="font-body text-base lg:text-[17px] text-text-secondary mt-5 max-w-[760px] leading-[1.6]">
          Cash, food or clothing each channel ends in the same place: a box
          handed to a household by a named volunteer. We publish what a box
          costs, what goes inside it, and how many were delivered.
        </p>

        {/* Trust Metrics */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 mt-12 w-full lg:w-auto">
          {[
            "₦12,500 average cost per box",
            "100% of in-kind goods delivered",
            "Itemised annual reporting",
          ].map((metric, i) => (
            <div key={i} className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-orangeRed1" />
              <span className="font-body text-[15px] font-medium text-blackKnight">
                {metric}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1096px] mx-auto px-4 md:px-8 flex flex-col lg:grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 items-start">
        {/* Left Column: Form Area */}
        <div className="w-full flex flex-col gap-6">
          {/* Tabs */}
          <div className="bg-white border border-border rounded-[10px] p-1.5 flex overflow-x-auto hide-scrollbar snap-x">
            {[
              { id: "cash", label: "Cash" },
              { id: "food", label: "Food Items" },
              { id: "clothing", label: "Clothing" },
              { id: "medical", label: "Medical Supplies" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DonationType)}
                className={cn(
                  "snap-start flex-1 min-w-[120px] font-body text-[15px] font-medium py-2.5 rounded-[6px] transition-colors whitespace-nowrap px-4",
                  activeTab === tab.id
                    ? "bg-orangeRed1 text-white shadow-sm"
                    : "text-text-secondary hover:text-blackKnight hover:bg-blackKnight/5",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-white border border-border rounded-[12px] p-6 lg:p-10 w-full">
            {activeTab === "cash" && (
              <form onSubmit={handleCashSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="font-heading font-bold lg: text-blackKnight text-[24px]">
                    Give cash
                  </h2>
                  <p className="font-body text-[15px] text-text-secondary leading-relaxed">
                    Cash gifts are pooled into procurement at market rates — the
                    most efficient way to fill a box.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      className={cn(
                        "font-body font-medium text-sm px-6 py-3 rounded-[8px] transition-colors border",
                        selectedAmount === amount
                          ? "bg-orangeRed1 text-white border-orangeRed1"
                          : "bg-white text-blackKnight border-border hover:border-orangeRed1",
                      )}
                    >
                      ₦{amount.toLocaleString()}
                    </button>
                  ))}
                  <div className="flex-1 min-w-[140px] relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-text-secondary">
                      ₦
                    </span>
                    <input
                      type="number"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className={cn(
                        "w-full h-full min-h-[46px] pl-8 pr-4 rounded-[8px] border font-body text-sm focus:outline-none focus:ring-1 transition-colors",
                        customAmount
                          ? "border-orangeRed1 ring-orangeRed1"
                          : "border-border focus:border-orangeRed1 focus:ring-orangeRed1",
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border-subtle">
                  <span className="font-body text-sm text-text-secondary w-full sm:w-auto text-center sm:text-left">
                    Enter an amount to see the impact.
                  </span>
                  <Button
                    type="submit"
                    disabled={!isCashValid}
                    className="w-full sm:w-auto"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </form>
            )}

            {activeTab !== "cash" && (
              <form
                onSubmit={handlePledgeSubmit}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="font-heading font-bold lg: text-blackKnight text-[24px]">
                    {activeTab === "food" && "Pledge food items"}
                    {activeTab === "clothing" && "Pledge clothing"}
                    {activeTab === "medical" && "Donate medical supplies"}
                  </h2>
                  <p className="font-body text-[15px] text-text-secondary leading-relaxed">
                    {activeTab === "food" &&
                      "Tell us what you have and where it is. We arrange pickup in Lagos and Kano, or you can deliver to a hub."}
                    {activeTab === "clothing" &&
                      "Tell us what you have and where it is. We accept clean, sorted, wearable clothing for household distribution."}
                    {activeTab === "medical" &&
                      "Bandages, gloves, basic diagnostic kits, and over-the-counter medicines go directly to our outreach clinics in Lagos and Kano."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-[13px] font-semibold text-blackKnight">
                      Donor name
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-white border border-border rounded-[10px] px-4 py-3 font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-1 focus:ring-orangeRed1/20 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-[13px] font-semibold text-blackKnight">
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-white border border-border rounded-[10px] px-4 py-3 font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-1 focus:ring-orangeRed1/20 transition-all"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[13px] font-semibold text-blackKnight">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 ..."
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-white border border-border rounded-[10px] px-4 py-3 font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-1 focus:ring-orangeRed1/20 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[13px] font-semibold text-blackKnight">
                    Pickup / delivery location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full bg-white border border-border rounded-[10px] px-4 py-3 font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-1 focus:ring-orangeRed1/20 transition-all appearance-none"
                  >
                    <option value="" disabled>
                      Select a location
                    </option>
                    <option value="Lagos">Lagos (Pickup)</option>
                    <option value="Kano">Kano (Pickup)</option>
                    <option value="Lagos Hub">Lagos Hub (Drop-off)</option>
                    <option value="Kano Hub">Kano Hub (Drop-off)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[13px] font-semibold text-blackKnight">
                    {activeTab === "food" &&
                      "Food description (items & quantities)"}
                    {activeTab === "clothing" &&
                      "Clothing description (sizes & quantities)"}
                    {activeTab === "medical" &&
                      "Medical supply category & quantity"}
                  </label>
                  <textarea
                    placeholder={
                      activeTab === "food"
                        ? "e.g. 2 bags of 25kg rice, 10 litres groundnut oil, 1 carton tomato paste"
                        : activeTab === "clothing"
                          ? "e.g. 20 adult shirts, 10 children's dresses, 8 pairs of trousers"
                          : "e.g. 50 packs of sterile gauze, 20 boxes of surgical gloves, 10 blood pressure monitors"
                    }
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full min-h-[120px] bg-white border border-border rounded-[10px] px-4 py-3 font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-1 focus:ring-orangeRed1/20 transition-all resize-y"
                  />
                </div>

                <div className="mt-4 pt-6 border-t border-border-subtle">
                  <Button
                    type="submit"
                    disabled={!isPledgeValid}
                    className="w-full md:w-auto"
                  >
                    Submit Pledge
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Information Card */}
        <div className="w-full bg-offWhite border border-border rounded-[14px] p-8 md:p-10 lg:sticky lg:top-[120px]">
          <h3 className="font-heading font-bold text-[14px] tracking-widest uppercase text-orangeRed1 mb-6">
            WHAT YOUR BOX CONTAINS
          </h3>
          <ul className="flex flex-col">
            {[
              "10kg rice or equivalent staple",
              "Cooking oil, beans, garri, seasoning",
              "Soap and basic hygiene items",
              "Sorted, wearable clothing",
              "A handwritten note from a volunteer",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-4 py-4 border-b border-border-subtle last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 rounded-full bg-orangeRed1 mt-1.5 flex-shrink-0" />
                <span className="font-body text-[15px] text-blackKnight font-medium">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-8 border-t border-border-subtle">
            <p className="font-body text-sm text-text-secondary leading-relaxed font-medium">
              Prefer to speak to someone before giving?
            </p>
            <p className="font-body text-sm text-text-secondary leading-relaxed mt-1">
              Email us and a coordinator will respond within two working days.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
