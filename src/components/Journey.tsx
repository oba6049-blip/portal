import React from 'react';
import {
  FileText, UserCheck, BookOpen, Code, Award, Rocket
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Journey() {
  const steps = [
    {
      step: '01',
      title: 'Register',
      desc: 'Complete the student selection portal form with your target course and background variables.',
      icon: FileText,
      color: '#6F2DA8'
    },
    {
      step: '02',
      title: 'Get Admitted',
      desc: 'Connect with study coordinators to approve your curriculum, choose schedules, and confirm enrollments.',
      icon: UserCheck,
      color: '#A855F7'
    },
    {
      step: '03',
      title: 'Start Learning',
      desc: 'Commence structured cohorts led by senior engineering advocates on modern tool stacks.',
      icon: BookOpen,
      color: '#4C1D95'
    },
    {
      step: '04',
      title: 'Build Projects',
      desc: 'Construct comprehensive backend API services, deep agent frameworks, and multi-tier cloud clusters.',
      icon: Code,
      color: '#6F2DA8'
    },
    {
      step: '05',
      title: 'Get Certified',
      desc: 'Submit your capstone projects to receive verified professional credentials and transcripts.',
      icon: Award,
      color: '#A855F7'
    },
    {
      step: '06',
      title: 'Launch Your Career',
      desc: 'Leverage our broad internship placements and resume mentorship routes to secure technology roles.',
      icon: Rocket,
      color: '#4C1D95'
    }
  ];

  return (
    <section id="journey" className="py-24 bg-transparent transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6F2DA8] dark:text-[#A855F7] bg-purple-50 dark:bg-[#4C1D95]/30 px-3 py-1.5 rounded-full inline-block">
            Student Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white mt-4">
            The Roadmap to Technical Mastery
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm font-medium">
            Understand the complete academic phase cycle designed to propel beginners and professionals alike to the top of the engineering chain.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] mx-auto mt-4 rounded-full" />
        </div>

        {/* Timeline Visual Display layout */}
        <div className="relative mt-12">
          {/* Vertical central path line for larger screens */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-[#6F2DA8] via-[#A855F7] to-indigo-650 opacity-20" />

          <div className="space-y-12 lg:space-y-8">
            {steps.map((stepData, idx) => {
              const StepIcon = stepData.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={stepData.step}
                  className={`flex flex-col lg:flex-row items-stretch lg:items-center ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Left or Right Content Box */}
                  <div className="w-full lg:w-1/2 flex justify-center lg:justify-start lg:px-12">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.6 }}
                      className="w-full max-w-md bg-white/40 dark:bg-white/5 backdrop-blur-md border border-purple-100/25 dark:border-white/10 p-6 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-purple-500/5 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3 text-[#6F2DA8] dark:text-[#A855F7]">
                        <span className="text-xl font-black font-mono tracking-wider text-purple-200 dark:text-white/20">
                          {stepData.step}
                        </span>
                        <div className="p-2 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/5 rounded-xl">
                          <StepIcon className="w-5 h-5 text-[#6F2DA8]" />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                        {stepData.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2.5 leading-relaxed font-medium">
                        {stepData.desc}
                      </p>
                    </motion.div>
                  </div>

                  {/* Central Node Circle for timeline link */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-[#0a0a0c] border-2 border-purple-600/35 flex items-center justify-center shadow-md backdrop-blur-md">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#6F2DA8] animate-pulse" />
                    </div>
                  </div>

                  {/* Space matching empty column box */}
                  <div className="hidden lg:block w-1/2" />

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
