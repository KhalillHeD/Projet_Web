import React from 'react';
import { ArrowRight, TrendingUp, FileText, Package, BarChart3, Shield, Zap, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A6AFF]/10 via-[#3E8BFF]/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0B1A33] mb-6">
              Manage Your Business
              <br />
              <span className="bg-gradient-to-r from-[#1A6AFF] to-[#3E8BFF] text-transparent bg-clip-text">
                Effortlessly
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              BizManager is your all-in-one solution for streamlined business operations. Track transactions, manage inventory, generate invoices, and gain insights with powerful analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={() => onNavigate('/businesses')} variant="primary" size="lg" icon={<ArrowRight size={20} />}>
                Get Started Free
              </Button>
              <Button onClick={() => onNavigate('/login')} variant="outline" size="lg">
                Login
              </Button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            <Card hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#1A6AFF] to-[#3E8BFF] rounded-2xl flex items-center justify-center">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1A33] mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">Track your business performance with live data and insights</p>
            </Card>

            <Card hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#16C47F] to-[#13ad70] rounded-2xl flex items-center justify-center">
                <FileText size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1A33] mb-2">Smart Invoicing</h3>
              <p className="text-gray-600">Generate and manage professional invoices in seconds</p>
            </Card>

            <Card hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FFA726] to-[#f59518] rounded-2xl flex items-center justify-center">
                <Package size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1A33] mb-2">Inventory Control</h3>
              <p className="text-gray-600">Keep track of stock levels with automated alerts</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-4">
              Powerful Features for Modern Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to run your business efficiently in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 size={28} />,
                title: 'Advanced Analytics',
                description: 'Visualize your data with beautiful charts and comprehensive reports',
                color: 'from-[#1A6AFF] to-[#3E8BFF]',
              },
              {
                icon: <FileText size={28} />,
                title: 'Invoice Management',
                description: 'Create, send, and track invoices with automated payment reminders',
                color: 'from-[#16C47F] to-[#13ad70]',
              },
              {
                icon: <Package size={28} />,
                title: 'Stock Management',
                description: 'Monitor inventory levels and receive alerts for low stock items',
                color: 'from-[#FFA726] to-[#f59518]',
              },
              {
                icon: <Shield size={28} />,
                title: 'Secure & Reliable',
                description: 'Bank-level security to protect your sensitive business data',
                color: 'from-[#EF5350] to-[#e53935]',
              },
              {
                icon: <Zap size={28} />,
                title: 'Lightning Fast',
                description: 'Optimized performance for seamless user experience',
                color: 'from-[#1A6AFF] to-[#3E8BFF]',
              },
              {
                icon: <TrendingUp size={28} />,
                title: 'Growth Insights',
                description: 'Make data-driven decisions with predictive analytics',
                color: 'from-[#16C47F] to-[#13ad70]',
              },
            ].map((feature, index) => (
              <Card key={index} hover className="group">
                <div className={`w-14 h-14 mb-4 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0B1A33] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-6">
                Built for Growth, Designed for Success
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                BizManager was created by business owners, for business owners. We understand the challenges of managing multiple aspects of your business, which is why we've built an intuitive platform that brings everything together.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Whether you're a startup or an established enterprise, our scalable solution adapts to your needs, helping you focus on what matters most: growing your business.
              </p>
              <Button onClick={() => onNavigate('/businesses')} variant="primary" size="lg" icon={<ArrowRight size={20} />}>
                Start Your Journey
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center">
                <div className="text-4xl font-bold text-[#1A6AFF] mb-2">10K+</div>
                <div className="text-gray-600">Active Users</div>
              </Card>
              <Card className="text-center">
                <div className="text-4xl font-bold text-[#16C47F] mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </Card>
              <Card className="text-center">
                <div className="text-4xl font-bold text-[#FFA726] mb-2">500K+</div>
                <div className="text-gray-600">Transactions</div>
              </Card>
              <Card className="text-center">
                <div className="text-4xl font-bold text-[#EF5350] mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card hover className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1A6AFF] to-[#3E8BFF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B1A33] mb-1">Email Us</h3>
                  <p className="text-gray-600">info@bizmanager.com</p>
                  <p className="text-gray-600">support@bizmanager.com</p>
                </div>
              </Card>

              <Card hover className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#16C47F] to-[#13ad70] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B1A33] mb-1">Call Us</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">Mon-Fri 9am-6pm EST</p>
                </div>
              </Card>

              <Card hover className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFA726] to-[#f59518] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B1A33] mb-1">Visit Us</h3>
                  <p className="text-gray-600">123 Business Street, Suite 100</p>
                  <p className="text-gray-600">New York, NY 10001</p>
                </div>
              </Card>
            </div>

            <Card>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <textarea
                    rows={5}
                    placeholder="Your Message"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none transition-all resize-none"
                  ></textarea>
                </div>
                <Button variant="primary" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1A6AFF] to-[#3E8BFF]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of businesses already using BizManager
          </p>
          <Button onClick={() => onNavigate('/businesses')} variant="outline" size="lg" className="bg-white text-[#1A6AFF] hover:bg-gray-50">
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};
