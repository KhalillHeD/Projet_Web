import React, { useState } from 'react';
import { LayoutDashboard, Receipt, FileText, Package, Settings, ChevronLeft, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  businessId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentPath, onNavigate, businessId }) => {
  const { user, logout } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
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
        className={`fixed left-4 top-4 bottom-4 glass rounded-[2rem] z-30 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'w-64' : 'w-24'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            {isOpen && (
              <span className="text-xl font-bold text-gradient">Menu</span>
            )}
            <button
              onClick={onToggle}
              className="p-2.5 hover:bg-white/50 rounded-2xl transition-all duration-300 ml-auto border border-white/20 shadow-sm"
            >
              {isOpen ? <ChevronLeft size={20} className="text-slate-600" /> : <ChevronRight size={20} className="text-slate-600" />}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-3 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center gap-3.5 px-4 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${isActive
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-md'
                    }`}
                >
                  <Icon size={22} className={`transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                  {isOpen && <span className="font-semibold tracking-wide text-sm">{item.label}</span>}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/10 relative">
            {showAccountMenu && isOpen && (
              <div className="absolute bottom-[calc(100%+0.5rem)] left-4 right-4 glass rounded-3xl p-2 animate-slide-up shadow-2xl border border-white/20 z-50">
                <button
                  onClick={() => {
                    setShowAccountMenu(false);
                    onNavigate('/profile');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white transition-all duration-300 text-slate-600 font-bold text-sm group/item"
                >
                  <div className="p-1.5 rounded-lg bg-slate-50 group-hover/item:bg-blue-50 group-hover/item:text-blue-600 transition-colors">
                    <UserIcon size={16} />
                  </div>
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setShowAccountMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all duration-300 text-slate-600 font-bold text-sm mt-1 group/item"
                >
                  <div className="p-1.5 rounded-lg bg-slate-50 group-hover/item:bg-rose-100 group-hover/item:text-rose-600 transition-colors">
                    <LogOut size={16} />
                  </div>
                  Disconnect
                </button>
              </div>
            )}
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="flex items-center gap-3 w-full group transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center border border-white transition-transform group-hover:scale-110 shadow-sm">
                <Settings size={18} className="text-blue-600" />
              </div>
              {isOpen && (
                <div className="text-left overflow-hidden">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] truncate">
                    {user?.username || 'Admin'}
                  </p>
                  <p className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                    Account Menu
                  </p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
