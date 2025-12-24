import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Download, Trash2 } from 'lucide-react';
import { Sidebar } from '../layouts/Sidebar';
import { Breadcrumb } from '../layouts/Breadcrumb';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from "../context/AuthContext";

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
  const { accessToken } = useAuth();
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
      if (!accessToken) return;
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/invoices/?business=${businessId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching invoices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [businessId, accessToken]);

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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
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

  const handleDeleteInvoice = async (invoiceId: number) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/invoices/${invoiceId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Backend error deleting invoice:', errText);
        alert('Failed to delete invoice.');
        return;
      }

      setInvoices((prev) => prev.filter(inv => inv.id !== invoiceId));
      alert('Invoice deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Error deleting invoice.');
    }
  };

  const handleDownloadPdf = async (invoiceId: number, invoiceNumber: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/invoices/${invoiceId}/pdf/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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

  if (loading) return <div className="p-8">Loading invoices...</div>;

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
            <h1 className="text-3xl font-bold text-[#0B1A33] mt-2">Invoices</h1>
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
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="date"
                value={newInvoice.dueDate}
                onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                value={newInvoice.status}
                onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value as any })}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'paid', 'unpaid', 'pending', 'overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-600'
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
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                      <FileText size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#0B1A33] text-lg">{invoice.invoiceNumber}</h3>
                      <p className="text-gray-600 text-sm">
                        {invoice.clientName} • Due: {invoice.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-2xl font-bold text-[#0B1A33]">${invoice.amount.toLocaleString()}</p>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#EF5350] border-[#EF5350] hover:bg-[#EF5350]/10"
                      icon={<Trash2 size={16} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInvoice(invoice.id);
                      }}
                    >
                      {""}
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
