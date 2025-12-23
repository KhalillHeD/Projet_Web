import React from 'react';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20" style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))', color: 'var(--white)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[color:var(--secondary)] to-[color:var(--accent)] rounded-xl flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--white)' }}>BizManager</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Your all-in-one business management solution for modern enterprises.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
              <li className="hover:text-white transition-colors cursor-pointer">Home</li>
              <li className="hover:text-white transition-colors cursor-pointer">Services</li>
              <li className="hover:text-white transition-colors cursor-pointer">About</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
              <li className="hover:text-white transition-colors cursor-pointer">Transaction Management</li>
              <li className="hover:text-white transition-colors cursor-pointer">Invoice Generation</li>
              <li className="hover:text-white transition-colors cursor-pointer">Stock Control</li>
              <li className="hover:text-white transition-colors cursor-pointer">Analytics</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@bizmanager.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>123 Business St, Suite 100</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'var(--muted)' }}>
          <p>&copy; 2025 BizManager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
