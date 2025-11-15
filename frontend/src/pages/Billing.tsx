import React, { useState } from 'react';
import { Plus, Search, FileText, Download } from 'lucide-react';
import { Sidebar } from '../layouts/Sidebar';
import { Breadcrumb } from '../layouts/Breadcrumb';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { mockBusinesses, mockInvoices } from '../data/mockData';

interface BillingProps {
  businessId: string;
  onNavigate: (path: string) => void;
}

export const Billing: React.FC<BillingProps> = ({ businessId, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid' | 'pending' | 'overdue'>('all');

  const business = mockBusinesses.find((b) => b.id === businessId);
  const invoices = mockInvoices.filter((i) => i.businessId === businessId);

  const filteredInvoices = invoices.filter((i) => {
    const matchesSearch = i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         i.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || i.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-[#16C47F]/10 text-[#16C47F]';
      case 'unpaid':
        return 'bg-[#FFA726]/10 text-[#FFA726]';
      case 'pending':
        return 'bg-[#3E8BFF]/10 text-[#3E8BFF]';
      case 'overdue':
        return 'bg-[#EF5350]/10 text-[#EF5350]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={`/business/${businessId}/billing`}
        onNavigate={onNavigate}
        businessId={businessId}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <Breadcrumb
              items={[
                { label: 'Home', path: '/' },
                { label: 'Businesses', path: '/businesses' },
                { label: business?.name || '', path: `/business/${businessId}` },
                { label: 'Billing' },
              ]}
              onNavigate={onNavigate}
            />
            <div className="flex items-center justify-between mt-4">
              <h1 className="text-3xl font-bold text-[#0B1A33]">Invoices</h1>
              <Button variant="primary" icon={<Plus size={20} />} onClick={() => onNavigate(`/business/${businessId}/billing/new`)}>
                Create Invoice
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <p className="text-sm text-gray-600 mb-2">Total Invoices</p>
              <p className="text-3xl font-bold text-[#0B1A33]">{invoices.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-2">Paid</p>
              <p className="text-3xl font-bold text-[#16C47F]">{invoices.filter(i => i.status === 'paid').length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-2">Unpaid</p>
              <p className="text-3xl font-bold text-[#FFA726]">{invoices.filter(i => i.status === 'unpaid').length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-2">Overdue</p>
              <p className="text-3xl font-bold text-[#EF5350]">{invoices.filter(i => i.status === 'overdue').length}</p>
            </Card>
          </div>

          <Card className="mb-6 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterStatus === 'all'
                      ? 'bg-[#1A6AFF] text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#1A6AFF]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('paid')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterStatus === 'paid'
                      ? 'bg-[#16C47F] text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#16C47F]'
                  }`}
                >
                  Paid
                </button>
                <button
                  onClick={() => setFilterStatus('unpaid')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterStatus === 'unpaid'
                      ? 'bg-[#FFA726] text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#FFA726]'
                  }`}
                >
                  Unpaid
                </button>
                <button
                  onClick={() => setFilterStatus('overdue')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterStatus === 'overdue'
                      ? 'bg-[#EF5350] text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#EF5350]'
                  }`}
                >
                  Overdue
                </button>
              </div>
            </div>
          </Card>

          <div className="grid gap-4">
            {filteredInvoices.map((invoice, index) => (
              <Card
                key={invoice.id}
                hover
                onClick={() => onNavigate(`/business/${businessId}/billing/${invoice.id}`)}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1A6AFF] to-[#3E8BFF] rounded-xl flex items-center justify-center">
                      <FileText size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#0B1A33] text-lg">{invoice.invoiceNumber}</h3>
                      <p className="text-gray-600 text-sm">{invoice.clientName} • Due: {invoice.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-2xl font-bold text-[#0B1A33]">${invoice.amount.toLocaleString()}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Download size={16} />}
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                      }}
                    >
                      PDF
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredInvoices.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-gray-600 text-lg">No invoices found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
