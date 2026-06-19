import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS } from '../constants';

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const activeReview = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-transparent transition-colors duration-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6F2DA8] dark:text-[#A855F7] bg-purple-50 dark:bg-[#4C1D95]/30 px-3 py-1.5 rounded-full inline-block">
            Student Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white mt-4">
            Accelerated Career Success Stories
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm font-medium">
            Read how global developers and engineers transformed their career avenues through our hands-on course sequences.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] mx-auto mt-4 rounded-full" />
        </div>

        {/* Testimonials Slide Box Container */}
        <div className="relative max-w-4xl mx-auto bg-white/40 dark:bg-white/5 backdrop-blur-md border border-purple-100/25 dark:border-white/10 rounded-2xl p-8 sm:p-14 shadow-lg">
          
          <div className="absolute top-6 right-8 text-purple-200 dark:text-neutral-800">
            <Quote className="w-14 h-14" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview.id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              
              {/* Profile Photo representation */}
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="relative">
                  {/* Decorative glowing gradient ring */}
                  <span className="absolute inset-0 bg-gradient-to-tr from-[#6F2DA8] to-[#A855F7] rounded-full filter blur-md opacity-25" />
                  <img
                    src={activeReview.avatar}
                    alt={activeReview.name}
                    className="relative w-24 h-24 object-cover rounded-full border-2 border-purple-100 dark:border-neutral-850 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  {/* Verified account badge */}
                  <span className="absolute bottom-1 right-1 bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] text-white p-1 rounded-full shadow">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>

                <h4 className="text-[#6F2DA8] dark:text-[#A855F7] font-bold text-base mt-4 font-mono uppercase tracking-wide">
                  {activeReview.name}
                </h4>
                <p className="text-neutral-500 dark:text-neutral-300 text-xs font-semibold leading-tight">
                  {activeReview.role}
                </p>
              </div>

              {/* Review Comment detail */}
              <div className="md:col-span-8 space-y-4">
                
                {/* Five star rating component */}
                <div className="flex items-center space-x-1">
                  {[...Array(activeReview.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Testimonial Quote */}
                <p className="text-neutral-700 dark:text-neutral-300 text-base sm:text-lg italic leading-relaxed font-medium">
                  "{activeReview.quote}"
                </p>

                {/* Small indicator tag */}
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#6F2DA8] dark:text-[#A855F7] font-bold">
                  * Verified Alumni Feedback *
                </p>

              </div>

            </motion.div>
          </AnimatePresence>

          {/* Slider Controllers (Arrow controls) */}
          <div className="flex items-center justify-between mt-8 border-t border-purple-100/15 dark:border-white/5 pt-6">
            
            {/* Index position indicators */}
            <div className="flex space-x-1.5">
              {TESTIMONIALS.map((review, idx) => (
                <button
                  key={review.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-[#6F2DA8] dark:bg-[#A855F7]' : 'w-2 bg-neutral-300 dark:bg-neutral-800'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Left/Right Arrow button row */}
            <div className="flex space-x-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl border border-purple-100/15 dark:border-white/5 bg-white/40 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:bg-white/60 dark:hover:bg-white/15 hover:text-purple-600 dark:hover:text-[#A855F7] transition-all cursor-pointer"
                aria-label="Previous Student"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl border border-purple-100/15 dark:border-white/5 bg-white/40 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:bg-white/60 dark:hover:bg-white/15 hover:text-purple-600 dark:hover:text-[#A855F7] transition-all cursor-pointer"
                aria-label="Next Student"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
