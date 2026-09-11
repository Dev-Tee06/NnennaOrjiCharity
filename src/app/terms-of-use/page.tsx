import { SectionLabel } from "@/components/SectionLabel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | NOCF",
  description: "Terms of Use for the Nnenna Oriji Charity Foundation website.",
};

const terms = [
  {
    title: "1. Acceptance of terms",
    content:
      'By accessing or using the Nnenna Oriji Charity Foundation website ("Site"), you agree to be bound by these Terms of Use. If you do not agree, please do not use this Site. We reserve the right to update these terms at any time; continued use after changes are posted constitutes acceptance.',
  },
  {
    title: "2. About the foundation",
    content:
      "The Nnenna Oriji Charity Foundation is a registered Nigerian charity. Our principal place of operation is 12 Adeniyi Jones Avenue, Ikeja, Lagos State, Nigeria, with a second hub at 8 Zoo Road, Nassarawa, Kano State. We operate outreach programmes delivering food, clothing, medical supplies and other essentials to households in need.",
  },
  {
    title: "3. Use of this website",
    content:
      "This Site is provided for informational and charitable purposes. You agree not to: • Use the Site in any way that breaches applicable Nigerian law or any other applicable law. • Submit false or misleading information through any form on this Site. • Attempt to gain unauthorised access to any part of this Site or its related systems. • Transmit any unsolicited commercial communications. • Use the Site in a way that could damage, disable, or impair its operation.",
  },
  {
    title: "4. Donations and pledges",
    content:
      "Submitting a donation pledge form on this Site constitutes an expression of intent, not a legally binding financial commitment unless explicitly stated. Cash donations processed via third-party payment providers are subject to those providers' own terms and conditions. All in-kind donations (food, clothing, medical supplies) are subject to acceptance by NOCF. We reserve the right to decline items that do not meet our distribution standards. We do not guarantee that pledged items will be collected by any specific date.",
  },
  {
    title: "5. Accuracy of information",
    content:
      "We aim to keep the information on this Site accurate and up to date. Impact figures, delivery counts, and cost estimates are drawn from our operational records and are updated after each outreach cycle. However, we make no warranty that all content is error-free or complete. If you spot an inaccuracy, please contact us.",
  },
  {
    title: "6. Intellectual property",
    content:
      "All content on this Site  including text, graphics, logos, images, and data  is owned by or licensed to the Nnenna Oriji Charity Foundation. You may not reproduce, distribute, or create derivative works from any content without our prior written permission, except for personal, non-commercial use or fair-dealing purposes permitted by Nigerian copyright law.",
  },
  {
    title: "7. Third-party links",
    content:
      "This Site contains links to external websites, including our Substack newsletter, Google Forms, and social media profiles. These links are provided for convenience only. NOCF has no control over the content or privacy practices of third-party sites and accepts no responsibility for them.",
  },
  {
    title: "8. Limitation of liability",
    content:
      "To the extent permitted by law, NOCF excludes all liability for loss or damage arising from your use of this Site, including indirect or consequential loss. Nothing in these terms limits our liability for fraud, death or personal injury caused by negligence, or any other liability that cannot be excluded under Nigerian law.",
  },
  {
    title: "9. Governing law",
    content:
      "These Terms of Use are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from your use of this Site will be subject to the exclusive jurisdiction of the Nigerian courts.",
  },
  {
    title: "10. Contact",
    content:
      "If you have questions about these terms, contact us at: eniobadeji@gmail.com Nnenna Oriji Charity Foundation 12 Adeniyi Jones Avenue, Ikeja, Lagos State, Nigeria",
  },
];

export default function TermsOfUse() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen text-black pt-32 pb-24">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="max-w-[800px] mb-16">
          <SectionLabel text="Legal" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl mt-6 mb-4">
            Terms of Use
          </h1>
          <p className="font-body text-[14px] text-gray-500 mb-8">
            Last updated: September 2026
          </p>
          <p className="font-body text-[16px] text-gray-700 leading-relaxed">
            Please read these terms carefully before using the Nnenna Oriji
            Charity Foundation website. They set out the rules for using this
            Site and the basis on which we operate it.
          </p>
        </div>

        <div className="w-full h-[1px] bg-gray-200 mb-16" />

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
          <div className="flex-1 flex flex-col gap-12">
            {terms.map((term, i) => (
              <div key={i} className="flex flex-col gap-4">
                <h3 className="font-heading font-bold text-[18px]">
                  {term.title}
                </h3>
                <p className="font-body text-[15px] leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {term.content}
                </p>
                {i < terms.length - 1 && (
                  <div className="w-full h-[1px] bg-gray-100 mt-8" />
                )}
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[350px] sticky top-32">
            <div className="bg-[#FFF8F5] rounded-[16px] p-8 border border-orange-50/50">
              <h3 className="font-heading font-bold text-[11px] tracking-widest uppercase text-[#FF4500] mb-8">
                KEY POINTS
              </h3>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h4 className="font-heading font-bold text-[14px]">
                    Jurisdiction
                  </h4>
                  <p className="font-body text-[13px] text-gray-600">
                    Governed by Nigerian law.
                  </p>
                </div>

                <div className="w-full h-[1px] bg-orange-900/5" />

                <div className="flex flex-col gap-1">
                  <h4 className="font-heading font-bold text-[14px]">
                    Donations
                  </h4>
                  <p className="font-body text-[13px] text-gray-600">
                    Pledges are expressions of intent, not binding commitments.
                  </p>
                </div>

                <div className="w-full h-[1px] bg-orange-900/5" />

                <div className="flex flex-col gap-1">
                  <h4 className="font-heading font-bold text-[14px]">
                    Content
                  </h4>
                  <p className="font-body text-[13px] text-gray-600">
                    All site content belongs to NOCF ask before reproducing.
                  </p>
                </div>

                <div className="w-full h-[1px] bg-orange-900/5" />

                <div className="flex flex-col gap-1">
                  <h4 className="font-heading font-bold text-[14px]">Links</h4>
                  <p className="font-body text-[13px] text-gray-600">
                    We&apos;re not responsible for external sites we link to.
                  </p>
                </div>

                <div className="w-full h-[1px] bg-orange-900/5" />

                <div className="flex flex-col gap-1">
                  <h4 className="font-heading font-bold text-[14px]">
                    Updates
                  </h4>
                  <p className="font-body text-[13px] text-gray-600">
                    Terms may change; continued use means acceptance.
                  </p>
                </div>
              </div>

              <p className="font-body text-[12px] text-gray-500 mt-12">
                Questions? Email{" "}
                <a
                  href="mailto:NOCF@gmail.com"
                  className="text-[#FF4500] hover:underline"
                >
                  NOCF@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
