import Image from "next/image";
import { Button } from "@/components/Button";
import { SectionLabel } from "@/components/SectionLabel";
import { ClipboardList, CalendarDays, Truck } from "lucide-react";
import Link from "next/link";

const VOLUNTEER_STEPS = [
  { 
    number: "01", 
    title: "Apply and get matched", 
    description: "Complete the application form. A programme coordinator calls within a week and matches you to a station: sorting, kitchen, logistics or documentation.", 
    icon: <ClipboardList size={24} className="text-orangeRed1" /> 
  },
  { 
    number: "02", 
    title: "Boxing Day preparation", 
    description: "Through November and December you join sorting weekends and packing sessions. Roughly two Saturdays per month, four to six hours each.", 
    icon: <CalendarDays size={24} className="text-orangeRed1" /> 
  },
  { 
    number: "03", 
    title: "Outreach day", 
    description: "26 December. Vans load before sunrise, routes are assigned in teams of four, and every box is handed over in person. The day ends by mid-afternoon.", 
    icon: <Truck size={24} className="text-orangeRed1" /> 
  }
];

const VOLUNTEER_GALLERY = [
  "/images/volunteer1.JPG",
  "/images/volunteer2.jpg",
  "/images/volunteer3.JPG",
  "/images/volunteer4.JPG",
  "/images/hero1.JPG",
  "/images/hero3.JPG",
];

export default function Volunteer() {
  return (
    <div className="bg-offWhite pb-0">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 px-4 md:px-8 xl:px-12 max-w-[1320px] mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
          
          <div className="flex flex-col items-start w-full order-1 lg:order-1">
            <div className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-full w-fit mb-6">
              <span className="font-heading font-bold text-[13px] text-orangeRed1">500+</span>
              <span className="font-body text-[13px] text-blackKnight font-medium">active volunteers</span>
            </div>
            
            <h1 className="font-heading font-bold text-[28px] sm:text-[32px] md:text-[42px] lg:text-[48px] leading-[1.0] lg:leading-[1.05] tracking-tight lg:tracking-[-0.03em] text-blackKnight w-full">
              December runs on people who show up early.
            </h1>
            
            <p className="font-body text-base lg:text-[17px] text-text-secondary mt-6 max-w-[520px] leading-[1.6]">
              NOCF has no permanent warehouse staff. Every box that leaves Lagos or Kano was packed by someone who volunteered a Saturday. It is glamorous work — folding clothes, counting tins, checking addresses — and it is the entire reason the outreach lands.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
              <Button href="#apply" variant="primary" className="w-full sm:w-auto px-6">
                Apply to Volunteer ↗
              </Button>
              <Button href="/about" variant="outline" className="w-full sm:w-auto px-6 bg-white border-border">
                Meet the team
              </Button>
            </div>
          </div>

          <div className="w-full order-2 lg:order-2">
            <div className="relative aspect-[1.4/1] w-full rounded-[7px] overflow-hidden bg-border">
              <Image src="/images/volunteer2.jpg" alt="Volunteers" fill className="object-cover" priority />
            </div>
          </div>

        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 lg:py-[120px] bg-white border-y border-border-subtle">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <SectionLabel text="WHAT TO EXPECT" />
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-[42px] text-blackKnight mb-12">
            Three steps from application to outreach day.
          </h2>
          
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
            {VOLUNTEER_STEPS.map((step) => (
              <div key={step.number} className="bg-white border border-border rounded-[10px] p-8 lg:p-10 flex flex-col relative overflow-hidden group">
                {/* Background Number */}
                <div className="absolute -right-4 -bottom-8 font-heading font-bold text-[140px] leading-none text-blackKnight/5 select-none transition-transform duration-500 group-hover:scale-110">
                  {step.number}
                </div>
                
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-[8px] bg-offWhite border border-border flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="font-heading font-bold text-[22px] text-blackKnight mb-4">{step.title}</h3>
                  <p className="font-body text-[15px] text-text-secondary leading-[1.6]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteers Gallery */}
      <section className="py-20 lg:py-[120px] bg-offWhite">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <SectionLabel text="VOLUNTEERS GALLERY" />
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-[42px] text-blackKnight mb-4">
            Outreach in Lagos and Kano.
          </h2>
          <p className="font-body text-text-secondary max-w-[600px] mb-12 text-[16px] lg:text-[17px]">
            Photographs from sorting days, kitchen shifts, loading runs and delivery mornings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {VOLUNTEER_GALLERY.map((src, i) => (
              <div 
                key={i} 
                className="gallery-item relative aspect-[1.35/1] lg:aspect-[1.4/1] w-full overflow-hidden bg-border rounded-[6px]"
              >
                <Image 
                  src={src} 
                  alt="Volunteer Gallery" 
                  fill 
                  className="object-cover transition-[filter] duration-300 ease-in-out" 
                />
              </div>
            ))}
          </div>

          <div className="flex justify-start">
            <Button href="#apply" variant="primary">
              Join our volunteers →
            </Button>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @media (hover: hover) and (pointer: fine) {
            .gallery-item:first-child img {
              filter: grayscale(0);
            }
            .gallery-item:first-child:hover img {
              filter: grayscale(100%);
            }
          }
        `}} />
      </section>

      {/* Volunteer Culture */}
      <section className="py-20 lg:py-[120px] bg-white border-y border-border-subtle">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12 flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="w-full order-2 lg:order-1">
            <div className="relative aspect-[1/0.95] w-full rounded-[7px] overflow-hidden bg-border">
              <Image src="/images/volunteer1.JPG" alt="Volunteer Culture" fill className="object-cover" />
            </div>
          </div>

          <div className="flex flex-col items-start w-full order-1 lg:order-2">
            <SectionLabel text="VOLUNTEER CULTURE" />
            <h2 className="font-heading font-bold text-[24px] sm:text-[28px] lg:text-[34px] leading-[1.2] text-blackKnight mb-6">
              Show up, be counted, sign your name.
            </h2>
            <p className="font-body text-base lg:text-[17px] text-text-secondary leading-[1.6] mb-8">
              We keep teams small and named. Every route has a lead, every station has a checklist, and every volunteer signs the delivery sheet they worked on. Nobody disappears into a crowd, and nobody carries the day alone.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 w-full">
              {[
                "No minimum hours to start",
                "Training provided on your first shift",
                "Open to students and working professionals",
                "Lagos and Kano rosters run in parallel"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-orangeRed1 flex-shrink-0" />
                  <span className="font-body text-[15px] text-blackKnight font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Volunteer Application (Dark CTA) */}
      <section id="apply" className="py-20 lg:py-[120px] bg-offWhite">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="bg-blackKnight rounded-[16px] p-8 md:p-12 lg:p-20 relative overflow-hidden flex flex-col items-start lg:items-center lg:text-center">
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
              style={{ backgroundImage: "url('/images/bg-drop.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
            />
            
            <div className="relative z-10 w-full flex flex-col lg:items-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[2px] w-8 bg-orangeRed1"></div>
                <span className="font-heading font-bold text-[11px] sm:text-[12px] tracking-[0.16em] uppercase text-orangeRed1">
                  VOLUNTEER APPLICATION
                </span>
                <div className="h-[2px] w-8 bg-orangeRed1 lg:hidden"></div>
              </div>
              
              <h2 className="font-heading font-bold text-[32px] md:text-[42px] lg:text-[48px] text-white leading-[1.1] mb-6 tracking-tight">
                The form takes about four minutes.
              </h2>
              
              <p className="font-body text-base lg:text-[18px] text-white/70 leading-[1.6] max-w-[700px] mb-10">
                We ask for your name, city, availability window and whether you can lift, cook, drive or document. That is all. Applications for the December outreach close on 10 December.
              </p>
              
              <div className="flex flex-col items-start lg:items-center gap-3 w-full sm:w-auto">
                <Button href="https://forms.google.com" variant="primary" className="w-full sm:w-auto px-8 py-3.5">
                  Apply to Volunteer ↗
                </Button>
                <span className="font-body text-[13px] text-white/40">
                  Opens the NOCF volunteer application form in a new tab.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
