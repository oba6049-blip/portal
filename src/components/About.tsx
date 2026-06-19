import React from 'react';
import { Target, BookOpen, Compass, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const highlights = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To democratize access to world-class technology skill training, transforming students into highly employable tech experts capable of steering global digital transformation.'
    },
    {
      icon: BookOpen,
      title: 'Why Practical Learning Matters',
      description: 'Slide decks do not compile code. Our project-centric curriculum guarantees that every student constructs, operates, and debugs real software systems modeled after professional environments.'
    },
    {
      icon: ShieldCheck,
      title: 'Our Commitment to Your Future',
      description: 'We are committed to delivering the ultimate training curriculum updated weekly to align with advancements in GenAI models, Cloud, and Software practices.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-transparent transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6F2DA8] dark:text-[#A855F7] bg-purple-50 dark:bg-[#4C1D95]/30 px-3 py-1.5 rounded-full inline-block">
            Who We Are
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white mt-4">
            Shaping the Next Paradigm of Tech Innovators
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] mx-auto mt-4 rounded-full" />
        </div>

        {/* About Presentation Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text / Info */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Practical Technology Training for True Career Acceleration
            </h3>
            
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
              Textocode Academy is a premium tech-enablement platform built to equip aspiring software engineers, enterprise planners, and students with high-demand digital skills since the dawn of the cloud-first era.
            </p>

            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
              We bridge the gap between academic theory and practical corporate realities. Each course catalog has been built from the ground up by active senior engineers and certified cloud architects to mirror genuine enterprise operations.
            </p>

            {/* Structured highlight boxes */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-purple-100/25 dark:border-white/10 flex items-center space-x-3">
                <Medal className="w-8 h-8 text-[#6F2DA8]" />
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Industry Standard</h4>
                  <p className="text-xs text-neutral-500">Verified syllabi</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-purple-100/25 dark:border-white/10 flex items-center space-x-3">
                <HeartHandshake className="w-8 h-8 text-indigo-500" />
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Active Support</h4>
                  <p className="text-xs text-neutral-500">Mentorship access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Cards list (Framer-Motion reveals) */}
          <div className="lg:col-span-6 space-y-6">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-purple-100/25 dark:border-white/10 hover:border-[#6F2DA8] dark:hover:border-[#A855F7] hover:shadow-xl transition-all group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/60 dark:bg-black/40 rounded-xl border border-purple-150/15 dark:border-white/5 text-[#6F2DA8] dark:text-[#A855F7] group-hover:scale-105 transition-transform duration-250">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

// Inline minor subcomponent to avoid additional imports
function Medal(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="7" />
      <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
    </svg>
  );
}
