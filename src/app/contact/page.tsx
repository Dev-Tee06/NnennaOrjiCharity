"use client";

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

const CONTACT_INFO = {
  email: "eniobadeji@gmail.com",
  phone: "+234 803 000 0000",
  lagos: {
    name: "LAGOS HUB",
    address: "12 Adeniyi Jones Avenue, Ikeja, Lagos State, Nigeria",
    hours: "Mon – Fri, 9:00 – 17:00 WAT"
  },
  kano: {
    name: "KANO HUB",
    address: "8 Zoo Road, Nassarawa, Kano State, Nigeria",
    hours: "Mon – Fri, 9:00 – 16:00 WAT"
  }
};

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const isValid = formData.firstName.trim() !== '' && 
                  formData.lastName.trim() !== '' && 
                  formData.email.includes('@') && 
                  formData.subject !== '' && 
                  formData.message.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="bg-offWhite pb-24 min-h-screen">
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 px-4 md:px-8 xl:px-12 max-w-[1320px] mx-auto flex flex-col items-start text-left">
        <div className="flex items-center gap-2 bg-white border border-border px-4 py-1.5 rounded-full w-fit mb-8">
          <div className="w-2 h-2 rounded-full bg-orangeRed1" />
          <span className="font-body text-[13px] text-blackKnight font-medium">We reply within two working days</span>
        </div>
        
        <h1 className="font-heading font-bold text-[32px] sm:text-[38px] md:text-[42px] lg:text-[52px] leading-[1.05] tracking-tight md:tracking-[-0.03em] text-blackKnight w-full">
          Contact Us
        </h1>
        
        <p className="font-body text-[13px] md:text-[15px] lg:text-[17px] xl:text-[20px] text-text-secondary mt-6 max-w-[780px] leading-[1.5] md:leading-[1.55] lg:leading-[1.6]">
          Questions about a donation, a pickup, a partnership or the December roster — a real person reads every message that arrives here.
        </p>
      </section>

      {/* Main Contact Section Layout */}
      <section className="pb-12 lg:pb-[60px] bg-offWhite">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-12 flex flex-col lg:grid lg:grid-cols-[0.8fr_1.1fr] gap-12 lg:gap-[38px]">
          
          {/* Left Column: Info Cards */}
          <div className="flex flex-col w-full gap-[18px]">
            
            {/* Direct Contact Card */}
            <div className="bg-white border border-border rounded-[12px] p-6 lg:p-[32px] flex flex-col gap-6">
              <h3 className="font-heading font-bold text-[11px] md:text-[13px] uppercase tracking-[0.15em] text-orangeRed1">
                DIRECT CONTACT
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-start gap-4">
                  <Mail size={20} className="text-orangeRed1 shrink-0 mt-0.5" />
                  <a href={`mailto:${CONTACT_INFO.email}`} className="font-body text-[15px] font-medium text-blackKnight hover:text-orangeRed1 transition-colors break-all">
                    {CONTACT_INFO.email}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={20} className="text-orangeRed1 shrink-0" />
                  <a href={`tel:${CONTACT_INFO.phone}`} className="font-body text-[15px] font-medium text-blackKnight hover:text-orangeRed1 transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Lagos Hub Card */}
            <div className="bg-[#FCF7F5] border border-border rounded-[12px] p-6 lg:p-[32px] flex flex-col gap-6">
              <h3 className="font-heading font-bold text-[11px] md:text-[13px] uppercase tracking-[0.15em] text-orangeRed1">
                {CONTACT_INFO.lagos.name}
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-start gap-4">
                  <MapPin size={20} className="text-text-secondary shrink-0 mt-0.5" />
                  <span className="font-body text-[15px] font-medium text-blackKnight leading-relaxed">
                    {CONTACT_INFO.lagos.address}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Clock size={20} className="text-text-secondary shrink-0" />
                  <span className="font-body text-[15px] text-text-secondary">
                    {CONTACT_INFO.lagos.hours}
                  </span>
                </div>
              </div>
            </div>

            {/* Kano Hub Card */}
            <div className="bg-[#FCF7F5] border border-border rounded-[12px] p-6 lg:p-[32px] flex flex-col gap-6">
              <h3 className="font-heading font-bold text-[11px] md:text-[13px] uppercase tracking-[0.15em] text-orangeRed1">
                {CONTACT_INFO.kano.name}
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-start gap-4">
                  <MapPin size={20} className="text-text-secondary shrink-0 mt-0.5" />
                  <span className="font-body text-[15px] font-medium text-blackKnight leading-relaxed">
                    {CONTACT_INFO.kano.address}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Clock size={20} className="text-text-secondary shrink-0" />
                  <span className="font-body text-[15px] text-text-secondary">
                    {CONTACT_INFO.kano.hours}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Form */}
          <div className="w-full bg-white border border-border rounded-[12px] lg:rounded-[14px] p-6 lg:p-[32px] shadow-sm flex flex-col">
            <h2 className="font-heading font-bold text-[20px] md:text-[24px] text-blackKnight mb-8">
              Send us a message
            </h2>
            
            {submitted && (
              <div className="mb-6 p-4 rounded-[8px] bg-green-50 border border-green-100 text-green-800 font-body text-[14px]">
                Message sent successfully. We'll get back to you within two working days.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="flex flex-col md:grid md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[12px] md:text-[13px] font-medium text-blackKnight">First name</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-white border border-border/80 rounded-[8px] lg:rounded-[10px] px-4 py-3 h-[44px] md:h-[48px] font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-[3px] focus:ring-orangeRed1/10 transition-all placeholder-blackKnight/50"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[12px] md:text-[13px] font-medium text-blackKnight">Last name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-white border border-border/80 rounded-[8px] lg:rounded-[10px] px-4 py-3 h-[44px] md:h-[48px] font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-[3px] focus:ring-orangeRed1/10 transition-all placeholder-blackKnight/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[12px] md:text-[13px] font-medium text-blackKnight">Email address</label>
                <input 
                  type="email" 
                  placeholder="you@email.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white border border-border/80 rounded-[8px] lg:rounded-[10px] px-4 py-3 h-[44px] md:h-[48px] font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-[3px] focus:ring-orangeRed1/10 transition-all placeholder-blackKnight/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[12px] md:text-[13px] font-medium text-blackKnight">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white border border-border/80 rounded-[8px] lg:rounded-[10px] px-4 py-3 h-[44px] md:h-[48px] font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-[3px] focus:ring-orangeRed1/10 transition-all appearance-none text-blackKnight"
                >
                  <option value="" disabled className="text-blackKnight/50">Select a subject</option>
                  <option value="Donation Inquiry">Donation Inquiry</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[12px] md:text-[13px] font-medium text-blackKnight">Message</label>
                <textarea 
                  placeholder="How can we help?"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full min-h-[115px] md:min-h-[145px] lg:min-h-[160px] bg-white border border-border/80 rounded-[8px] lg:rounded-[10px] px-4 py-3 font-body text-sm focus:outline-none focus:border-orangeRed1 focus:ring-[3px] focus:ring-orangeRed1/10 transition-all resize-y placeholder-blackKnight/50"
                />
              </div>

              <div className="mt-2">
                <Button 
                  type="submit" 
                  disabled={!isValid}
                  className="w-full md:w-auto flex justify-center items-center gap-2 rounded-[9px] px-6 py-3.5"
                >
                  <span>Send Message</span>
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
