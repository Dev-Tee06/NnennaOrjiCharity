import { SectionLabel } from "@/components/SectionLabel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the Nnenna Oriji Charity Foundation website.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const policies = [
  {
    title: "1. Who we are",
    content:
      "The Nnenna Oriji Charity Foundation is a registered Nigerian charity operating outreach hubs in Lagos and Kano. Our registered contact address is 12 Adeniyi Jones Avenue, Ikeja, Lagos State, Nigeria. You can reach our data contact at eniobadeji@gmail.com.",
  },
  {
    title: "2. What information we collect",
    content:
      "We collect information you provide directly to us:\n• Contact forms: your name, email address, and the message you submit.\n• Donation pledges: your name, phone number or email, and a description of the goods you intend to donate.\n• Partnership enquiries: your organisation name, representative name, email address, and message.\n• Newsletter sign-up: your email address only.\n• Volunteer applications: name, city, availability, and skills, submitted through our external Google Form (governed by Google's privacy policy).\nWe do not collect payment card data directly. Any cash donation processing is handled by third-party payment providers under their own privacy policies.",
  },
  {
    title: "3. How we use your information",
    content:
      "We use the information you give us to:\n• Respond to your enquiry or process your donation pledge.\n• Coordinate logistics for in-kind donations (food, clothing, medical supplies).\n• Send foundation updates to newsletter subscribers.\n• Improve how we communicate and operate.\nWe do not sell, rent, or share your personal data with third parties for marketing purposes.",
  },
  {
    title: "4. Legal basis for processing",
    content:
      "Where applicable under the Nigeria Data Protection Act (NDPA) 2023, we process your data on the following bases:\n• Consent: for newsletter subscriptions, which you may withdraw at any time.\n• Legitimate Interests: for responding to enquiries and coordinating donations.\n• Performance of a task in the public interest: for charitable outreach activities.",
  },
  {
    title: "5. How long we keep your data",
    content:
      "We retain contact and donation records for up to five years after our last interaction, in line with Nigerian charity accounting obligations. Newsletter subscriber data is held until you unsubscribe. You may request deletion at any time (see Section 7).",
  },
  {
    title: "6. Cookies and analytics",
    content:
      "This website does not currently use tracking cookies or third-party analytics scripts. If we introduce these in future, this policy will be updated and a cookie notice will be displayed.",
  },
  {
    title: "7. Your rights",
    content:
      "You have the right to:\n• Access the personal data we hold about you.\n• Correct inaccurate data.\n• Request deletion of your data.\n• Withdraw consent for newsletter communications at any time.\nTo exercise any of these rights, email us at eniobadeji@gmail.com. We will respond within 30 days.",
  },
  {
    title: "8. Third-party services",
    content:
      "Our website links to external services including our Substack newsletter archive and a Google Forms volunteer application. These services are governed by their own privacy policies. We are not responsible for their data practices.",
  },
  {
    title: "9. Changes to this policy",
    content:
      'We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page will reflect any changes. Continued use of this website after changes are posted constitutes acceptance of the revised policy.',
  },
  {
    title: "10. Contact",
    content:
      "For privacy-related questions, contact us at: eniobadeji@gmail.com Nnenna Oriji Charity Foundation 12 Adeniyi Jones Avenue, Ikeja, Lagos State, Nigeria",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen text-black pt-32 pb-24">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="max-w-[800px] mb-16">
          <SectionLabel text="Legal" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl mt-6 mb-4">
            Privacy Policy
          </h1>
          <p className="font-body text-[14px] text-gray-500 mb-8">
            Last updated: September 2026
          </p>
          <p className="font-body text-[16px] text-gray-700 leading-relaxed">
            This policy explains what personal information the Nnenna Oriji
            Charity Foundation collects when you use this website, how we use
            it, and what rights you have over it.
          </p>
        </div>

        <div className="w-full h-[1px] bg-gray-200 mb-16" />

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
          <div className="flex-1 flex flex-col gap-12">
            {policies.map((policy, i) => (
              <div key={i} className="flex flex-col gap-4">
                <h3 className="font-heading font-bold text-[18px]">
                  {policy.title}
                </h3>
                <p className="font-body text-[15px] leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {policy.content}
                </p>
                {i < policies.length - 1 && (
                  <div className="w-full h-[1px] bg-gray-100 mt-8" />
                )}
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[350px] sticky top-32">
            <div className="bg-[#FFF8F5] rounded-[16px] p-8 border border-orange-50/50">
              <h3 className="font-heading font-bold text-[11px] tracking-widest uppercase text-[#FF4500] mb-8">
                QUICK SUMMARY
              </h3>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h4 className="font-heading font-bold text-[14px]">
                    We collect
                  </h4>
                  <p className="font-body text-[13px] text-gray-600">
                    Only what you give us directly: name, email, message.
                  </p>
                </div>

                <div className="w-full h-[1px] bg-orange-900/5" />

                <div className="flex flex-col gap-1">
                  <h4 className="font-heading font-bold text-[14px]">
                    We don&apos;t sell
                  </h4>
                  <p className="font-body text-[13px] text-gray-600">
                    Your data is never sold or shared for marketing.
                  </p>
                </div>

                <div className="w-full h-[1px] bg-orange-900/5" />

                <div className="flex flex-col gap-1">
                  <h4 className="font-heading font-bold text-[14px]">
                    Newsletter
                  </h4>
                  <p className="font-body text-[13px] text-gray-600">
                    Email only. Unsubscribe any time.
                  </p>
                </div>

                <div className="w-full h-[1px] bg-orange-900/5" />

                <div className="flex flex-col gap-1">
                  <h4 className="font-heading font-bold text-[14px]">
                    Retention
                  </h4>
                  <p className="font-body text-[13px] text-gray-600">
                    Records kept up to 5 years per charity law.
                  </p>
                </div>

                <div className="w-full h-[1px] bg-orange-900/5" />

                <div className="flex flex-col gap-1">
                  <h4 className="font-heading font-bold text-[14px]">
                    Your rights
                  </h4>
                  <p className="font-body text-[13px] text-gray-600">
                    Access, correct, or delete your data by emailing us.
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
