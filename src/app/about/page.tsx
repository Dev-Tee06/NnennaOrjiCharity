import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { Button } from "@/components/Button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the history, mission, and people behind the Nnenna Orji Charity Foundation.",
  alternates: {
    canonical: "/about",
  },
};

const TIMELINE = [
  {
    year: "2020",
    title: "Project 26 begins",
    desc: "A single Boxing Day meal drive in Ajah, Lagos with over 200+ hot meals cooked and shared by a group of friends.",
  },
  {
    year: "2021",
    title: "More Items Added",
    desc: "The drive becomes a package with raw food items, cleaning utensils and essentials packed for 150+ households.",
  },
  {
    year: "2022",
    title: "Restrategized",
    desc: "A clearer strategy emerges, shaped by what we learned along the way. And with it, the idea for the box came to life.",
  },
  {
    year: "2023",
    title: "Project 26 resumes",
    desc: "We resumed the project, adding new items to make the pack more complete. The goal was to create a pack capable of feeding a family of five.",
  },
  {
    year: "2024",
    title: "Kano opens",
    desc: "Project 26 expands to Kano, marking its first step beyond the South-West. From there, the idea of the box begins to come to life.",
  },
  {
    year: "2025",
    title: "Breakfast With Nnenna",
    desc: "A breakfast session bringing together the founder and people from across the community.",
  },
  {
    year: "2026",
    title: "Year-round giving",
    desc: "Food, clothing, medicals and cash channels run all year, with Boxing Day remaining the flagship outreach.",
  },
];

const PEOPLE = [
  {
    name: "Daniel Orjikalu",
    role: "DIRECTOR OF COMMUNICATIONS",
    desc: "Started Project 26 in 2020 with six friends and a rented pot. Leads strategy and partner relationships.",
    image: "/images/volunteer-image1.jpg",
  },
  {
    name: "Bethel Ugwu",
    role: "HEAD OF FINANCE",
    desc: "Runs day-to-day operations across both hubs, including procurement and the December logistics chain.",
    image: "/images/volunteer-image3.jpg",
  },
  {
    name: "David Orji",
    role: "KANO HUB LEAD",
    desc: "Coordinates northern outreach, route mapping and community liaison across Nassarawa and Fagge.",
    image: "/images/volunteer-image2.jpg",
  },
  {
    name: "Nora Anucha",
    role: "LEAD, TICKETING",
    desc: "Owns volunteer intake, training and the sorting-day roster for clothing and food stations.",
    image: "/images/about-us-1.jpg",
  },
  {
    name: "Genevieve Atanmoh",
    role: "LEAD, INVENTORY",
    desc: "Started Project 26 in 2020 with six friends and a rented pot. Leads strategy and partner relationships.",
    image: "/images/volunteer-image4.jpg",
  },
  {
    name: "Maxwell Jedeofor",
    role: "HEAD OF FINANCE",
    desc: "Runs day-to-day operations across both hubs, including procurement and the December logistics chain.",
    image: "/images/volunteer-image5.jpeg",
  },
  {
    name: "",
    role: "LOGISTICS LEAD",
    desc: "Coordinates our transportation and distribution logistics across all hubs.",
    image: "/images/hero3.JPG",
  },
  {
    name: "",
    role: "MEDICAL LEAD",
    desc: "Leads the medical outreach team, providing consultations and basic care.",
    image: "/images/hero2.JPG",
  },
];

const GALLERY = [
  "/images/hero1.JPG",
  "/images/hero2.JPG",
  "/images/hero3.JPG",
  "/images/volunteer4.JPG",
  "/images/about-us-1.jpg",
  "/images/about-us.jpg",
];

export default function About() {
  return (
    <div className="bg-[#FAFAFA] pb-24">
      {/* Hero */}
      <section className="pt-[140px] pb-[80px] md:pt-[180px] md:pb-[100px] px-4 md:px-8 xl:px-12 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-6 md:mb-8">
          <span className="font-heading font-bold text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-[#FF4500]">
            ABOUT OUR FOUNDATION
          </span>
        </div>
        <h1 className="font-heading font-bold text-[32px] md:text-[45px] lg:text-[56px] leading-[1.05] tracking-tight text-[#171717] max-w-[800px]">
          From Project 26 to the Nnenna Orji Charity Foundation.
        </h1>
        <p className="font-body text-[14px] md:text-[16px] text-[#777777] mt-6 md:mt-8 max-w-[650px] leading-[1.6]">
          We are not a large organisation. We are a disciplined one. What
          follows is the honest record of how a one-street meal drive became a
          two-city foundation.
        </p>
      </section>

      {/* History Section */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12 pb-[100px] md:pb-[140px]">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-[100px] items-start">
          {/* Left: Text */}
          <div className="flex flex-col gap-6 font-body text-[14px] md:text-[15px] text-[#171717] leading-[1.75]">
            <p>We are not a large organisation. We are a disciplined one.</p>
            <p>
              What follows is the story of how one vision, a group of friends
              and a simple act of giving grew into the Nnenna Orji Charity
              Foundation.
            </p>
            <p>
              On 26 December 2020, one visioner and her group of friends came
              together with a simple desire: to bring food and a little joy to
              people in their community during the Christmas season.They
              prepared 120 plates of jollof rice and took them to Ajah Under
              Bridge, Lagos, where they shared the meals with people in the
              community.There was no elaborate organisation behind it.Just a
              vision, willing hands and the belief that something good could
              begin with what they had.They called it Project 26, after the date
              of the outreach.What began as a single Boxing Day meal would
              eventually become something much bigger.The following year, they
              discovered a limitation of the hot meal:It ends.So they began
              thinking beyond the meal.They added the box.Food staples,
              essential items and clothing contributed and prepared by
              volunteers became part of what would eventually become A Box of
              Hope.The idea was simple: if a meal could provide nourishment for
              a moment, a box could provide something that lasted a little
              longer.And so, Project 26 began to evolve.
            </p>
            <p>
              By 2022, the operation had outgrown goodwill.A volunteer roster
              was written down. A sorting protocol replaced the pile on the
              floor. Procurement became more deliberate, moving from individual
              retail purchases towards bulk buying.The work was becoming more
              organised.Not because the heart behind it had changed, but because
              the vision had grown.In 2023, the work extended to Kano, creating
              a second outreach hub.In 2024, Project 26 formally became the
              Nnenna Orji Charity Foundation, giving the work a formal
              organisational structure.And by 2026, the cumulative number of
              boxes and meals distributed had passed 800.Today, NOCF continues
              to grow while holding on to the principle that started
              everything:Give what you can. Show up. And make sure people know
              they have not been forgotten.
            </p>
          </div>

          {/* Right: Sticky Image & Fact Sheet */}
          <div className="flex flex-col w-full lg:sticky lg:top-[120px]">
            <div className="relative aspect-[16/10] w-full rounded-[14px] overflow-hidden mb-8">
              <Image
                src="/images/about-us.jpg"
                alt="Foundation History"
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="flex flex-col">
              <h3 className="font-heading font-bold text-[13px] md:text-[14px] tracking-[0.05em] text-[#FF4500] uppercase mb-6">
                BY THE NUMBERS
              </h3>

              <div className="flex flex-col border-t border-[#E8E4E2]">
                {[
                  { label: "Founded", value: "December 2020, Ikeja, Lagos" },
                  {
                    label: "Registered",
                    value: "2024 - Federal Republic of Nigeria",
                  },
                  { label: "Hubs", value: "Lagos & Kano" },
                  {
                    label: "Boxes & Meals",
                    value: "813+ since inception",
                  },
                  { label: "Volunteers & Donors", value: "500+ Active" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-4 border-b border-[#E8E4E2]"
                  >
                    <span className="font-body text-[13px] md:text-[14px] text-[#777777]">
                      {item.label}
                    </span>
                    <span className="font-heading font-bold text-[13px] md:text-[14px] text-[#171717] text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-[#FFFFFF] border-y border-[#E8E4E2] py-[90px] md:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-heading font-bold text-[10px] tracking-[0.1em] uppercase text-[#FF4500]">
              OUR VALUES
            </span>
          </div>
          <h2 className="font-heading font-bold md: leading-[1.1] tracking-tight mb-12 text-[24px]">
            Mission, vision and what we hold ourselves to.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Our Mission",
                desc: "To place practical, dignified support directly in the hands of vulnerable households in Nigeria — food, clothing and essentials, delivered in person, without bureaucracy.",
              },
              {
                title: "Our Vision",
                desc: "A Nigeria where no household spends the festive season unseen, and where community giving is organised, accountable and repeatable rather than occasional.",
              },
              {
                title: "Our Commitments",
                desc: "Full itemisation of every box. Published delivery counts. Volunteers named, never anonymous crowds. Nothing distributed that we would not accept ourselves.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#FDF8F6] rounded-[10px] p-[30px] md:p-[40px] flex flex-col gap-5"
              >
                <div className="w-[32px] h-[32px] rounded-full border border-[#E9D9D2] bg-white flex items-center justify-center">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#FF4500]" />
                </div>
                <h3 className="font-heading font-bold text-[18px] md:text-[20px] text-[#171717]">
                  {item.title}
                </h3>
                <p className="font-body text-[13px] md:text-[14px] leading-[1.6] text-[#777777]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-[#FFFFFF] py-[90px] md:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-heading font-bold text-[10px] tracking-[0.1em] uppercase text-[#FF4500]">
              OUR JOURNEY
            </span>
          </div>
          <h2 className="font-heading font-bold md: leading-[1.1] tracking-tight mb-4 text-[24px]">
            2020 – 2026, year by year
          </h2>
          <p className="font-body text-[14px] text-[#777777] mb-12">
            A look at how a one-day food drive became a year-round outreach
            program across two hubs.
          </p>

          <div className="flex flex-col">
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                className="flex flex-col md:grid md:grid-cols-[140px_220px_1fr] lg:grid-cols-[180px_280px_1fr] gap-4 md:gap-8 py-8 border-t border-[#E8E4E2] last:border-b-0"
              >
                <span className="font-heading font-bold text-[28px] md:text-[32px] text-[#FF4500] leading-none">
                  {item.year}
                </span>
                <span className="font-heading font-bold text-[16px] md:text-[18px] text-[#171717] mt-1 md:mt-0">
                  {item.title}
                </span>
                <p className="font-body text-[13px] md:text-[14px] leading-[1.6] text-[#777777] md:mt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Testimonial */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12 py-[50px] md:py-[80px]">
        <div className="bg-[#010D19] rounded-[24px] p-6 md:p-12 lg:p-[70px] relative overflow-hidden flex flex-col lg:flex-row gap-12 lg:gap-[80px] items-center">
          {/* Subtle Pattern Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-2 mix-blend-overlay"
            style={{
              backgroundImage: "url('/images/bg-drop.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            aria-hidden="true"
          />

          {/* Left: Image */}
          <div className="relative z-10 w-full lg:w-[45%] flex-shrink-0">
            <div className="relative aspect-[4/5] w-full rounded-[16px] overflow-hidden">
              <Image
                src="/images/ceo.JPG"
                alt="Founder"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Text */}
          <div className="relative z-10 w-full lg:w-[55%] flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-heading font-bold text-[10px] tracking-[0.1em] uppercase text-[#FF4500]">
                A WORD FROM OUR FOUNDER
              </span>
            </div>

            <h3 className="font-heading font-bold text-[24px] md:text-[32px] lg:text-[32px] leading-[1.25] tracking-[-0.02em] text-white mb-10">
              "When we started this journey back in December 2020, the world was
              reeling from the impact of COVID-19, and we never believed we were
              going to grow this big today."
            </h3>

            <p className="font-body text-[15px] md:text-[14px] text-[#A8ADB3] leading-[1.7] mb-10">
              What began as a simple, heart-driven effort to support local
              families in our community during a time of deep uncertainty
              quickly transformed into something far bigger than we ever
              imagined.Living by our motto, "A Box of Hope," our mission is to
              ensure that no individual or family feels forgotten. Through every
              distribution whether filled with food essentials, warm clothing,
              or vital medical care, we deliver practical relief, dignity, and a
              reminder that help is always within reach.What started in a single
              neighborhood has now expanded across states, powered entirely by
              the overwhelming generosity of donors and supporters like you
              across social media. Every single contribution turns empathy into
              action, transforming a simple box into a lifeline for those who
              need it most.Thank you for standing with us, sharing our vision,
              and helping us deliver hope one box, one family, and one community
              at a time.With deep gratitude,
            </p>

            <div className="flex flex-col gap-1 mb-8">
              <span className="font-heading font-bold text-[16px] text-white">
                Nnenna Orji
              </span>
              <span className="font-heading font-bold text-[10px] tracking-[0.1em] uppercase text-[#FF4500]">
                FOUNDER & BOARD CHAIR
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-[#161C24] flex items-center justify-center text-[#0A66C2]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#161C24] flex items-center justify-center text-[#E1306C]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The People */}
      <section className="bg-[#FFFFFF] py-[90px] md:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-heading font-bold text-[10px] tracking-[0.1em] uppercase text-[#FF4500]">
              Board & leadership
            </span>
          </div>
          <h2 className="font-heading font-bold md: leading-[1.1] tracking-tight mb-[60px] text-[24px]">
            The people accountable for the work.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PEOPLE.map((person, i) => (
              <div
                key={i}
                className="bg-[#FFFFFF] border border-[#E8E4E2] rounded-[10px] overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-[1.1] w-full overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover object-[center_15%]"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-[18px] text-[#171717] mb-1">
                    {person.name}
                  </h3>
                  <span className="font-heading font-bold text-[9px] tracking-[0.1em] text-[#FF4500] uppercase mb-4">
                    {person.role}
                  </span>

                  <p className="font-body text-[12px] leading-[1.6] text-[#777777]">
                    {person.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outreach / Gallery */}
      <section className="bg-[#FFFFFF] pb-[100px] md:pb-[140px]">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-heading font-bold text-[10px] tracking-[0.1em] uppercase text-[#FF4500]">
              Volunteers gallery
            </span>
          </div>
          <h2 className="font-heading font-bold md: leading-[1.1] tracking-tight mb-4 text-[24px]">
            Outreach in Lagos and Kano.
          </h2>
          <p className="font-body text-[14px] text-[#777777] mb-[50px]">
            Photographs from sorting days, kitchen shifts, loading runs and
            delivery mornings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {GALLERY.map((src, i) => (
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
          <div className="flex justify-start">
            <Button
              href="/volunteer"
              className="bg-[#FF4500] hover:bg-[#E63E00] text-white font-heading font-bold text-[11px] px-8 h-[48px] rounded-[6px] tracking-wide"
            >
              Join Our Volunteers
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
