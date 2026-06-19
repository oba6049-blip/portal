import React, { useState, useEffect } from 'react';
import { MessageSquareText, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show a helpful chat tooltip after 5 seconds to encourage enrollment conversions
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 5500);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = 'https://wa.me/2348124305552';

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start font-sans">
      
      {/* Dynamic Pop-up Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            className="mb-3 max-w-xs bg-white/45 dark:bg-white/5 backdrop-blur-md border border-purple-150/15 dark:border-white/10 p-3 rounded-2xl shadow-xl flex items-start space-x-2 relative"
          >
            <div className="p-1.5 bg-white/65 dark:bg-black/50 rounded-xl text-[#6F2DA8] dark:text-[#A855F7] flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            
            <div className="text-xs">
              <p className="font-bold text-neutral-900 dark:text-white leading-tight">Admissions Helpline</p>
              <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                Ask about current discounts, classes, and schedules!
              </p>
            </div>

            <button
              onClick={() => setShowTooltip(false)}
              className="p-1 rounded text-neutral-300 hover:text-neutral-500 absolute top-1 right-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-[#25D366] text-white shadow-lg hover:shadow-green-500/20 font-bold text-xs uppercase tracking-wider"
      >
        <MessageSquareText className="w-5 h-5" />
        <span className="hidden sm:inline">Chat Admissions</span>
      </motion.a>
      
    </div>
  );
}
