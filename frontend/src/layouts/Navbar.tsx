import React, { useState } from "react";
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
  const { user, logout } = useAuth();

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-sm shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#1A6AFF] to-[#3E8BFF] rounded-xl flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-[#0B1A33]">
              BizManager
            </span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-[#0B1A33] hover:text-[#1A6AFF] transition-colors duration-200 font-medium"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-[#0B1A33] hover:text-[#1A6AFF] transition-colors duration-200 font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-[#0B1A33] hover:text-[#1A6AFF] transition-colors duration-200 font-medium"
            >
              Contact
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-800 transition-colors"
                >
                  <UserIcon size={18} />
                  <span>{user.username}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 text-sm z-50">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigate("/profile");
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <UserIcon size={16} />
                      <span>View profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  onClick={() => onNavigate("/login")}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <LogIn size={16} />
                  Login
                </Button>
                <Button
                  onClick={() => onNavigate("/businesses")}
                  variant="primary"
                  size="sm"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
