import React from 'react';
import {
  Tv, GraduationCap, Code2, Award, Compass, Building, Users2, Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: Tv,
      title: 'Live Interactive Training',
      description: 'Interact live with trainers during workshops. Break into interactive whiteboard structures, compile together in real-time labs, and unlock doubts instantly.'
    },
    {
      icon: GraduationCap,
      title: 'Industry Expert Instructors',
      description: 'Study under real practitioners. Our teaching associates are certified engineers with active seniority in top digital and cloud organizations.'
    },
    {
      icon: Code2,
      title: 'Hands-On Projects',
      description: 'Graduate with a bulletproof GitHub portfolio! Construct active web products, train deep learning algorithms, and manage automated CI/CD servers.'
    },
    {
      icon: Award,
      title: 'Professional Certifications',
      description: 'Graduate with globally verifiable credentials recognized across major cloud infrastructure players and international web recruitment hubs.'
    },
    {
      icon: Compass,
      title: 'Career Mentorship',
      description: 'Receive personalized profile polishing, resume structural analysis, algorithmic practice routines, and technical dry run interviews.'
    },
    {
      icon: Building,
      title: 'Internship Opportunities',
      description: 'Accelerate corporate entry. Textocode places eligible alumni directly within software consultancy networks for internship tracks.'
    },
    {
      icon: Users2,
      title: 'Community Support',
      description: 'Gain lifelong admission to our elite student Discord servers. Collaborate, share open tech roles, and find development hacks.'
    },
    {
      icon: Calendar,
      title: 'Flexible Learning',
      description: 'Retain your current occupation. We schedule evening streams or deep weekend bootcamps so everyone can skill up at their own pace.'
    }
  ];

  return (
    <section id="why-choose" className="py-24 bg-transparent transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6F2DA8] dark:text-[#A855F7] bg-purple-50 dark:bg-[#4C1D95]/30 px-3 py-1.5 rounded-full inline-block">
            Our Edge
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white mt-4">
            An Education Built on Operational Outcomes
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm sm:text-base font-medium">
            Discover why Textocode Academy leads technical training systems across AI, Software Craft, and Developer Operations.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] mx-auto mt-4 rounded-full" />
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => {
            const IconComponent = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group relative flex flex-col justify-between p-6 bg-white/40 dark:bg-white/5 backdrop-blur-md border border-purple-100/25 dark:border-white/10 hover:border-[#6F2DA8] dark:hover:border-[#A855F7] rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-purple-500/5 transition-all outline-none"
              >
                {/* Background ambient halo hover overlay */}
                <span className="absolute inset-0 bg-gradient-to-br from-[#6F2DA8]/5 to-[#4C1D95]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-start">
                  {/* Icon Circle */}
                  <div className="p-3 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/5 text-[#6F2DA8] dark:text-[#A855F7] rounded-xl group-hover:scale-110 group-hover:bg-[#6F2DA8] group-hover:text-white dark:group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Feature Title */}
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-5">
                    {reason.title}
                  </h3>

                  {/* Feature description */}
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2.5">
                    {reason.description}
                  </p>
                </div>

                {/* Micro corner circuit board matching dot decoration */}
                <span className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-purple-200 dark:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
