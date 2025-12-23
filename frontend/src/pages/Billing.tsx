import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Download } from 'lucide-react';
import { Sidebar } from '../layouts/Sidebar';
import { Breadcrumb } from '../layouts/Breadcrumb';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface BillingProps {
  businessId: string;
  onNavigate: (path: string) => void;
}

interface Invoice {
  id: number;
  business: number;
  invoiceNumber: string;
  clientName: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'pending' | 'overdue';
}

export const Billing: React.FC<BillingProps> = ({ businessId, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid' | 'pending' | 'overdue'>('all');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    dueDate: '',
    amount: '',
    status: 'pending',
  });

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/invoices/?business=${businessId}`);
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error('Error fetching invoices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [businessId]);

  const handleCreateInvoice = async () => {
  if (!newInvoice.clientName || !newInvoice.dueDate || !newInvoice.amount) {
    alert('Please fill in all fields');
    return;
  }

  const payload = {
    business: parseInt(businessId),
    clientName: newInvoice.clientName,
    dueDate: newInvoice.dueDate,
    amount: parseFloat(newInvoice.amount),
    status: newInvoice.status,
  };

  try {
    const res = await fetch('http://127.0.0.1:8000/api/invoices/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text(); // use text for errors
      console.error('Backend error:', errText);
      alert('Failed to create invoice. Check console for details.');
      return;
    }

    const createdInvoice = await res.json(); // safe because response is OK
    setInvoices((prev) => [createdInvoice, ...prev]);
    setNewInvoice({ clientName: '', dueDate: '', amount: '', status: 'pending' });
    alert('Invoice created successfully!');
  } catch (err) {
    console.error(err);
    alert('Error creating invoice. Check console for details.');
  }
};

  const handleDownloadPdf = async (invoiceId: number, invoiceNumber: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/invoices/${invoiceId}/pdf/`);
      if (!res.ok) throw new Error('Failed to fetch PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF. Check console for details.');
    }
  };

  const filteredInvoices = invoices.filter((i) => {
    const matchesSearch =
      i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || i.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success-10 text-success';
      case 'unpaid':
        return 'bg-warning-10 text-warning';
      case 'pending':
        return 'bg-secondary-10 text-secondary';
      case 'overdue':
        return 'bg-[rgba(239,83,80,0.08)] text-[color:var(--error)]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={`/business/${businessId}/billing`}
        onNavigate={onNavigate}
        businessId={businessId}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8 animate-fade-in">
            <Breadcrumb
              items={[
                { label: 'Home', path: '/' },
                { label: 'Businesses', path: '/businesses' },
                { label: `Business ${businessId}`, path: `/business/${businessId}` },
                { label: 'Billing' },
              ]}
              onNavigate={onNavigate}
            />
            <h1 className="text-3xl font-bold text-[color:var(--text)] mt-2">Invoices</h1>
          </div>

          {/* Create Invoice Form */}
          <Card className="mb-6 p-4 shadow-lg border border-gray-200 rounded-xl">
            <h2 className="font-bold text-lg mb-4">New Invoice</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Client Name"
                value={newInvoice.clientName}
                onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--secondary)]"
              />
              <input
                type="date"
                value={newInvoice.dueDate}
                onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--secondary)]"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--secondary)]"
              />
              <select
                value={newInvoice.status}
                onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value as any })}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--secondary)]"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <Button className="mt-4" onClick={handleCreateInvoice}>
              <Plus size={16} /> Create Invoice
            </Button>
          </Card>

          {/* Search & Filters */}
          <Card className="mb-6 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={20} />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[color:var(--secondary)] focus:outline-none"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'paid', 'unpaid', 'pending', 'overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          filterStatus === status
                            ? 'bg-[color:var(--secondary)] text-white'
                            : 'bg-card border-2 border-transparent text-[color:var(--muted)] hover:border-[color:var(--secondary)]'
                        }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Invoice List */}
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
                    <div className="w-12 h-12 bg-gradient-to-br from-[color:var(--secondary)] to-[color:var(--primary)] rounded-xl flex items-center justify-center">
                      <FileText size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[color:var(--text)] text-lg">{invoice.invoiceNumber}</h3>
                      <p className="text-[color:var(--muted)] text-sm">
                        {invoice.clientName} • Due: {invoice.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-2xl font-bold text-[color:var(--text)]">${invoice.amount.toLocaleString()}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Download size={16} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPdf(invoice.id, invoice.invoiceNumber);
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
              <p className="text-[color:var(--muted)] text-lg">No invoices found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
