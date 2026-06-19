import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, GraduationCap, ChevronRight, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthContext';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onScrollTo: (sectionId: string) => void;
}

export default function Header({ darkMode, setDarkMode, onScrollTo }: HeaderProps) {
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Courses', id: 'courses' },
    { label: 'Why Choose Us', id: 'why-choose' },
    { label: 'Registration', id: 'register' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    onScrollTo(id);
  };

  return (
    <header
      id="main-nav-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/40 dark:bg-black/30 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 py-3 border-b border-purple-200/20 dark:border-white/10'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <div
            id="brand-logo-container"
            onClick={() => handleLinkClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#6F2DA8] to-[#4C1D95] rounded-xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
              {/* Logo icon inside purple gradient */}
              <GraduationCap className="w-6 h-6 text-white" />
              {/* Logo circuit decoration dots */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#A855F7] rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#A855F7] rounded-full" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white transition-colors">
                TEXTO<span className="text-[#6F2DA8] dark:text-[#A855F7]">CODE</span>
              </span>
              <p className="text-[9px] uppercase font-mono tracking-widest text-[#6F2DA8] dark:text-[#A855F7] -mt-1 font-semibold">
                Academy
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav-menu" className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-all text-neutral-600 hover:text-[#6F2DA8] dark:text-neutral-300 dark:hover:text-[#A855F7] hover:bg-purple-50/50 dark:hover:bg-neutral-800/50"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Row */}
          <div id="nav-action-row" className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 backdrop-blur-md border border-purple-100/40 dark:border-white/10 text-neutral-600 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/10 transition-all transform hover:scale-105"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-purple-700" />}
            </button>

            {/* CTA Enroll Now */}
            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleLinkClick('register')}
                  className="px-4 py-2 text-xs font-bold text-[#6F2DA8] dark:text-[#A855F7] hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-[#6F2DA8]/10 dark:bg-[#A855F7]/10 border border-purple-150/15 rounded-xl transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={logoutUser}
                  className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-purple-100/40 dark:border-white/10 text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-cta-enroll"
                onClick={() => handleLinkClick('register')}
                className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] rounded-xl shadow-[0_0_20px_rgba(111,45,168,0.4)] hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all group overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center">
                  Enroll Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            )}
          </div>

          {/* Mobile Right Action Bar */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Theme Toggle */}
            <button
              id="mobile-theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-all"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-purple-700" />}
            </button>

            {/* Mobile Menu Icon */}
            <button
              id="mobile-menu-burger"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white dark:bg-neutral-900 border-b border-purple-100 dark:border-neutral-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className="block w-full text-left px-4 py-3 text-base font-medium rounded-xl text-neutral-700 hover:text-purple-700 hover:bg-purple-50 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition-all"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 border-t border-neutral-150 dark:border-neutral-800 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleLinkClick('register')}
                      className="w-full inline-flex items-center justify-center px-5 py-3 text-base font-semibold text-white bg-[#6F2DA8] rounded-xl shadow-md"
                    >
                      My Dashboard
                    </button>
                    <button
                      onClick={() => { logoutUser(); setIsOpen(false); }}
                      className="w-full inline-flex items-center justify-center px-5 py-3 text-base font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Log Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleLinkClick('register')}
                    className="w-full inline-flex items-center justify-center px-5 py-3 text-base font-semibold text-white bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] rounded-xl shadow-md hover:shadow-lg"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
