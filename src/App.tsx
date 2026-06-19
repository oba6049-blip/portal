/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Courses from './components/Courses';
import WhyChooseUs from './components/WhyChooseUs';
import Portal from './components/Portal';
import Journey from './components/Journey';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import WhatsAppButton from './components/WhatsAppButton';
import AdminDashboardModal from './components/AdminDashboardModal';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default to a premium high-contrast dark theme reflecting logo
  const [preselectedCourse, setPreselectedCourse] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);

  // Synchronize dark theme selection with DOM class lists for Tailwind dark: prefixes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Smooth scroll handler targeting anchors cleanly
  const handleScrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Triggered when student selects a course card to pre-populate Step 4
  const handleCourseEnrollmentSelection = (courseTitle: string) => {
    setPreselectedCourse(courseTitle);
    handleScrollToSection('register');
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#0a0a0c] text-neutral-800 dark:text-[#f8fafc] font-sans transition-colors duration-200 selection:bg-purple-500/30 selection:text-[#6F2DA8] dark:selection:text-[#A855F7] overflow-x-hidden">
      
      {/* Ambient micro-glow background structures for high-end Frosted Glass aesthetic */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] bg-[#6F2DA8]/10 dark:bg-[#6F2DA8]/20 rounded-full blur-[120px]" />
        <div className="absolute top-[25%] right-[-10%] w-[650px] h-[650px] bg-[#4C1D95]/12 dark:bg-[#4C1D95]/25 rounded-full blur-[150px]" />
        <div className="absolute top-[55%] left-[-8%] w-[550px] h-[550px] bg-indigo-500/8 dark:bg-purple-900/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-5%] right-[-10%] w-[700px] h-[700px] bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30 rounded-full blur-[150px]" />
        <div className="absolute inset-0 opacity-5 dark:opacity-10 glass-grid" />
      </div>

      <div className="relative z-10 font-sans">
        {/* 1. Header Navigation Bar */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onScrollTo={handleScrollToSection}
        />

        {/* 2. Hero Section */}
        <Hero onScrollTo={handleScrollToSection} />

        {/* 3. About Us Section */}
        <About />

        {/* 4. Filterable Courses Catalog */}
        <Courses onSelectCourse={handleCourseEnrollmentSelection} />

        {/* 5. Why Choose Us (Edge parameters) */}
        <WhyChooseUs />

        {/* 6. Multi-step Student Registration Portal */}
        <Portal
          preselectedCourse={preselectedCourse}
          clearPreselection={() => setPreselectedCourse(null)}
        />

        {/* 7. Curriculum Roadmap timeline */}
        <Journey />

        {/* 8. Success Testimonials slide carousel */}
        <Reviews />

        {/* 9. Dynamic FAQs Accordions */}
        <FAQ />

        {/* 10. Direct Contact Coord Channels & Map marker */}
        <Contact />

        {/* 11. Footer links maps & credit index */}
        <Footer onScrollTo={handleScrollToSection} onOpenAdmin={() => setAdminOpen(true)} />

        {/* 12. Float Rebound Action Widget */}
        <BackToTop />

        {/* 13. Dynamic WhatsApp Helpline channel */}
        <WhatsAppButton />

        {/* 14. Powerful Admin Dashboard Center */}
        <AdminDashboardModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
      </div>

    </div>
  );
}
