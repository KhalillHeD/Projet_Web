import React, { useState } from 'react';
import { Menu, X, Building2 } from 'lucide-react';
import { Button } from '../components/Button';

interface NavbarProps {
  onNavigate: (path: string) => void;
  transparent?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-sm shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#1A6AFF] to-[#3E8BFF] rounded-xl flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-[#0B1A33]">BizManager</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('services')} className="text-[#0B1A33] hover:text-[#1A6AFF] transition-colors duration-200 font-medium">
              Services
            </button>
            <button onClick={() => scrollToSection('about')} className="text-[#0B1A33] hover:text-[#1A6AFF] transition-colors duration-200 font-medium">
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-[#0B1A33] hover:text-[#1A6AFF] transition-colors duration-200 font-medium">
              Contact
            </button>
            <Button onClick={() => onNavigate('/login')} variant="outline" size="sm">
              Login
            </Button>
            <Button onClick={() => onNavigate('/businesses')} variant="primary" size="sm">
              Get Started
            </Button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-up">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => scrollToSection('services')} className="block w-full text-left px-4 py-2 text-[#0B1A33] hover:bg-gray-50 rounded-lg transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left px-4 py-2 text-[#0B1A33] hover:bg-gray-50 rounded-lg transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-4 py-2 text-[#0B1A33] hover:bg-gray-50 rounded-lg transition-colors">
              Contact
            </button>
            <Button onClick={() => onNavigate('/login')} variant="outline" size="sm" className="w-full">
              Login
            </Button>
            <Button onClick={() => onNavigate('/businesses')} variant="primary" size="sm" className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
