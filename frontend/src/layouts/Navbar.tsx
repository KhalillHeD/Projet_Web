import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Building2,
  User as UserIcon,
  LogOut,
  LogIn,
} from "lucide-react";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onNavigate: (path: string) => void;
  transparent?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  transparent = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    onNavigate("/");
  };

  const isTransparent = transparent && !isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isTransparent
        ? "bg-transparent"
        : "bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => onNavigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Building2 size={22} className="text-white" />
            </div>
            <span className={`text-2xl font-black tracking-tight ${isTransparent ? 'text-white' : 'text-slate-900'}`}>
              BizManager
            </span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-10">
            <button
              onClick={() => scrollToSection("services")}
              className={`${isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-blue-600'} transition-all duration-300 font-bold text-sm tracking-wide uppercase`}
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`${isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-blue-600'} transition-all duration-300 font-bold text-sm tracking-wide uppercase`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`${isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-blue-600'} transition-all duration-300 font-bold text-sm tracking-wide uppercase`}
            >
              Contact
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((v) => !v)}
                  className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-300 font-bold text-sm ${isTransparent
                      ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-white hover:shadow-lg hover:shadow-blue-500/10"
                    }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-[10px] text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-56 glass rounded-[2rem] p-3 shadow-2xl animate-fade-in z-50 border border-white/20">
                    <div className="px-4 py-3 mb-2 border-b border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigate("/profile");
                      }}
                      className="w-full text-left px-4 py-3 rounded-2xl hover:bg-blue-500 hover:text-white flex items-center gap-3 text-slate-600 font-bold text-sm transition-all group"
                    >
                      <UserIcon size={16} className="group-hover:text-white transition-colors" />
                      <span>View profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-2xl hover:bg-rose-500 hover:text-white flex items-center gap-3 text-rose-600 font-bold text-sm transition-all group"
                    >
                      <LogOut size={16} className="group-hover:text-white transition-colors" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => onNavigate("/login")}
                  className={`font-bold text-sm transition-all ${isTransparent ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-blue-600"
                    }`}
                >
                  Login
                </button>
                <Button
                  onClick={() => onNavigate(user ? "/businesses" : "/signup")}
                  variant="primary"
                  size="sm"
                  className="px-8 shadow-lg shadow-blue-500/20"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-up">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left px-4 py-2 text-[#0B1A33] hover:bg-gray-50 rounded-lg transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left px-4 py-2 text-[#0B1A33] hover:bg-gray-50 rounded-lg transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-4 py-2 text-[#0B1A33] hover:bg-gray-50 rounded-lg transition-colors"
            >
              Contact
            </button>

            {user ? (
              <>
                <Button
                  onClick={() => {
                    onNavigate("/profile");
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1"
                >
                  <UserIcon size={16} />
                  View profile
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1 text-red-600 border-red-200"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    onNavigate("/login");
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1"
                >
                  <LogIn size={16} />
                  Login
                </Button>
                <Button
                  onClick={() => {
                    onNavigate("/businesses");
                    setIsMenuOpen(false);
                  }}
                  variant="primary"
                  size="sm"
                  className="w-full"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
