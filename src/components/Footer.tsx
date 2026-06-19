import React from 'react';
import { GraduationCap, ArrowRight, HeartHandshake, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onScrollTo: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export default function Footer({ onScrollTo, onOpenAdmin }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onScrollTo(id);
  };

  return (
    <footer id="global-navigation-footer" className="bg-neutral-950/80 backdrop-blur-md text-neutral-450 pt-20 pb-10 border-t border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Column 1: Core Branding */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={(e) => handleLinkClick(e, 'home')}>
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#6F2DA8] to-[#4C1D95] rounded-xl shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white mb-0">
                  TEXTO<span className="text-[#A855F7]">CODE</span>
                </span>
                <p className="text-[9px] uppercase font-mono tracking-widest text-[#A855F7] -mt-1 font-semibold">
                  Academy
                </p>
              </div>
            </div>
            
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Helping students, professionals, and aspiring tech talents learn Artificial Intelligence, Cloud Computing, Software Development, Data Analytics, and DevOps through practical project-based training.
            </p>

            <div className="flex items-center space-x-2 text-[10px] font-mono bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg w-fit text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
              <span>TEXTOCODE_SYSTEMS_OPERATIONAL</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Quick Menu
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Home', id: 'home' },
                { label: 'About Us', id: 'about' },
                { label: 'Courses Catalog', id: 'courses' },
                { label: 'Our Edge', id: 'why-choose' },
                { label: 'Admissions Portal', id: 'register' },
                { label: 'Testimonials', id: 'testimonials' },
                { label: 'Terms & FAQs', id: 'faq' },
              ].map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className="hover:text-[#A855F7] transition-all text-neutral-400 flex items-center group text-xs text-neutral-400 py-1"
                  >
                    <ArrowRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#A855F7]" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Hot Courses */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Popular Tracks
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                'Generative AI Fundamentals',
                'AI Agent Development',
                'AWS Solutions Architect',
                'Azure Cloud Security',
                'Full Stack Web Development',
                'Data Science with Python',
                'Kubernetes & Docker Orchestration'
              ].map((track) => (
                <li key={track}>
                  <a
                    href="#courses"
                    onClick={(e) => handleLinkClick(e, 'courses')}
                    className="hover:text-purple-400 transition-colors text-xs text-neutral-400 block py-1"
                  >
                    • {track}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Location coordinates */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Academic Lab Address
            </h4>
            <address className="not-italic space-y-2.5 text-xs text-neutral-400 leading-relaxed">
              <p>
                <span className="block font-bold text-neutral-300">Yaba Learning Lab:</span>
                72 Herbert Macaulay Way, Yaba, Lagos State, Nigeria.
              </p>
              <p>
                <span className="block font-bold text-neutral-300">Active Inquiries:</span>
                admissions@textocode.com
              </p>
              <p>
                <span className="block font-bold text-neutral-300">Contact Switch:</span>
                +234 (0) 809-770-8800
              </p>
            </address>
          </div>

        </div>

        {/* Separator Line */}
        <div className="h-px bg-white/5 my-12" />

        {/* Brand Copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-mono gap-4">
          <p>© {currentYear} Textocode Academy Systems. All global rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="#register" onClick={(e) => handleLinkClick(e, 'register')} className="hover:text-white transition-colors">
              Candidate Pass Guide
            </a>
            <span>|</span>
            <a href="#faq" onClick={(e) => handleLinkClick(e, 'faq')} className="hover:text-white transition-colors">
              Admissions Logistics
            </a>
            <span>|</span>
            <button 
              id="admin-login-footer-trigger"
              onClick={onOpenAdmin} 
              className="flex items-center space-x-1.5 px-2 py-1 text-[#A855F7] hover:text-[#c084fc] font-bold border border-[#A855F7]/10 hover:border-[#A855F7]/30 bg-[#A855F7]/5 rounded-lg transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Area</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
