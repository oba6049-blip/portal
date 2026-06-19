import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircleQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQS } from '../constants';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id); // First item open by default

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 bg-transparent transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6F2DA8] dark:text-[#A855F7] bg-purple-50 dark:bg-[#4C1D95]/30 px-3 py-1.5 rounded-full inline-block">
            FAQ Desk
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white mt-4">
            Frequently Answered Academic Inquiries
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm font-medium">
            Review detailed breakdowns of academy logistics, payment profiles, and certificate verifications.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] mx-auto mt-4 rounded-full" />
        </div>

        {/* Accordions grid/list layout */}
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faqItem) => {
            const isOpen = openId === faqItem.id;
            return (
              <div
                key={faqItem.id}
                className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-purple-100/25 dark:border-white/10 hover:border-[#6F2DA8] dark:hover:border-[#A855F7] rounded-2xl shadow-sm transition-all overflow-hidden"
              >
                {/* Header Toggle bar */}
                <button
                  onClick={() => toggleFAQ(faqItem.id)}
                  type="button"
                  className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-sm sm:text-base text-neutral-900 dark:text-white hover:text-purple-600 dark:hover:text-[#A855F7] transition-all cursor-pointer focus:outline-none"
                >
                  <span className="flex items-center pr-4">
                    <MessageCircleQuestion className="w-5 h-5 mr-3 text-[#6F2DA8] dark:text-[#A855F7] flex-shrink-0" />
                    {faqItem.question}
                  </span>
                  
                  {/* Chevron rotate icon */}
                  <span className="flex-shrink-0">
                    <ChevronDown className={`w-5 h-5 text-neutral-400 transform transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#6F2DA8]' : ''
                    }`} />
                  </span>
                </button>

                {/* Animated Inner Expandable text body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-purple-100/15 dark:border-white/5">
                        <p className="font-medium">
                          {faqItem.answer}
                        </p>
                        <div className="mt-3 flex items-center text-[10px] font-mono font-bold text-[#A855F7]">
                          <HelpCircle className="w-3.5 h-3.5 mr-1 text-[#6F2DA8]" />
                          Still have questions? Chat with our team below.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
