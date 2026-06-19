import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Send, MessageSquareCode, CheckCircle2,
  Instagram, Linkedin, Twitter, Github, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Contact() {
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    topic: 'Admissions',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name.trim() || !inquiryForm.email.trim() || !inquiryForm.message.trim()) {
      alert("Please execute complete validation parameters.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setInquiryForm({ name: '', email: '', topic: 'Admissions', message: '' });
      setTimeout(() => setIsSent(false), 5000); // Reset toast status after 5s
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  const contactOptions = [
    {
      icon: Mail,
      label: 'Email Inquiries',
      value: 'admissions@textocode.com',
      sub: 'Replies within 12 working hours',
      href: 'mailto:admissions@textocode.com'
    },
    {
      icon: Phone,
      label: 'Hotline Desk',
      value: '+234 (0) 809-770-8800',
      sub: 'Mon - Fri, 9:00am - 5:00pm',
      href: 'tel:+2348097708800'
    },
    {
      icon: MessageSquareCode,
      label: 'WhatsApp Admissions',
      value: '+234 (0) 812-430-5552',
      sub: 'Instant chat verification desk',
      href: 'https://wa.me/2348124305552'
    },
    {
      icon: MapPin,
      label: 'Main Office Address',
      value: '72 Herbert Macaulay Way, Yaba, Lagos',
      sub: 'Adjacent TechZone Accelerator Hub',
      href: '#'
    }
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <section id="contact" className="py-24 bg-transparent transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6F2DA8] dark:text-[#A855F7] bg-purple-50 dark:bg-[#4C1D95]/30 px-3 py-1.5 rounded-full inline-block">
            Connect
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white mt-4">
            Begin the Conversation
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm font-medium">
            Contact our coordinators directly or send us an instant electronic message using the interactive module.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] mx-auto mt-4 rounded-full" />
        </div>

        {/* Content Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Connect Directly with Student Services
            </h3>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium pb-4">
              Our support officers are available daily to resolve syllabus complexities, payment parameters, and custom schedule configurations.
            </p>

            <div className="space-y-4">
              {contactOptions.map((opt) => {
                const ItemIcon = opt.icon;
                return (
                  <a
                    key={opt.label}
                    href={opt.href}
                    target={opt.href !== '#' ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex items-start p-4 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-purple-100/25 dark:border-white/10 hover:border-[#6F2DA8] dark:hover:border-[#A855F7] hover:shadow-2xl transition-all group block"
                  >
                    <div className="p-3 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/5 text-[#6F2DA8] dark:text-[#A855F7] rounded-xl group-hover:scale-110 transition-transform">
                      <ItemIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="ml-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                        {opt.label}
                      </h4>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white mt-1">
                        {opt.value}
                      </p>
                      <p className="text-[11px] text-neutral-500 font-mono mt-0.5 whitespace-nowrap">
                        {opt.sub}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Social Links Row */}
            <div className="pt-4 flex items-center space-x-3">
              <span className="text-xs uppercase font-mono font-bold text-neutral-400">Follow:</span>
              {socialLinks.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-white/40 dark:bg-white/5 border border-purple-100/10 dark:border-white/10 hover:border-[#6F2DA8] dark:hover:border-[#A855F7] text-neutral-400 hover:text-white rounded-xl transition-all"
                    aria-label={social.label}
                  >
                    <SocialIcon className="w-4.5 h-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right form and Map column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Direct inquiry form */}
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-purple-100/25 dark:border-white/10 rounded-2xl p-6 sm:p-8">
              <h4 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center mb-6">
                Send Electronic Inquiry Message
              </h4>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={inquiryForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 focus:border-[#6F2DA8] dark:focus:border-[#A855F7] text-sm text-neutral-900 dark:text-white rounded-xl"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={inquiryForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 focus:border-[#6F2DA8] dark:focus:border-[#A855F7] text-sm text-neutral-900 dark:text-white rounded-xl"
                      placeholder="janedoe@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                    Inquiry Subject Topic
                  </label>
                  <select
                    name="topic"
                    value={inquiryForm.topic}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 focus:border-[#6F2DA8] dark:focus:border-[#A855F7] text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none"
                  >
                    <option value="Admissions">Admissions & Schedules</option>
                    <option value="Scholarships">Scholarships & Installments</option>
                    <option value="Syllabus">Curriculum Customization</option>
                    <option value="Corporate">Corporate Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    required
                    value={inquiryForm.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 focus:border-[#6F2DA8] dark:focus:border-[#A855F7] text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none"
                    placeholder="Provide queries about cohorts structure, payment intervals..."
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || isSent}
                    className="w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-neutral-900 dark:bg-neutral-800 hover:bg-[#6F2DA8] dark:hover:bg-[#A855F7] flex items-center transition-all cursor-pointer"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Inquiry Message'}
                    <Send className="w-4 h-4 ml-2" />
                  </button>

                  <AnimatePresence>
                    {isSent && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-emerald-600 dark:text-emerald-400 flex items-center text-xs font-mono font-bold"
                      >
                        <CheckCircle2 className="w-4.5 h-4.5 mr-1" /> MESSAGE_SENT!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

              </form>
            </div>

            {/* Stylized map layout card */}
            <div className="relative h-64 border border-purple-100 dark:border-neutral-800 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 shadow-inner group">
              
              {/* Abstract Google Maps grid graphics layout */}
              <div className="absolute inset-0 bg-[#ebebeb] dark:bg-[#1a1a1a] p-4 opacity-100 flex flex-col justify-between">
                
                {/* Visual grid roads map styling */}
                <svg width="100%" height="100%" className="absolute inset-0 opacity-25" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0,40 C 200,40 300,180 600,180 M 300,0 V 300 M 150,0 Q 150,150 500,150" stroke="currentColor" strokeWidth="8" fill="none" className="text-white dark:text-neutral-800" />
                  <path d="M 500,0 V 300 M 0,220 H 600" stroke="currentColor" strokeWidth="4" fill="none" className="text-white dark:text-neutral-800" />
                </svg>

                {/* Locator PIN */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="relative flex h-8 w-8 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#6F2DA8] border-2 border-white"></span>
                  </span>
                  <div className="bg-white dark:bg-neutral-900 border border-purple-100 dark:border-neutral-800 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold text-neutral-900 dark:text-white whitespace-nowrap shadow-md mt-1 scale-95 uppercase">
                    Textocode Academy HQ
                  </div>
                </div>

                <div className="relative z-10 text-neutral-400 dark:text-neutral-600 text-[9px] font-mono tracking-widest p-2">
                  GOOGLE_MAPS_STYLIZED_PLACEHOLDER
                </div>

                <div className="relative z-10 self-end p-2">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-2.5 py-1 text-[9px] font-mono font-bold text-[#6F2DA8] bg-white dark:bg-neutral-900 border rounded shadow-sm hover:bg-neutral-50 mr-2"
                  >
                    Open Google Maps <Globe className="w-3 h-3 ml-1" />
                  </a>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
