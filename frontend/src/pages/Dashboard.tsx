import React, { useState } from 'react';
import { DollarSign, Receipt, FileText, Package, TrendingUp, AlertTriangle, Settings } from 'lucide-react';
import { Sidebar } from '../layouts/Sidebar';
import { Breadcrumb } from '../layouts/Breadcrumb';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { QuickActionBar } from '../components/QuickActionBar';
import { TimelineFeed } from '../components/TimelineFeed';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { mockBusinesses, mockTransactions, mockInvoices, mockStockItems, getMonthlyRevenue, getRecentActivity } from '../data/mockData';

interface DashboardProps {
  businessId: string;
  onNavigate: (path: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ businessId, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const business = mockBusinesses.find((b) => b.id === businessId);
  const transactions = mockTransactions.filter((t) => t.businessId === businessId);
  const invoices = mockInvoices.filter((i) => i.businessId === businessId);
  const stockItems = mockStockItems.filter((s) => s.businessId === businessId);

  const totalRevenue = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyRevenue = transactions
    .filter((t) => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingInvoices = invoices.filter((i) => i.status === 'unpaid' || i.status === 'pending').length;
  const lowStockItems = stockItems.filter((s) => s.quantity < s.minQuantity).length;

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-transaction':
        setShowTransactionModal(true);
        break;
      case 'add-stock':
        setShowStockModal(true);
        break;
      case 'generate-invoice':
        onNavigate(`/business/${businessId}/billing/new`);
        break;
      case 'view-transactions':
        onNavigate(`/business/${businessId}/transactions`);
        break;
      case 'view-stock':
        onNavigate(`/business/${businessId}/stock`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={`/business/${businessId}`}
        onNavigate={onNavigate}
        businessId={businessId}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <Breadcrumb
                items={[
                  { label: 'Home', path: '/' },
                  { label: 'Businesses', path: '/businesses' },
                  { label: business?.name || 'Dashboard' },
                ]}
                onNavigate={onNavigate}
              />
              <div className="flex items-center gap-3">
                <span className="text-4xl">{business?.logo}</span>
                <div>
                  <h1 className="text-3xl font-bold text-[#0B1A33]">{business?.name}</h1>
                  <p className="text-gray-600">{business?.tagline}</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              icon={<Settings size={20} />}
              onClick={() => onNavigate(`/business/${businessId}/settings`)}
            >
              Settings
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              trend={12.5}
              icon={<DollarSign size={28} />}
              color="from-[#1A6AFF] to-[#3E8BFF]"
              delay={0}
            />
            <KPICard
              title="Monthly Revenue"
              value={`$${monthlyRevenue.toLocaleString()}`}
              trend={8.3}
              icon={<TrendingUp size={28} />}
              color="from-[#16C47F] to-[#13ad70]"
              delay={100}
            />
            <KPICard
              title="Transactions"
              value={transactions.length}
              trend={5.2}
              icon={<Receipt size={28} />}
              color="from-[#FFA726] to-[#f59518]"
              delay={200}
            />
            <KPICard
              title="Pending Invoices"
              value={pendingInvoices}
              icon={<FileText size={28} />}
              color="from-[#3E8BFF] to-[#1A6AFF]"
              delay={300}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Stock Alerts"
              value={lowStockItems}
              icon={<AlertTriangle size={28} />}
              color="from-[#EF5350] to-[#e53935]"
              delay={400}
            />
            <KPICard
              title="Total Invoices"
              value={invoices.length}
              icon={<FileText size={28} />}
              color="from-[#16C47F] to-[#13ad70]"
              delay={500}
            />
            <KPICard
              title="Stock Items"
              value={stockItems.length}
              icon={<Package size={28} />}
              color="from-[#FFA726] to-[#f59518]"
              delay={600}
            />
            <KPICard
              title="Total Expenses"
              value={`$${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`}
              trend={-3.2}
              icon={<DollarSign size={28} />}
              color="from-[#EF5350] to-[#e53935]"
              delay={700}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Revenue Over Time" data={getMonthlyRevenue()} type="line" />
            <ChartCard title="Revenue vs Expenses" data={getMonthlyRevenue().slice(-6)} type="bar" />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#0B1A33] mb-4">Quick Actions</h3>
            <QuickActionBar onAction={handleQuickAction} />
          </div>

          <TimelineFeed activities={getRecentActivity()} />
        </div>
      </div>

      <Modal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        title="Add New Transaction"
        size="md"
      >
        <form className="space-y-4">
          <Input label="Description" placeholder="Enter transaction description" required />
          <Input label="Amount" type="number" placeholder="0.00" required />
          <div>
            <label className="block text-sm font-medium text-[#0B1A33] mb-2">Type</label>
            <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none">
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>
          <Input label="Category" placeholder="Enter category" required />
          <Input label="Date" type="date" required />
          <div className="flex gap-3">
            <Button variant="primary" className="flex-1">Add Transaction</Button>
            <Button variant="outline" onClick={() => setShowTransactionModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title="Add Stock Item"
        size="md"
      >
        <form className="space-y-4">
          <Input label="Item Name" placeholder="Enter item name" required />
          <Input label="SKU" placeholder="Enter SKU" required />
          <Input label="Quantity" type="number" placeholder="0" required />
          <Input label="Min Quantity" type="number" placeholder="0" required />
          <Input label="Price" type="number" placeholder="0.00" required />
          <Input label="Category" placeholder="Enter category" required />
          <div className="flex gap-3">
            <Button variant="success" className="flex-1">Add Item</Button>
            <Button variant="outline" onClick={() => setShowStockModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
