import React, { useEffect, useState } from 'react';
import { Play, Sparkles, Cpu, Cloud, Database, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onScrollTo: (sectionId: string) => void;
}

// Custom hook for animated stats counter
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = Math.ceil(value / (duration / 16)); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="font-bold tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Hero({ onScrollTo }: HeroProps) {
  const stats = [
    { value: 1000, suffix: '+', label: 'Students Trained' },
    { value: 20, suffix: '+', label: 'Professional Courses' },
    { value: 10, suffix: '+', label: 'Expert Instructors' },
    { value: 95, suffix: '%', label: 'Student Satisfaction' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 pb-16 flex flex-col justify-center overflow-hidden bg-transparent transition-colors"
    >
      {/* Mesh/Gradient Backdrops */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-900/15 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-950/10 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Futuristic Grid & SVG Circuit background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] pointer-events-none" />

      {/* SVG Circuit Path Decoration (Abstract technology layout) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 opacity-30 dark:opacity-20 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,100 L300,100 L350,150 L650,150 L700,100 L950,100" stroke="#a855f7" strokeWidth="1" strokeDasharray="5 5" />
          <path d="M150,200 L400,200 L450,250 L850,250" stroke="#6f2da8" strokeWidth="1.5" />
          <circle cx="350" cy="150" r="4" fill="#6f2da8" />
          <circle cx="700" cy="100" r="4" fill="#a855f7" />
          <circle cx="450" cy="250" r="5" fill="#a855f7" className="animate-pulse" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Accent, Header, Description & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Super Header Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass-badge"
            >
              <Sparkles className="w-4 h-4 text-[#6F2DA8] dark:text-[#A855F7]" />
              <span className="text-xs font-semibold text-purple-900 dark:text-purple-200 uppercase tracking-wider font-mono">
                The Future of Tech Education Is Here
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.1]"
            >
              Launch Your Tech Career with{' '}
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#6F2DA8] via-[#A855F7] to-indigo-600 block sm:inline">
                Textocode Academy
              </span>
            </motion.h1>

            {/* Subheadline Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              Master Artificial Intelligence, Cloud Computing, Software Development, DevOps, and Data Analytics through practical hands-on training designed for real-world success.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => onScrollTo('register')}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] rounded-xl shadow-lg shadow-purple-500/20 dark:shadow-purple-900/30 hover:shadow-purple-500/30 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                Register Now
              </button>
              
              <button
                onClick={() => onScrollTo('courses')}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-base font-bold text-[#6F2DA8] dark:text-[#A855F7] bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 hover:-translate-y-0.5 hover:scale-[1.02] border border-purple-200/35 dark:border-white/10 rounded-xl transition-all cursor-pointer group"
              >
                Explore Courses 
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

          </div>

          {/* Hero Visual Dashboard Representation */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md aspect-square"
            >
              {/* Spinning visual orbits */}
              <div className="absolute inset-0 border border-purple-300/25 dark:border-purple-600/10 rounded-full animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-4 border border-dashed border-purple-400/20 dark:border-purple-500/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute inset-16 border border-neutral-350/15 dark:border-neutral-850 rounded-full" />

              {/* Main Hologram Card inside Orbits */}
              <div className="absolute inset-10 bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/25 dark:border-white/10 rounded-3xl shadow-2xl p-6 flex flex-col justify-between overflow-hidden group">
                {/* Circuit background accent */}
                <span className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#A855F7]/10 dark:bg-[#A855F7]/5 rounded-full filter blur-xl" />
                
                <div className="flex items-center justify-between border-b border-purple-100 dark:border-neutral-850 pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-rose-500 rounded-full" />
                    <span className="w-3 h-3 bg-amber-500 rounded-full" />
                    <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#6F2DA8] dark:text-[#A855F7] bg-purple-50 dark:bg-purple-950/30 px-2 py-1 rounded-md">
                    TEXTO_CORE_OS
                  </span>
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex items-center space-x-3 bg-white/40 dark:bg-black/30 backdrop-blur-md p-3 rounded-xl border border-purple-100/10 dark:border-white/5 transform hover:-translate-x-1 transition-all">
                    <Cpu className="w-6 h-6 text-[#6F2DA8]" />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Artificial Intelligence</h4>
                      <p className="text-[10px] text-neutral-500 leading-none">Agents, ML Models & GenAI</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/40 dark:bg-black/30 backdrop-blur-md p-3 rounded-xl border border-purple-100/10 dark:border-white/5 transform hover:translate-x-1 transition-all">
                    <Cloud className="w-6 h-6 text-[#A855F7]" />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Cloud Computing</h4>
                      <p className="text-[10px] text-neutral-500 leading-none">AWS, Azure & Google Cloud</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/40 dark:bg-black/30 backdrop-blur-md p-3 rounded-xl border border-purple-100/10 dark:border-white/5 transform hover:-translate-x-1 transition-all">
                    <Database className="w-6 h-6 text-indigo-500" />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-950 dark:text-white">DevOps & Data</h4>
                      <p className="text-[10px] text-neutral-500 leading-none">Kubernetes, DevOps & Sci</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-purple-100 dark:border-neutral-850 text-xs text-neutral-500 font-mono">
                  <span>SYSTEM STATUS: COMPILING</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>

              </div>
            </motion.div>
          </div>

        </div>

        {/* Statistics Floating Panel Counter Section */}
        <div id="statistics-floating-panel" className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-purple-100/35 dark:border-white/10 rounded-2xl shadow-xl"
          >
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`text-center ${
                  idx < stats.length - 1 ? 'md:border-r border-neutral-100 dark:border-neutral-800' : ''
                }`}
              >
                <p className="text-3xl sm:text-4xl text-[#6F2DA8] dark:text-[#A855F7] tracking-tight">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
