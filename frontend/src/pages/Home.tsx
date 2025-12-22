import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  TrendingUp,
  FileText,
  Package,
  BarChart3,
  Shield,
  Zap,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { useAuth } from "../context/AuthContext";

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsPageLoaded(true);

    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert(result.error || "Failed to send message");
      }
    } catch (err) {
      alert("Error sending message");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const FloatingElement = ({ delay, duration, children, className }: any) => (
    <div
      className={`absolute ${className}`}
      style={{
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      {children}
    </div>
  );

  const Particle = ({
    x,
    y,
    size,
    delay,
  }: {
    x: number;
    y: number;
    size: number;
    delay: number;
  }) => (
    <div
      className="absolute rounded-full bg-gradient-to-r from-purple-400 to-blue-500 opacity-60"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `particle-float 8s ease-in-out ${delay}s infinite`,
      }}
    />
  );

  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 8,
  }));

  return (
    <div
      ref={containerRef}
      className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative"
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(26, 106, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(26, 106, 255, 0.6); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes glow-pulse {
          0%, 100% { text-shadow: 0 0 10px rgba(26, 106, 255, 0.5); }
          50% { text-shadow: 0 0 20px rgba(26, 106, 255, 0.8); }
        }

        @keyframes blob-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes floating-arrow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }

        @keyframes card-hover-border {
          0%, 100% { box-shadow: 0 0 20px rgba(26, 106, 255, 0.3); }
          50% { box-shadow: 0 0 30px rgba(22, 196, 127, 0.3); }
        }

        @keyframes mouse-glow {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes expand-glow {
          0% {
            width: 20px;
            height: 20px;
            opacity: 0.8;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }

        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) translateX(10px) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-40px) translateX(-10px) scale(0.9);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-20px) translateX(5px) scale(1.05);
            opacity: 0.7;
          }
        }

        @keyframes ripple-effect {
          0% {
            box-shadow: 0 0 0 0 rgba(26, 106, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 30px rgba(26, 106, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(26, 106, 255, 0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob-rotate 20s linear infinite;
        }

        .animate-text-shimmer {
          background: linear-gradient(90deg, #0B1A33, #1A6AFF, #0B1A33);
          background-size: 200% center;
          animation: text-shimmer 3s ease infinite;
        }

        .animate-floating-arrow {
          animation: floating-arrow 3s ease-in-out infinite;
        }

        .animate-card-border {
          animation: card-hover-border 3s ease-in-out infinite;
        }

        .mouse-glow-circle {
          position: fixed;
          pointer-events: none;
          z-index: 1;
          animation: expand-glow 0.6s ease-out forwards;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(26, 106, 255, 0.6) 0%, rgba(26, 106, 255, 0.3) 50%, transparent 70%);
        }

        .mouse-cursor {
          position: fixed;
          width: 20px;
          height: 20px;
          border: 2px solid #1A6AFF;
          border-radius: 50%;
          pointer-events: none;
          z-index: 999;
          transform: translate(-50%, -50%);
          opacity: 0.6;
          box-shadow: 0 0 10px rgba(26, 106, 255, 0.5), inset 0 0 10px rgba(26, 106, 255, 0.3);
          transition: opacity 0.2s;
        }

        .mouse-cursor::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: #1A6AFF;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(0.7); }
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }
        
        .parallax-slow {
          transform: translateY(${scrollY * 0.5}px);
        }
        
        .parallax-fast {
          transform: translateY(${scrollY * -0.3}px);
        }

        .gradient-text-animated {
          background: linear-gradient(90deg, #1A6AFF, #3E8BFF, #16C47F, #1A6AFF);
          background-size: 300% 300%;
          animation: gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .feature-card-gradient {
          position: relative;
          overflow: hidden;
        }

        .feature-card-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .feature-card-gradient:hover::before {
          left: 100%;
        }

        .blob-shape {
          filter: blur(40px);
          will-change: transform;
        }

        section {
          clear: both;
          width: 100%;
        }

        .text-center {
          display: block;
          clear: both;
        }
      `}</style>

      {isPageLoaded && (
        <>
          <div
            className="mouse-cursor"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
            }}
          ></div>
        </>
      )}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingElement delay={0} duration={6} className="top-20 left-10 opacity-30">
          <div className="w-32 h-32 bg-gradient-to-br from-[#1A6AFF] to-[#3E8BFF] rounded-full blur-3xl blob-shape animate-blob"></div>
        </FloatingElement>
        <FloatingElement delay={2} duration={8} className="top-40 right-20 opacity-30">
          <div
            className="w-48 h-48 bg-gradient-to-br from-[#16C47F] to-[#13ad70] rounded-full blur-3xl blob-shape animate-blob"
            style={{ animationDirection: "reverse" }}
          ></div>
        </FloatingElement>
        <FloatingElement delay={4} duration={7} className="bottom-40 left-1/4 opacity-30">
          <div className="w-40 h-40 bg-gradient-to-br from-[#FFA726] to-[#f59518] rounded-full blur-3xl blob-shape animate-blob"></div>
        </FloatingElement>

        <div
          className="pointer-events-none"
          style={{
            position: "fixed",
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            width: "100px",
            height: "100px",
            background:
              "radial-gradient(circle, rgba(26, 106, 255, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(30px)",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            opacity: 0.5,
          }}
        ></div>

        {particles.map((particle) => (
          <Particle
            key={particle.id}
            x={particle.x}
            y={particle.y}
            size={particle.size}
            delay={particle.delay}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A6AFF]/10 via-[#3E8BFF]/5 to-transparent animate-gradient"></div>

        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(#1A6AFF 1px, transparent 1px), linear-gradient(90deg, #1A6AFF 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center block w-full clear-both">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#1A6AFF]/20 mb-6 ${
                isPageLoaded ? "animate-scale-in" : "opacity-0"
              } hover:shadow-lg hover:shadow-[#1A6AFF]/20 transition-all duration-300`}
            >
              <Sparkles
                size={16}
                className="text-[#1A6AFF] animate-spin"
                style={{ animationDuration: "3s" }}
              />
              <span className="text-sm font-semibold text-[#1A6AFF]">
                Trusted by 10,000+ businesses
              </span>
              <Star
                size={16}
                className="text-[#FFA726] fill-[#FFA726] animate-bounce"
                style={{ animationDuration: "2s" }}
              />
            </div>

            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-bold text-[#0B1A33] mb-6 ${
                isPageLoaded ? "animate-fade-in" : "opacity-0"
              }`}
            >
              Manage Your Business
              <br />
              <span className="gradient-text-animated block mt-3">
                Effortlessly
              </span>
            </h1>

            <p
              className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto block ${
                isPageLoaded ? "animate-fade-in stagger-1" : "opacity-0"
              }`}
            >
              BizManager is your all-in-one solution for streamlined business
              operations. Track transactions, manage inventory, generate invoices,
              and gain insights with powerful analytics.
            </p>

            {/* AUTH-AWARE BUTTONS */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${
                isPageLoaded ? "animate-fade-in stagger-2" : "opacity-0"
              } block w-full clear-both`}
            >
              <Button
                onClick={() => onNavigate(user ? "/businesses" : "/signup")}
                variant="primary"
                size="lg"
                icon={<ArrowRight size={20} className="animate-floating-arrow" />}
                className="hover-lift shadow-lg shadow-[#1A6AFF]/30"
              >
                {user ? "Go to your dashboard" : "Get Started Free"}
              </Button>

              {!user && (
                <Button
                  onClick={() => onNavigate("/login")}
                  variant="outline"
                  size="lg"
                  className="hover-lift"
                >
                  Login
                </Button>
              )}
            </div>

            <div
              className={`mt-16 ${
                isPageLoaded ? "animate-fade-in stagger-3" : "opacity-0"
              } block w-full`}
            >
              <div className="inline-flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity group">
                <span className="text-sm text-gray-600 group-hover:text-[#1A6AFF] transition-colors">
                  Scroll to explore
                </span>
                <ChevronDown
                  size={24}
                  className="text-[#1A6AFF]"
                  style={{ animation: "bounce-slow 2s infinite" }}
                />
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 block w-full clear-both">
            {[
              {
                icon: TrendingUp,
                title: "Real-time Analytics",
                desc: "Track your business performance with live data and insights",
                gradient: "from-[#1A6AFF] to-[#3E8BFF]",
                delay: "stagger-3",
              },
              {
                icon: FileText,
                title: "Smart Invoicing",
                desc: "Generate and manage professional invoices in seconds",
                gradient: "from-[#16C47F] to-[#13ad70]",
                delay: "stagger-4",
              },
              {
                icon: Package,
                title: "Inventory Control",
                desc: "Keep track of stock levels with automated alerts",
                gradient: "from-[#FFA726] to-[#f59518]",
                delay: "stagger-5",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${
                  isPageLoaded ? "animate-scale-in" : "opacity-0"
                } ${item.delay}`}
              >
                <Card className="text-center hover-lift group relative overflow-hidden feature-card-gradient shadow-lg hover:shadow-xl hover:shadow-[#1A6AFF]/20 transition-all duration-300">
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(to bottom right, var(--tw-gradient-stops))",
                    }}
                  ></div>

                  <div
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    style={{ animation: "pulse-glow 2s infinite" }}
                  >
                    <item.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1A33] mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#1A6AFF] group-hover:to-[#3E8BFF] group-hover:bg-clip-text transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="services"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10 block w-full clear-both"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 parallax-slow block w-full clear-both">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-[#1A6AFF]/10 to-[#3E8BFF]/10 rounded-full hover:shadow-lg hover:shadow-[#1A6AFF]/20 transition-all duration-300">
              <span className="text-[#1A6AFF] font-semibold">Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-4 hover:gradient-text-animated transition-all cursor-default block">
              Powerful Features for Modern Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto block">
              Everything you need to run your business efficiently in one
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 block w-full clear-both">
            {[
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description:
                  "Visualize your data with beautiful charts and comprehensive reports",
                color: "from-[#1A6AFF] to-[#3E8BFF]",
              },
              {
                icon: FileText,
                title: "Invoice Management",
                description:
                  "Create, send, and track invoices with automated payment reminders",
                color: "from-[#16C47F] to-[#13ad70]",
              },
              {
                icon: Package,
                title: "Stock Management",
                description:
                  "Monitor inventory levels and receive alerts for low stock items",
                color: "from-[#FFA726] to-[#f59518]",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description:
                  "Bank-level security to protect your sensitive business data",
                color: "from-[#EF5350] to-[#e53935]",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Optimized performance for seamless user experience",
                color: "from-[#1A6AFF] to-[#3E8BFF]",
              },
              {
                icon: TrendingUp,
                title: "Growth Insights",
                description:
                  "Make data-driven decisions with predictive analytics",
                color: "from-[#16C47F] to-[#13ad70]",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`${
                  isPageLoaded ? "opacity-100 animate-scale-in" : "opacity-0"
                } hover-lift`}
                style={{
                  animationDelay: `${isPageLoaded ? index * 0.1 : 0}s`,
                  animationFillMode: "forwards",
                }}
              >
                <Card className="group h-full relative overflow-hidden feature-card-gradient shadow-lg hover:shadow-xl hover:shadow-[#1A6AFF]/20 transition-all duration-300 animate-card-border">
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[2px] rounded-2xl">
                    <div className="w-full h-full bg-white rounded-2xl"></div>
                  </div>

                  <div className="relative">
                    <div
                      className={`w-14 h-14 mb-4 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}
                    >
                      <feature.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-[#0B1A33] mb-2 group-hover:text-[#1A6AFF] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white relative z-10 block w-full clear-both"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center block w-full clear-both">
            <div className={`${isPageLoaded ? "animate-slide-in-left" : "opacity-0"}`}>
              <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-[#1A6AFF]/10 to-[#3E8BFF]/10 rounded-full">
                <span className="text-[#1A6AFF] font-semibold">About Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-6 block">
                Built for Growth, Designed for Success
              </h2>
              <p className="text-lg text-gray-600 mb-6 block">
                BizManager was created by business owners, for business owners. We
                understand the challenges of managing multiple aspects of your
                business, which is why we've built an intuitive platform that
                brings everything together.
              </p>
              <p className="text-lg text-gray-600 mb-8 block">
                Whether you're a startup or an established enterprise, our
                scalable solution adapts to your needs, helping you focus on what
                matters most: growing your business.
              </p>
              <Button
                onClick={() => onNavigate("/businesses")}
                variant="primary"
                size="lg"
                icon={<ArrowRight size={20} className="animate-floating-arrow" />}
                className="hover-lift shadow-lg shadow-[#1A6AFF]/30"
              >
                Start Your Journey
              </Button>
            </div>

            <div
              className={`grid grid-cols-2 gap-6 ${
                isPageLoaded ? "animate-slide-in-right" : "opacity-0"
              } block w-full clear-both`}
            >
              {[
                {
                  value: "10K+",
                  label: "Active Users",
                  color: "from-[#1A6AFF] to-[#3E8BFF]",
                  delay: "stagger-1",
                },
                {
                  value: "99.9%",
                  label: "Uptime",
                  color: "from-[#16C47F] to-[#13ad70]",
                  delay: "stagger-2",
                },
                {
                  value: "500K+",
                  label: "Transactions",
                  color: "from-[#FFA726] to-[#f59518]",
                  delay: "stagger-3",
                },
                {
                  value: "24/7",
                  label: "Support",
                  color: "from-[#EF5350] to-[#e53935]",
                  delay: "stagger-4",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`${isPageLoaded ? "animate-scale-in" : "opacity-0"} ${
                    stat.delay
                  }`}
                >
                  <Card className="text-center hover-lift group relative overflow-hidden feature-card-gradient shadow-lg hover:shadow-xl hover:shadow-[#1A6AFF]/20 transition-all duration-300">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    ></div>
                    <div
                      className={`text-4xl font-bold bg-gradient-to-br ${stat.color} text-transparent bg-clip-text mb-2 transform group-hover:scale-110 transition-transform`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-gray-600 group-hover:text-gray-800 transition-colors">
                      {stat.label}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10 block w-full clear-both"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 block w-full clear-both">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-[#1A6AFF]/10 to-[#3E8BFF]/10 rounded-full hover:shadow-lg hover:shadow-[#1A6AFF]/20 transition-all duration-300">
              <span className="text-[#1A6AFF] font-semibold">Contact</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-4 block">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto block">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 block w-full clear-both">
            <div className="space-y-8">
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  lines: ["info@bizmanager.com", "support@bizmanager.com"],
                  color: "from-[#1A6AFF] to-[#3E8BFF]",
                  delay: "stagger-1",
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  lines: ["+216 26 805 311", "Mon-Fri 9am-6pm EST"],
                  color: "from-[#16C47F] to-[#13ad70]",
                  delay: "stagger-2",
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  lines: ["Technopole Ghazella", "Ariana, Tunisia"],
                  color: "from-[#FFA726] to-[#f59518]",
                  delay: "stagger-3",
                },
              ].map((contact, idx) => (
                <div
                  key={idx}
                  className={`${
                    isPageLoaded ? "animate-slide-in-left" : "opacity-0"
                  } ${contact.delay}`}
                >
                  <Card className="flex items-start gap-4 hover-lift group feature-card-gradient shadow-lg hover:shadow-xl hover:shadow-[#1A6AFF]/20 transition-all duration-300">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${contact.color} rounded-xl flex items-center justify-center flex-shrink-0 transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}
                    >
                      <contact.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1A33] mb-1">
                        {contact.title}
                      </h3>
                      {contact.lines.map((line, i) => (
                        <p key={i} className="text-gray-600">
                          {line}
                        </p>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <div
              className={`${
                isPageLoaded ? "animate-slide-in-right stagger-4" : "opacity-0"
              } block w-full clear-both`}
            >
              <Card className="hover-lift shadow-lg feature-card-gradient">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="group">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none transition-all group-hover:border-gray-300 focus:shadow-lg focus:shadow-[#1A6AFF]/20"
                    />
                  </div>
                  <div className="group">
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none transition-all group-hover:border-gray-300 focus:shadow-lg focus:shadow-[#1A6AFF]/20"
                    />
                  </div>
                  <div className="group">
                    <textarea
                      rows={5}
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none transition-all resize-none group-hover:border-gray-300 focus:shadow-lg focus:shadow-[#1A6AFF]/20"
                    ></textarea>
                  </div>
                  {success && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl animate-scale-in shadow-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-green-600 font-semibold">
                        Message sent successfully!
                      </p>
                    </div>
                  )}
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full hover-lift relative overflow-hidden group shadow-lg shadow-[#1A6AFF]/30"
                    disabled={loading}
                  >
                    <span className="relative z-10">
                      {loading ? "Sending..." : "Send Message"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1A6AFF] to-[#3E8BFF] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 block w-full clear-both">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A6AFF] to-[#3E8BFF] animate-gradient"></div>

        <div className="absolute inset-0 opacity-20">
          <FloatingElement delay={0} duration={8} className="top-10 left-10">
            <div className="w-20 h-20 border-4 border-white rounded-full animate-blob"></div>
          </FloatingElement>
          <FloatingElement delay={2} duration={10} className="top-20 right-20">
            <div
              className="w-16 h-16 border-4 border-white rounded-lg transform rotate-45 animate-blob"
              style={{ animationDirection: "reverse" }}
            ></div>
          </FloatingElement>
          <FloatingElement delay={4} duration={9} className="bottom-10 left-1/3">
            <div className="w-12 h-12 bg-white rounded-full animate-blob"></div>
          </FloatingElement>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className={isPageLoaded ? "animate-scale-in" : "opacity-0"}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-glow-pulse block">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8 block">
              Join thousands of businesses already using BizManager
            </p>
            <Button
              onClick={() => onNavigate("/businesses")}
              variant="outline"
              size="lg"
              className="bg-white text-[#1A6AFF] hover:bg-gray-50 hover-lift shadow-xl"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
