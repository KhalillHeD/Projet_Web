import React, { useState } from 'react';
import { Plus, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Sidebar } from '../layouts/Sidebar';
import { Breadcrumb } from '../layouts/Breadcrumb';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { mockBusinesses, mockTransactions } from '../data/mockData';

interface TransactionsProps {
  businessId: string;
  onNavigate: (path: string) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ businessId, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const business = mockBusinesses.find((b) => b.id === businessId);
  const transactions = mockTransactions.filter((t) => t.businessId === businessId);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#16C47F]/10 text-[#16C47F]';
      case 'pending':
        return 'bg-[#FFA726]/10 text-[#FFA726]';
      case 'cancelled':
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
        currentPath={`/business/${businessId}/transactions`}
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
                { label: 'Transactions' },
              ]}
              onNavigate={onNavigate}
            />
            <div className="flex items-center justify-between mt-4">
              <h1 className="text-3xl font-bold text-[#0B1A33]">Transactions</h1>
              <Button variant="primary" icon={<Plus size={20} />} onClick={() => setShowModal(true)}>
                Add Transaction
              </Button>
            </div>
          </div>

          <Card className="mb-6 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-[#1A6AFF] text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#1A6AFF]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('income')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterType === 'income'
                      ? 'bg-[#16C47F] text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#16C47F]'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilterType('expense')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterType === 'expense'
                      ? 'bg-[#EF5350] text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#EF5350]'
                  }`}
                >
                  Expense
                </button>
              </div>
            </div>
          </Card>

          <div className="grid gap-4">
            {filteredTransactions.map((transaction, index) => (
              <Card
                key={transaction.id}
                hover
                onClick={() => onNavigate(`/business/${businessId}/transactions/${transaction.id}`)}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        transaction.type === 'income'
                          ? 'bg-gradient-to-br from-[#16C47F] to-[#13ad70]'
                          : 'bg-gradient-to-br from-[#EF5350] to-[#e53935]'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp size={24} className="text-white" />
                      ) : (
                        <TrendingDown size={24} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#0B1A33] text-lg">{transaction.description}</h3>
                      <p className="text-gray-600 text-sm">{transaction.category} • {transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p
                        className={`text-2xl font-bold ${
                          transaction.type === 'income' ? 'text-[#16C47F]' : 'text-[#EF5350]'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-gray-600 text-lg">No transactions found</p>
            </Card>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Transaction" size="md">
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
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
