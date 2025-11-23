import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Receipt,
  FileText,
  Package,
  TrendingUp,
  AlertTriangle,
  Settings,
} from 'lucide-react';
import { Sidebar } from '../layouts/Sidebar';
import { Breadcrumb } from '../layouts/Breadcrumb';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { QuickActionBar } from '../components/QuickActionBar';
import { TimelineFeed } from '../components/TimelineFeed';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface DashboardProps {
  businessId: string;
  onNavigate: (path: string) => void;
}

interface Business {
  id: string;
  name: string;
  tagline?: string;
  logo?: string;
}

interface Transaction {
  id: number;
  businessId: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category?: string;
}

interface Invoice {
  id: number;
  businessId: string;
  amount?: number;
  status: 'paid' | 'unpaid' | 'pending' | 'overdue';
  dueDate?: string;
}

interface StockItem {
  id: number;
  businessId: string;
  quantity: number;
  minQuantity: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ businessId, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const [business, setBusiness] = useState<Business | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bRes, tRes, iRes, sRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/businesses/${businessId}/`),
          fetch(`http://127.0.0.1:8000/api/transactions/?business=${businessId}`),
          fetch(`http://127.0.0.1:8000/api/invoices/?business=${businessId}`),
          fetch(`http://127.0.0.1:8000/api/stock-items/?business=${businessId}`)
        ]);

        const [bData, tData, iData, sData] = await Promise.all([
          bRes.ok ? bRes.json() : {},
          tRes.ok ? tRes.json() : [],
          iRes.ok ? iRes.json() : [],
          sRes.ok ? sRes.json() : [],
        ]);

        setBusiness(bData as Business);
        setTransactions(Array.isArray(tData) ? tData : []);
        setInvoices(Array.isArray(iData) ? iData : []);
        setStockItems(Array.isArray(sData) ? sData : []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId]);

  // Total Revenue includes transactions + paid invoices
  const totalRevenue = [
    ...transactions.filter(t => t.type === 'income' && typeof t.amount === 'number'),
    ...invoices
      .filter(i => i.status === 'paid')
      .map(i => ({ amount: i.amount || 0, date: i.dueDate || new Date().toISOString(), type: 'income' }))
  ].reduce((sum, t) => sum + t.amount, 0);

  const monthlyRevenue = [
    ...transactions.filter(t => t.type === 'income' && typeof t.amount === 'number'),
    ...invoices
      .filter(i => i.status === 'paid')
      .map(i => ({ amount: i.amount || 0, date: i.dueDate || new Date().toISOString(), type: 'income' }))
  ].filter(t => new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingInvoices = invoices.filter(i => i.status === 'unpaid' || i.status === 'pending').length;
  const lowStockItems = stockItems.filter(s => s.quantity < s.minQuantity).length;

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-transaction': setShowTransactionModal(true); break;
      case 'add-stock': setShowStockModal(true); break;
      case 'generate-invoice': onNavigate(`/business/${businessId}/billing/new`); break;
      case 'view-transactions': onNavigate(`/business/${businessId}/transactions`); break;
      case 'view-stock': onNavigate(`/business/${businessId}/stock`); break;
    }
  };

  // Revenue vs Expenses chart data including transactions + paid invoices
  const revenueVsExpenses = (() => {
    const allItems: { date: string; amount: number; type: 'income' | 'expense' }[] = [
      ...transactions,
      ...invoices
        .filter(i => i.status === 'paid')
        .map(i => ({ date: i.dueDate || new Date().toISOString(), amount: i.amount || 0, type: 'income' }))
    ];

    const monthMap: Record<string, { month: string; revenue: number; expenses: number }> = {};
    allItems.forEach(item => {
      const month = new Date(item.date).toLocaleString('default', { month: 'short' });
      if (!monthMap[month]) monthMap[month] = { month, revenue: 0, expenses: 0 };
      if (item.type === 'income') monthMap[month].revenue += item.amount;
      if (item.type === 'expense') monthMap[month].expenses += item.amount;
    });

    return Object.values(monthMap).sort(
      (a, b) => new Date(a.month + ' 1, 2000').getTime() - new Date(b.month + ' 1, 2000').getTime()
    );
  })();

  if (loading) return <p className="text-center mt-20 text-gray-600">Loading dashboard...</p>;

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
          {/* Breadcrumb */}
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
              <div className="flex items-center gap-3 mt-2">
                {business?.logo && <img src={business.logo} alt="logo" className="w-12 h-12 rounded-lg object-cover" />}
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

          {/* KPI Cards */}
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

          {/* Stock & Invoice KPI */}
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
              value={`$${transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}`}
              trend={-3.2}
              icon={<DollarSign size={28} />}
              color="from-[#EF5350] to-[#e53935]"
              delay={700}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Revenue Over Time" data={revenueVsExpenses} type="line" />
            <ChartCard title="Revenue vs Expenses" data={revenueVsExpenses} type="bar" />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#0B1A33] mb-4">Quick Actions</h3>
            <QuickActionBar onAction={handleQuickAction} />
          </div>

          {/* Timeline Feed */}
          <TimelineFeed activities={revenueVsExpenses} />
        </div>
      </div>

      {/* Transaction Modal */}
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
            <Button variant="primary" className="flex-1">
              Add Transaction
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowTransactionModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Stock Modal */}
      <Modal isOpen={showStockModal} onClose={() => setShowStockModal(false)} title="Add Stock Item" size="md">
        <form className="space-y-4">
          <Input label="Item Name" placeholder="Enter item name" required />
          <Input label="SKU" placeholder="Enter SKU" required />
          <Input label="Quantity" type="number" placeholder="0" required />
          <Input label="Min Quantity" type="number" placeholder="0" required />
          <Input label="Price" type="number" placeholder="0.00" required />
          <Input label="Category" placeholder="Enter category" required />
          <div className="flex gap-3">
            <Button variant="success" className="flex-1">
              Add Item
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowStockModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
