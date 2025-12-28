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
  Sparkles,
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
        animation: `particle-float 5000s ease-in-out ${delay}s infinite`,
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
            opacity: 0.5;
          }
          25% {
            transform: translateY(-6px) translateX(3px) scale(1.02);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-12px) translateX(-3px) scale(0.98);
            opacity: 0.45;
          }
          75% {
            transform: translateY(-6px) translateX(2px) scale(1.01);
            opacity: 0.55;
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
          animation: expand-glow 10s ease-out forwards;
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
          <div className="w-32 h-32 bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-full blur-3xl blob-shape animate-blob"></div>
        </FloatingElement>
        <FloatingElement delay={2} duration={8} className="top-40 right-20 opacity-30">
          <div
            className="w-48 h-48 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-full blur-3xl blob-shape animate-blob"
            style={{ animationDirection: "reverse" }}
          ></div>
        </FloatingElement>
        <FloatingElement delay={4} duration={7} className="bottom-40 left-1/4 opacity-30">
          <div className="w-40 h-40 bg-gradient-to-tr from-orange-400 to-amber-600 rounded-full blur-3xl blob-shape animate-blob"></div>
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
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center block w-full clear-both">
            <div
              className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 ${isPageLoaded ? "animate-scale-in" : "opacity-0"
                }`}
            >
              <Sparkles
                size={16}
                className="text-blue-400 animate-pulse"
              />
              <span className="text-sm font-bold text-blue-100 tracking-wide uppercase">
                Trusted by 10,000+ businesses
              </span>
            </div>

            <h1
              className={`text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight ${isPageLoaded ? "animate-fade-in" : "opacity-0"
                }`}
            >
              Manage Your Business
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 animate-gradient block mt-2">
                Effortlessly.
              </span>
            </h1>

            <p
              className={`text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light ${isPageLoaded ? "animate-fade-in stagger-1" : "opacity-0"
                }`}
            >
              BizManager is the next-generation platform for streamlined operations.
              Track revenue, manage stock, and grow your empire with data-driven insights.
            </p>

            {/* AUTH-AWARE BUTTONS */}
            <div
              className={`flex flex-col sm:flex-row gap-6 justify-center items-center ${isPageLoaded ? "animate-fade-in stagger-2" : "opacity-0"
                }`}
            >
              <Button
                onClick={() => onNavigate(user ? "/businesses" : "/signup")}
                variant="primary"
                size="lg"
                className="px-12 py-5 text-lg"
              >
                {user ? "Go to your dashboard" : "Get Started Now"}
                <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              {!user && (
                <Button
                  onClick={() => onNavigate("/login")}
                  variant="outline"
                  size="lg"
                  className="px-12 py-5 text-lg text-white border-white/20 hover:bg-white/10"
                >
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 block w-full clear-both">
            {[
              {
                icon: TrendingUp,
                title: "Real-time Analytics",
                desc: "Track your performance with high-fidelity live data",
                gradient: "from-blue-600 to-indigo-600",
                delay: "stagger-3",
              },
              {
                icon: FileText,
                title: "Smart Invoicing",
                desc: "Generate professional invoices in under 60 seconds",
                gradient: "from-emerald-500 to-teal-600",
                delay: "stagger-4",
              },
              {
                icon: Package,
                title: "Inventory Control",
                desc: "Automated stock alerts and predictive restocking",
                gradient: "from-orange-400 to-amber-500",
                delay: "stagger-5",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${isPageLoaded ? "animate-scale-in" : "opacity-0"
                  } ${item.delay}`}
              >
                <div className="glass rounded-[2.5rem] p-10 hover:bg-white/10 transition-all duration-500 group border border-white/10">
                  <div
                    className={`w-20 h-20 mb-6 bg-gradient-to-tr ${item.gradient} rounded-3xl flex items-center justify-center text-white shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <item.icon size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="services"
        className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-white/5 relative z-10 block w-full clear-both"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 block w-full clear-both">
            <div className="inline-block mb-6 px-5 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
              <span className="text-blue-400 font-bold text-sm tracking-widest uppercase">The Power of BizManager</span>
            </div>
            <h2 className="text-5xl font-black text-white mb-6 block">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto block leading-relaxed">
              We've engineered the most intuitive toolset for high-growth businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 block w-full clear-both">
            {[
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Visualize data with high-performance charts and predictive modeling.",
                color: "from-blue-600 to-indigo-600",
              },
              {
                icon: FileText,
                title: "Smart Invoices",
                description: "Automated billing and real-time payment tracking.",
                color: "from-emerald-500 to-teal-600",
              },
              {
                icon: Package,
                title: "Stock Intelligence",
                description: "Deep inventory tracking with smart replenishment alerts.",
                color: "from-orange-400 to-amber-500",
              },
              {
                icon: Shield,
                title: "Stealth Security",
                description: "Enterprise-grade encryption protecting your most sensitive assets.",
                color: "from-rose-500 to-red-600",
              },
              {
                icon: Zap,
                title: "Instant Sync",
                description: "Zero-latency synchronization across all your business locations.",
                color: "from-sky-500 to-blue-600",
              },
              {
                icon: TrendingUp,
                title: "Revenue Scaling",
                description: "Unlock growth patterns with AI-driven financial insights.",
                color: "from-teal-500 to-emerald-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`${isPageLoaded ? "opacity-100 animate-scale-in" : "opacity-0"
                  } group`}
                style={{
                  animationDelay: `${isPageLoaded ? index * 0.1 : 0}s`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="p-10 glass rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className={`w-16 h-16 mb-8 bg-gradient-to-tr ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 relative z-10 block w-full clear-both"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center block w-full clear-both">
            <div className={`${isPageLoaded ? "animate-slide-in-left" : "opacity-0"}`}>
              <div className="inline-block mb-6 px-5 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                <span className="text-blue-400 font-bold text-sm tracking-widest uppercase">Our Mission</span>
              </div>
              <h2 className="text-5xl font-black text-slate-900 mb-8 block leading-tight">
                Built for Growth,<br />Designed for Success
              </h2>
              <p className="text-xl text-slate-600 mb-8 block leading-relaxed font-medium">
                BizManager was born from a simple vision: to empower high-performance teams with military-grade business tools.
                We've spent thousands of hours perfecting every pixel and every line of code.
              </p>
              <Button
                onClick={() => onNavigate("/businesses")}
                variant="primary"
                size="lg"
                className="px-10"
              >
                Start Your Journey
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>

            <div
              className={`grid grid-cols-2 gap-8 ${isPageLoaded ? "animate-slide-in-right" : "opacity-0"
                } block w-full clear-both`}
            >
              {[
                {
                  value: "10K+",
                  label: "Active Users",
                  color: "from-blue-600 to-indigo-600",
                  delay: "stagger-1",
                },
                {
                  value: "99.9%",
                  label: "Uptime",
                  color: "from-emerald-500 to-teal-600",
                  delay: "stagger-2",
                },
                {
                  value: "500K+",
                  label: "Transactions",
                  color: "from-orange-400 to-amber-500",
                  delay: "stagger-3",
                },
                {
                  value: "24/7",
                  label: "Support",
                  color: "from-rose-500 to-red-600",
                  delay: "stagger-4",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`${isPageLoaded ? "animate-scale-in" : "opacity-0"} ${stat.delay}`}
                >
                  <div className="text-center p-10 premium-card h-full flex flex-col justify-center">
                    <div
                      className={`text-5xl font-black bg-gradient-to-tr ${stat.color} text-transparent bg-clip-text mb-3 transform group-hover:scale-110 transition-transform`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-slate-500 font-bold tracking-wide uppercase text-xs">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative z-10 block w-full clear-both"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 block w-full clear-both">
            <div className="inline-block mb-6 px-5 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
              <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Get in Touch</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-6 block">
              We'd Love to Hear From You
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto block leading-relaxed">
              Our team of experts is ready to help you optimize your business flow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 block w-full clear-both">
            <div className="space-y-10">
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  lines: ["info@bizmanager.com", "support@bizmanager.com"],
                  color: "from-blue-600 to-indigo-600",
                  delay: "stagger-1",
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  lines: ["+216 95 644 062", "Mon-Fri 9am-6pm EST"],
                  color: "from-emerald-500 to-teal-600",
                  delay: "stagger-2",
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  lines: ["Supcom Elghazela", "Ariana, Tunisia"],
                  color: "from-orange-400 to-amber-500",
                  delay: "stagger-3",
                },
              ].map((contact, idx) => (
                <div
                  key={idx}
                  className={`${isPageLoaded ? "animate-slide-in-left" : "opacity-0"} ${contact.delay}`}
                >
                  <div className="flex items-center gap-6 p-8 premium-card">
                    <div className={`w-16 h-16 bg-gradient-to-tr ${contact.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:rotate-12`}>
                      <contact.icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-1">
                        {contact.title}
                      </h3>
                      {contact.lines.map((line, i) => (
                        <p key={i} className="text-slate-500 font-medium">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`${isPageLoaded ? "animate-slide-in-right stagger-4" : "opacity-0"} block w-full clear-both`}
            >
              <Card className="p-10 premium-card">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="group">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-6 py-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div className="group">
                    <input
                      type="email"
                      placeholder="Work Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-6 py-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div className="group">
                    <textarea
                      rows={4}
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full px-6 py-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-medium text-slate-900 resize-none"
                    ></textarea>
                  </div>
                  {success && (
                    <div className="flex items-center gap-3 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl animate-scale-in shadow-sm">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                      <p className="text-emerald-700 font-bold">Message received. We'll be in touch soon!</p>
                    </div>
                  )}
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full py-5 text-lg"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 block w-full clear-both">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 animate-gradient"></div>

        <div className="absolute inset-0 opacity-20">
          <FloatingElement delay={0} duration={8} className="top-10 left-10">
            <div className="w-40 h-40 border-[10px] border-white/20 rounded-full animate-blob"></div>
          </FloatingElement>
          <FloatingElement delay={2} duration={10} className="top-20 right-20">
            <div
              className="w-32 h-32 border-[10px] border-white/20 rounded-[3rem] transform rotate-45 animate-blob"
              style={{ animationDirection: "reverse" }}
            ></div>
          </FloatingElement>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className={isPageLoaded ? "animate-scale-in" : "opacity-0"}>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 block leading-tight">
              Ready to Scale Your<br />Business?
            </h2>
            <p className="text-2xl text-blue-100 mb-12 block font-medium opacity-80">
              Join 10,000+ top-tier businesses already optimizing with BizManager.
            </p>
            <Button
              onClick={() => onNavigate("/businesses")}
              variant="outline"
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-50 px-16 py-6 text-xl border-none shadow-2xl"
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
