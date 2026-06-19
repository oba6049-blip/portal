import React, { useState, useMemo } from 'react';
import {
  Sparkles, Sliders, MessageSquareText, Zap, Cpu, Binary, Network, Briefcase,
  Cloud, ShieldAlert, Brain, Workflow, ShieldCheck, Server,
  Code, FileCode, Atom, Play, ServerCrash, Globe, Smartphone,
  FileSpreadsheet, Database, BarChart3, LineChart,
  GitBranch, Layers, Orbit, Terminal, Repeat, Settings,
  Search, Clock, BookOpen, ChevronRight, X, Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COURSES } from '../constants';
import { Course, CourseCategory } from '../types';

// Dynamic mapper resolving string iconNames to matching Lucide React component nodes
const IconMap: Record<string, React.ComponentType<any>> = {
  Sparkles, Sliders, MessageSquareText, Zap, Cpu, Binary, Network, Briefcase,
  Cloud, ShieldAlert, Brain, Workflow, ShieldCheck, Server,
  Code, FileCode, Atom, Play, ServerCrash, Globe, Smartphone,
  FileSpreadsheet, Database, BarChart3, LineChart,
  GitBranch, Layers, Orbit, Terminal, Repeat, Settings
};

interface CoursesProps {
  onSelectCourse: (courseTitle: string) => void;
}

export default function Courses({ onSelectCourse }: CoursesProps) {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<Course | null>(null);

  const categories: { label: string; value: CourseCategory }[] = [
    { label: 'All Subjects', value: 'all' },
    { label: 'AI & Machine Learning', value: 'Artificial Intelligence' },
    { label: 'Cloud Computing', value: 'Cloud Computing' },
    { label: 'Programming & Development', value: 'Programming & Development' },
    { label: 'Data Analytics', value: 'Data Analytics' },
    { label: 'DevOps & Systems', value: 'DevOps & Infrastructure' },
  ];

  // Search and filter memoized compute
  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchCategory = activeCategory === 'all' || course.category === activeCategory;
      const matchSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="courses" className="py-24 bg-transparent transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6F2DA8] dark:text-[#A855F7] bg-purple-50 dark:bg-[#4C1D95]/30 px-3 py-1.5 rounded-full inline-block">
            Our Catalog
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white mt-4">
            Industrial Cloud and AI Career Sprints
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm sm:text-base font-medium">
            Explore and select state-of-the-art developer certifications structured specifically for contemporary technical roles.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] mx-auto mt-4 rounded-full" />
        </div>

        {/* Catalog Control Header Panel (Filter Chips & Search) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 mb-12 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-purple-100/25 dark:border-white/10 p-4 rounded-2xl shadow-lg">
          
          {/* Category Chips Scroll Box */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 scroll-smooth flex-1 pr-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.value
                    ? 'bg-[#6F2DA8] text-white shadow-md shadow-purple-500/20'
                    : 'bg-white/30 dark:bg-white/5 border border-purple-100/10 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:text-[#6F2DA8] dark:hover:text-[#A855F7] hover:bg-white/50 dark:hover:bg-white/15'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input Container */}
          <div className="relative w-full md:max-w-xs flex-shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-neutral-400" />
            </span>
            <input
              type="text"
              placeholder="Search specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-purple-150/15 dark:border-white/10 bg-white/60 dark:bg-black/40 text-sm focus:outline-none focus:border-[#6F2DA8] dark:focus:border-[#A855F7] text-neutral-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
              </button>
            )}
          </div>

        </div>

        {/* Real-time Courses Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => {
              const IconComponent = IconMap[course.iconName] || BookOpen;
              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="group flex flex-col justify-between bg-white/40 dark:bg-white/5 backdrop-blur-md border border-purple-100/25 dark:border-white/10 hover:border-[#6F2DA8] dark:hover:border-[#A855F7] rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all overflow-hidden"
                >
                  {/* Dynamic Top Gradient Bar per card */}
                  <span className="h-1.5 w-full bg-gradient-to-r from-[#6F2DA8] via-purple-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Icon & Category Tag row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/5 rounded-xl text-[#6F2DA8] dark:text-[#A855F7] group-hover:scale-105 transition-transform duration-250">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-1 rounded bg-purple-100/50 dark:bg-purple-950/25 text-purple-900 dark:text-purple-300">
                          {course.category.split(' & ')[0].split(' ')[0]} {/* Shorthand */}
                        </span>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-tight mb-2">
                        {course.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                        {course.description}
                      </p>
                    </div>

                    {/* Metadata Footer bar (Duration & Action buttons) */}
                    <div className="mt-6 pt-4 border-t border-purple-100/15 dark:border-white/5 flex items-center justify-between text-xs text-neutral-500">
                      <div className="flex items-center space-x-1 font-mono text-neutral-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setSelectedCourseDetails(course)}
                          className="px-2.5 py-1.5 text-neutral-600 dark:text-neutral-300 hover:text-purple-600 dark:hover:text-[#A855F7] font-semibold text-[11px] rounded transition-all cursor-pointer"
                        >
                          Syllabus
                        </button>
                        <button
                          onClick={() => onSelectCourse(course.title)}
                          className="px-4 py-1.5 text-[11px] font-bold text-white bg-[#6F2DA8]/80 dark:bg-[#4C1D95]/40 backdrop-blur-md rounded-lg hover:bg-[#6F2DA8] hover:shadow-[0_0_15px_rgba(111,45,168,0.3)] transition-all cursor-pointer"
                        >
                          Enroll
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search Result feedback */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-purple-50 dark:border-neutral-850 rounded-2xl mt-6">
            <Sparkle className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto animate-spin" />
            <h3 className="text-base font-bold text-neutral-850 dark:text-white mt-4">
              Acapulco of courses remains undiscovered!
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Try modifying your keyword filter search standard.
            </p>
          </div>
        )}

      </div>

      {/* Course Detail Syllabus Modal Drawer */}
      <AnimatePresence>
        {selectedCourseDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourseDetails(null)}
              className="absolute inset-0 bg-neutral-950/65 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white/90 dark:bg-[#0a0a0c]/85 backdrop-blur-2xl rounded-3xl border border-purple-150/30 dark:border-white/10 overflow-hidden shadow-2xl z-10 p-6 sm:p-8"
            >
              {/* Closing trigger */}
              <button
                onClick={() => setSelectedCourseDetails(null)}
                className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 text-purple-700 dark:text-[#A855F7] mb-4">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider">
                  Course syllabus detail documentation
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white pr-4">
                {selectedCourseDetails.title}
              </h3>

              <p className="text-[11px] font-semibold text-neutral-400 mt-1 uppercase font-mono bg-neutral-100 dark:bg-neutral-850 inline-block px-2.5 py-1 rounded">
                Track: {selectedCourseDetails.category}
              </p>

              <div className="mt-6 space-y-4">
                <div>
                   <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-2">
                    Core Focus Objectives
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-purple-100/25 dark:border-white/10">
                    {selectedCourseDetails.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-neutral-150 dark:border-neutral-800 rounded-xl">
                    <p className="text-[10px] font-mono font-semibold text-neutral-400 uppercase">Duration</p>
                    <p className="font-mono text-sm font-bold text-neutral-900 dark:text-white mt-1">
                      {selectedCourseDetails.duration}
                    </p>
                  </div>
                  <div className="p-3 border border-neutral-150 dark:border-neutral-800 rounded-xl">
                    <p className="text-[10px] font-mono font-semibold text-neutral-400 uppercase">Prerequisites</p>
                    <p className="font-mono text-sm font-bold text-[#6F2DA8] dark:text-[#A855F7] mt-1">
                      None (Tier 1 Start)
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850">
                  <button
                    onClick={() => {
                      onSelectCourse(selectedCourseDetails.title);
                      setSelectedCourseDetails(null);
                    }}
                    className="w-full inline-flex items-center justify-center py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] hover:opacity-90 shadow-lg cursor-pointer transition-all"
                  >
                    Select this course & Enroll Now 
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
