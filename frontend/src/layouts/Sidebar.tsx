import React from 'react';
import { LayoutDashboard, Receipt, FileText, Package, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  businessId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentPath, onNavigate, businessId }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: `/business/${businessId}` },
    { icon: Receipt, label: 'Transactions', path: `/business/${businessId}/transactions` },
    { icon: FileText, label: 'Billing', path: `/business/${businessId}/billing` },
    { icon: Package, label: 'Stock', path: `/business/${businessId}/stock` },
    { icon: Settings, label: 'Settings', path: `/business/${businessId}/settings` },
  ];

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-full bg-card shadow-lg z-30 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--primary)', borderWidth: '1px' }}>
          {isOpen && <span className="font-bold text-[color:var(--text)]">Menu</span>}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors ml-auto"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[color:var(--secondary)] text-white shadow-md'
                    : 'text-[color:var(--text)] hover:bg-white/5'
                }`}
              >
                <Icon size={20} />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
      <div className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`} />
    </>
  );
};
