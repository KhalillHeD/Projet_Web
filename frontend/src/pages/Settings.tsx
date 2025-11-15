import React, { useState } from 'react';
import { Save, Trash2, Upload } from 'lucide-react';
import { Sidebar } from '../layouts/Sidebar';
import { Breadcrumb } from '../layouts/Breadcrumb';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { mockBusinesses } from '../data/mockData';

interface SettingsProps {
  businessId: string;
  onNavigate: (path: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ businessId, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const business = mockBusinesses.find((b) => b.id === businessId);

  const [formData, setFormData] = useState({
    name: business?.name || '',
    tagline: business?.tagline || '',
    industry: business?.industry || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={`/business/${businessId}/settings`}
        onNavigate={onNavigate}
        businessId={businessId}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <Breadcrumb
              items={[
                { label: 'Home', path: '/' },
                { label: 'Businesses', path: '/businesses' },
                { label: business?.name || '', path: `/business/${businessId}` },
                { label: 'Settings' },
              ]}
              onNavigate={onNavigate}
            />
            <h1 className="text-3xl font-bold text-[#0B1A33] mt-4">Business Settings</h1>
          </div>

          <Card className="mb-6 animate-slide-up">
            <h2 className="text-xl font-bold text-[#0B1A33] mb-6">Business Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#1A6AFF] to-[#3E8BFF] rounded-2xl flex items-center justify-center text-5xl">
                  {business?.logo}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Business Logo</p>
                  <Button variant="outline" size="sm" icon={<Upload size={16} />}>
                    Change Logo
                  </Button>
                </div>
              </div>

              <Input
                label="Business Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                required
              />

              <Input
                label="Industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[#0B1A33] mb-2">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none transition-all resize-none"
                  placeholder="Enter business description"
                ></textarea>
              </div>

              <Button variant="primary" icon={<Save size={20} />} type="submit">
                Save Changes
              </Button>
            </form>
          </Card>

          <Card className="mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-bold text-[#0B1A33] mb-6">Contact Information</h2>
            <form className="space-y-4">
              <Input label="Email" type="email" placeholder="business@example.com" />
              <Input label="Phone" type="tel" placeholder="+1 (555) 123-4567" />
              <Input label="Address" placeholder="123 Business Street" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" placeholder="New York" />
                <Input label="State/Province" placeholder="NY" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Postal Code" placeholder="10001" />
                <Input label="Country" placeholder="United States" />
              </div>
              <Button variant="primary" icon={<Save size={20} />}>
                Save Contact Info
              </Button>
            </form>
          </Card>

          <Card className="mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-bold text-[#0B1A33] mb-6">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-[#0B1A33]">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive email updates about your business</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1A6AFF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A6AFF]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-[#0B1A33]">Low Stock Alerts</p>
                  <p className="text-sm text-gray-600">Get notified when stock is running low</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1A6AFF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A6AFF]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-[#0B1A33]">Invoice Reminders</p>
                  <p className="text-sm text-gray-600">Send automatic payment reminders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1A6AFF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A6AFF]"></div>
                </label>
              </div>
            </div>
          </Card>

          <Card className="border-2 border-[#EF5350]/20 bg-[#EF5350]/5 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-bold text-[#EF5350] mb-4">Danger Zone</h2>
            <p className="text-gray-600 mb-4">
              Once you delete a business, there is no going back. Please be certain.
            </p>
            <Button variant="error" icon={<Trash2 size={20} />} onClick={() => setShowDeleteModal(true)}>
              Delete Business
            </Button>
          </Card>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Business" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{business?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="error" className="flex-1" onClick={() => setShowDeleteModal(false)}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
