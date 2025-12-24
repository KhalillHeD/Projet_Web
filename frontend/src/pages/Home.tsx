import React, { useState, useEffect } from "react";
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
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsPageLoaded(true), 80);
    return () => clearTimeout(t);
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

  return (
    <div
      className="min-h-screen overflow-hidden relative text-[color:var(--text)]"
      style={{ background: "var(--background)" }}
    >
      <style>{`
        /* Base (your original) */
        @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        @keyframes float-soft { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
        @keyframes shimmer { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        .animate-fade-in { animation: fade-in 420ms ease-out forwards; }
        .animate-scale-in { animation: scale-in 420ms ease-out forwards; }
        .animate-float-soft { animation: float-soft 6s ease-in-out infinite; }

        .hover-lift { transition: transform .28s cubic-bezier(.4,0,.2,1), box-shadow .28s; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 10px 30px rgba(2,6,23,0.12); }

        .stagger-1 { animation-delay: 0.08s; }
        .stagger-2 { animation-delay: 0.16s; }
        .stagger-3 { animation-delay: 0.24s; }

        .gradient-text-animated { background: linear-gradient(90deg,var(--accent),var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .feature-card-gradient { position: relative; overflow: hidden; }
        .feature-card-gradient::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0)); opacity: 0; transition: opacity .28s; }
        .feature-card-gradient:hover::before { opacity: 1; }

        .decor-blob { position: absolute; border-radius: 9999px; filter: blur(32px); opacity: 0.22; transform: translate3d(0,0,0); }

        /* Gold diagonal lines and subtle speckles (kept from your original) */
        .bg-flair {
          background-image: 
            repeating-linear-gradient(135deg, rgba(212,175,55,0.05) 0 1px, transparent 1px 36px),
            radial-gradient(circle at 10% 20%, rgba(212,175,55,0.06) 0 1px, transparent 1px),
            radial-gradient(circle at 70% 80%, rgba(212,175,55,0.05) 0 1px, transparent 1px);
          background-size: 36px 36px, 24px 24px, 40px 40px;
          opacity: 0.7;
          mix-blend-mode: screen;
        }

        /* =========================================================
          HERO-ONLY THEME (Light Blue + Gold + White)
          Everything after hero keeps your original theme vars
        ========================================================== */
        .hero-theme {
          --hero-text: #0B1B2B;
          --hero-muted: #4C647B;
          --hero-primary: #2B77E5;
          --hero-secondary: #5AA7FF;
          --hero-gold: #D4AF37;
          --hero-border: rgba(43,119,229,.16);
        }

        .hero-bg {
          background:
            radial-gradient(900px 520px at 20% 10%, rgba(90,167,255,.24), transparent 60%),
            radial-gradient(820px 520px at 82% 18%, rgba(212,175,55,.18), transparent 60%),
            linear-gradient(to bottom right, rgba(43,119,229,.14), rgba(90,167,255,.08), transparent);
        }

        .glass-hero {
          background: linear-gradient(180deg, rgba(255,255,255,.88), rgba(255,255,255,.62));
          border: 1px solid var(--hero-border);
          backdrop-filter: blur(10px);
        }

        .hero-gradient-text {
          background: linear-gradient(90deg, var(--hero-primary), var(--hero-secondary), var(--hero-gold));
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 6s ease-in-out infinite;
        }

        .shimmer-wrap { position: relative; overflow: hidden; }
        .shimmer-wrap::after {
          content: '';
          position: absolute; top: -40%; left: -60%;
          width: 60%; height: 180%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.40), transparent);
          transform: skewX(-12deg);
          opacity: 0;
        }
        .shimmer-wrap:hover::after { opacity: 1; animation: shimmer 1.1s ease-in-out; }

        .decor-blob-hero { position: absolute; border-radius: 9999px; filter: blur(34px); transform: translate3d(0,0,0); }
      `}</style>

      {/* Original page decor (kept) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="decor-blob left-8 top-16 w-56 h-56 bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--secondary)] animate-float-soft" style={{ opacity: 0.22 }} />
        <div className="decor-blob right-16 top-24 w-72 h-72 bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent)] animate-float-soft" style={{ opacity: 0.08 }} />
        <div className="decor-blob left-1/4 bottom-36 w-44 h-44 bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--secondary)] animate-float-soft" style={{ opacity: 0.18 }} />
      </div>

      {/* =========================
          HERO SECTION (UPDATED ONLY)
         ========================= */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 hero-theme">
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 pointer-events-none bg-flair" />

        {/* hero-only extra blobs (won’t affect other sections) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div
            className="decor-blob-hero left-6 top-10 w-64 h-64 animate-float-soft"
            style={{ background: "rgba(90,167,255,.32)", opacity: 0.9 }}
          />
          <div
            className="decor-blob-hero right-10 top-16 w-80 h-80 animate-float-soft"
            style={{ background: "rgba(212,175,55,.22)", opacity: 0.9 }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center block w-full clear-both lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 glass-hero shimmer-wrap ${
                isPageLoaded ? "animate-scale-in" : "opacity-0"
              } hover:shadow-lg transition-all duration-300`}
            >
              <Sparkles
                size={16}
                className="animate-spin"
                style={{ animationDuration: "3s", color: "var(--hero-gold)" }}
              />
              <span className="text-sm font-semibold" style={{ color: "var(--hero-primary)" }}>
                Trusted by 10,000+ businesses
              </span>
              <Star
                size={16}
                className="fill-current"
                style={{ color: "var(--hero-gold)" }}
              />
            </div>

            {/* Hero image for large screens (with glow) */}
            <div className="mt-12 lg:mt-0 lg:col-start-2 lg:flex lg:justify-end">
              <div className="relative hidden lg:block">
                <div
                  className="absolute -inset-2 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(43,119,229,.22), rgba(90,167,255,.18), rgba(212,175,55,.20))",
                    filter: "blur(14px)",
                    opacity: 0.7,
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1508385082359-f3a5d6b4b7a2?q=80&w=1200&auto=format&fit=crop"
                  alt="Abstract business illustration"
                  className="relative w-[520px] max-w-full rounded-2xl shadow-2xl object-cover hover-lift"
                />
              </div>
            </div>

            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 ${
                isPageLoaded ? "animate-fade-in" : "opacity-0"
              }`}
              style={{ color: "var(--hero-text)" }}
            >
              Manage Your Business
              <br />
              <span className="block mt-3 font-semibold hero-gradient-text">
                Effortlessly
              </span>
            </h1>

            <p
              className={`text-lg mb-8 max-w-3xl mx-auto block ${
                isPageLoaded ? "animate-fade-in stagger-1" : "opacity-0"
              }`}
              style={{ color: "var(--hero-muted)" }}
            >
              BizManager is your all-in-one solution for streamlined business
              operations. Track transactions, manage inventory, generate
              invoices, and gain insights with powerful analytics.
            </p>

            {/* AUTH-AWARE BUTTONS (kept ORIGINAL colors exactly) */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${
                isPageLoaded ? "animate-fade-in stagger-2" : "opacity-0"
              } block w-full clear-both`}
            >
                <Button
                  onClick={() => onNavigate(user ? "/businesses" : "/signup")}
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={20} className="text-white animate-float-soft" />} 
                  className="hover-lift shadow-lg shadow-[color:var(--secondary)]/40 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--secondary)] text-white"
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
                <span
                  className="text-sm group-hover:text-[color:var(--accent)] transition-colors"
                  style={{ color: "var(--muted)" }}
                >
                  Scroll to explore
                </span>
                <ChevronDown size={24} className="animate-float-soft" style={{ color: "var(--accent)" }} />
              </div>
            </div>
          </div>

          {/* Feature Cards (UNCHANGED - original colors) */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 block w-full clear-both">
            {[
              {
                icon: TrendingUp,
                title: "Real-time Analytics",
                desc: "Track your business performance with live data and insights",
                gradient: "from-[color:var(--secondary)] to-[color:var(--primary)]",
                delay: "stagger-3",
              },
              {
                icon: FileText,
                title: "Smart Invoicing",
                desc: "Generate and manage professional invoices in seconds",
                gradient: "from-[color:var(--success)] to-[color:var(--success)]",
                delay: "stagger-4",
              },
              {
                icon: Package,
                title: "Inventory Control",
                desc: "Keep track of stock levels with automated alerts",
                gradient: "from-[color:var(--warning)] to-[color:var(--warning)]",
                delay: "stagger-5",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${isPageLoaded ? "animate-scale-in" : "opacity-0"} ${item.delay}`}
              >
                <Card className="text-center hover-lift group relative overflow-hidden feature-card-gradient shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to bottom right, var(--tw-gradient-stops))" }}
                  />
                  <div
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    style={{ animation: "pulse-glow 2s infinite" }}
                  >
                    <item.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[color:var(--text)] mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[color:var(--secondary)] group-hover:to-[color:var(--primary)] group-hover:bg-clip-text transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVERYTHING BELOW IS YOUR ORIGINAL CODE - UNCHANGED */}
      {/* Features Section */}
      <section
        id="services"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10 block w-full clear-both"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 parallax-slow block w-full clear-both">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-[color:var(--secondary)]/10 to-[color:var(--primary)]/10 rounded-full hover:shadow-lg transition-all duration-300">
              <span className="text-[color:var(--secondary)] font-semibold">Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 hover:gradient-text-animated transition-all cursor-default block" style={{ color: "var(--text)" }}>
              Powerful Features for Modern Businesses
            </h2>
            <p className="text-xl max-w-2xl mx-auto block" style={{ color: "var(--muted)" }}>
              Everything you need to run your business efficiently in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 block w-full clear-both">
            {[
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description:
                  "Visualize your data with beautiful charts and comprehensive reports",
                color: "from-[color:var(--secondary)] to-[color:var(--primary)]",
              },
              {
                icon: FileText,
                title: "Invoice Management",
                description:
                  "Create, send, and track invoices with automated payment reminders",
                color: "from-[color:var(--success)] to-[color:var(--success)]",
              },
              {
                icon: Package,
                title: "Stock Management",
                description:
                  "Monitor inventory levels and receive alerts for low stock items",
                color: "from-[color:var(--warning)] to-[color:var(--warning)]",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description:
                  "Bank-level security to protect your sensitive business data",
                color: "from-[color:var(--error)] to-[color:var(--error)]",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Optimized performance for seamless user experience",
                color: "from-[color:var(--secondary)] to-[color:var(--primary)]",
              },
              {
                icon: TrendingUp,
                title: "Growth Insights",
                description:
                  "Make data-driven decisions with predictive analytics",
                color: "from-[color:var(--success)] to-[color:var(--success)]",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`${isPageLoaded ? "opacity-100 animate-scale-in" : "opacity-0"} hover-lift`}
                style={{
                  animationDelay: `${isPageLoaded ? index * 0.1 : 0}s`,
                  animationFillMode: "forwards",
                }}
              >
                <Card className="group h-full relative overflow-hidden feature-card-gradient shadow-lg hover:shadow-xl hover:shadow-[color:var(--secondary)]/20 transition-shadow duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[2px] rounded-2xl">
                    <div className="w-full h-full bg-white rounded-2xl"></div>
                  </div>

                  <div className="relative">
                    <div
                      className={`w-14 h-14 mb-4 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}
                    >
                      <feature.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 transition-colors" style={{ color: "var(--text)" }}>
                      {feature.title}
                    </h3>
                    <p style={{ color: "var(--muted)" }}>{feature.description}</p>
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
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 block w-full clear-both"
        style={{ background: "transparent" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center block w-full clear-both">
            <div className={`${isPageLoaded ? "animate-slide-in-left" : "opacity-0"}`}>
              <div className="inline-block mb-4 px-4 py-2 rounded-full" style={{ background: "linear-gradient(90deg, rgba(30,58,138,0.06), rgba(62,139,255,0.04))" }}>
                <span className="font-semibold" style={{ color: "var(--secondary)" }}>About Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 block" style={{ color: "var(--text)" }}>
                Built for Growth, Designed for Success
              </h2>
              <p className="text-lg mb-6 block" style={{ color: "var(--muted)" }}>
                BizManager was created by business owners, for business owners. We
                understand the challenges of managing multiple aspects of your
                business, which is why we've built an intuitive platform that
                brings everything together.
              </p>
              <p className="text-lg mb-8 block" style={{ color: "var(--muted)" }}>
                Whether you're a startup or an established enterprise, our
                scalable solution adapts to your needs, helping you focus on what
                matters most: growing your business.
              </p>
              <Button
                onClick={() => onNavigate("/businesses")}
                variant="primary"
                size="lg"
                icon={<ArrowRight size={20} className="animate-float-soft" />}
                className="hover-lift shadow-lg shadow-[color:var(--secondary)]/30"
              >
                Start Your Journey
              </Button>
            </div>

            <div className={`grid grid-cols-2 gap-6 ${isPageLoaded ? "animate-slide-in-right" : "opacity-0"} block w-full clear-both`}>
              {[
                { value: "10K+", label: "Active Users", color: "from-[color:var(--secondary)] to-[color:var(--primary)]", delay: "stagger-1" },
                { value: "99.9%", label: "Uptime", color: "from-[color:var(--success)] to-[color:var(--success)]", delay: "stagger-2" },
                { value: "500K+", label: "Transactions", color: "from-[color:var(--warning)] to-[color:var(--warning)]", delay: "stagger-3" },
                { value: "24/7", label: "Support", color: "from-[color:var(--error)] to-[color:var(--error)]", delay: "stagger-4" },
              ].map((stat, idx) => (
                <div key={idx} className={`${isPageLoaded ? "animate-scale-in" : "opacity-0"} ${stat.delay}`}>
                  <Card className="text-center hover-lift group relative overflow-hidden feature-card-gradient shadow-lg hover:shadow-xl hover:shadow-[color:var(--secondary)]/20 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className={`text-4xl font-bold bg-gradient-to-br ${stat.color} text-transparent bg-clip-text mb-2 transform group-hover:scale-110 transition-transform`}>
                      {stat.value}
                    </div>
                    <div className="transition-colors group-hover:text-[color:var(--text)]" style={{ color: "var(--muted)" }}>
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
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10 block w-full clear-both">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 block w-full clear-both">
            <div className="inline-block mb-4 px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300" style={{ background: "linear-gradient(90deg, rgba(30,58,138,0.06), rgba(62,139,255,0.04))" }}>
              <span className="font-semibold" style={{ color: "var(--secondary)" }}>Contact</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 block" style={{ color: "var(--text)" }}>
              Get In Touch
            </h2>
            <p className="text-xl max-w-2xl mx-auto block" style={{ color: "var(--muted)" }}>
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 block w-full clear-both">
            <div className="space-y-8">
              {[
                { icon: Mail, title: "Email Us", lines: ["info@bizmanager.com", "support@bizmanager.com"], color: "from-[color:var(--secondary)] to-[color:var(--primary)]", delay: "stagger-1" },
                { icon: Phone, title: "Call Us", lines: ["+216 26 805 311", "Mon-Fri 9am-6pm EST"], color: "from-[color:var(--success)] to-[color:var(--success)]", delay: "stagger-2" },
                { icon: MapPin, title: "Visit Us", lines: ["Technopole Ghazella", "Ariana, Tunisia"], color: "from-[color:var(--warning)] to-[color:var(--warning)]", delay: "stagger-3" },
              ].map((contact, idx) => (
                <div key={idx} className={`${isPageLoaded ? "animate-slide-in-left" : "opacity-0"} ${contact.delay}`}>
                  <Card className="flex items-start gap-4 hover-lift group feature-card-gradient shadow-lg hover:shadow-xl hover:shadow-[color:var(--secondary)]/20 transition-all duration-300">
                    <div className={`w-12 h-12 bg-gradient-to-br ${contact.color} rounded-xl flex items-center justify-center flex-shrink-0 transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                      <contact.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: "var(--text)" }}>{contact.title}</h3>
                      {contact.lines.map((line, i) => (
                        <p key={i} style={{ color: "var(--muted)" }}>{line}</p>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <div className={`${isPageLoaded ? "animate-slide-in-right stagger-4" : "opacity-0"} block w-full clear-both`}>
              <Card className="hover-lift shadow-lg feature-card-gradient">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="group">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none transition-all group-hover:border-gray-300"
                      style={{ borderColor: "rgba(229,231,235,1)" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--secondary)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                    />
                  </div>
                  <div className="group">
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none transition-all group-hover:border-gray-300"
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--secondary)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                    />
                  </div>
                  <div className="group">
                    <textarea
                      rows={5}
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none transition-all resize-none group-hover:border-gray-300"
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--secondary)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                    />
                  </div>

                  {success && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl animate-scale-in shadow-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-green-600 font-semibold">Message sent successfully!</p>
                    </div>
                  )}

                  <Button variant="primary" size="lg" className="w-full hover-lift relative overflow-hidden group shadow-lg" disabled={loading}>
                    <span className="relative z-10">{loading ? "Sending..." : "Send Message"}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--secondary)] to-[color:var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 block w-full clear-both">
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--secondary)] to-[color:var(--primary)]" style={{ opacity: 0.06 }}></div>

        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="decor-blob left-10 top-10 w-20 h-20 bg-white/30"></div>
          <div className="decor-blob right-20 top-20 w-16 h-16 bg-white/24"></div>
          <div className="decor-blob left-1/3 bottom-10 w-12 h-12 bg-white/20"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className={isPageLoaded ? "animate-scale-in" : "opacity-0"}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in block">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8 block">
              Join thousands of businesses already using BizManager
            </p>
            <Button
              onClick={() => onNavigate("/businesses")}
              variant="outline"
              size="lg"
              className="bg-white hover:bg-gray-50 hover-lift shadow-xl"
              style={{ color: "var(--secondary)" }}
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
