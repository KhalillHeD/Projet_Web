import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  Receipt,
  FileText,
  Package,
  TrendingUp,
  AlertTriangle,
  Settings as SettingsIcon,
} from "lucide-react";
import { Sidebar } from "../layouts/Sidebar";
import { Breadcrumb } from "../layouts/Breadcrumb";
import { KPICard } from "../components/KPICard";
import { ChartCard } from "../components/ChartCard";
import { QuickActionBar } from "../components/QuickActionBar";
import { TimelineFeed } from "../components/TimelineFeed";
import { Modal } from "../components/Modal";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";

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
  type: "income" | "expense";
  date: string;
  category?: string;
}

interface Invoice {
  id: number;
  businessId: string;
  amount?: number;
  status: "paid" | "unpaid" | "pending" | "overdue";
  dueDate?: string;
}

interface StockItem {
  id: number;
  businessId: string;
  quantity: number;
  minQuantity: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  businessId,
  onNavigate,
}) => {
  const { accessToken } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const [business, setBusiness] = useState<Business | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard data (with JWT)
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setError("Not authenticated.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };

        const [bRes, tRes, iRes, sRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/businesses/${businessId}/`, {
            headers,
          }),
          fetch(
            `http://127.0.0.1:8000/api/transactions/?business_id=${businessId}`,
            { headers }
          ),
          fetch(
            `http://127.0.0.1:8000/api/invoices/?business=${businessId}`,
            { headers }
          ),
          fetch(
            `http://127.0.0.1:8000/api/stock-items/?business=${businessId}`,
            { headers }
          ),
        ]);

        if (!bRes.ok) console.error("Business error:", await bRes.text());
        if (!tRes.ok) console.error("Transactions error:", await tRes.text());
        if (!iRes.ok) console.error("Invoices error:", await iRes.text());
        if (!sRes.ok) console.error("Stock error:", await sRes.text());

        const [bData, tData, iData, sData] = await Promise.all([
          bRes.ok ? bRes.json() : null,
          tRes.ok ? tRes.json() : [],
          iRes.ok ? iRes.json() : [],
          sRes.ok ? sRes.json() : [],
        ]);

        if (bData) setBusiness(bData as Business);
        setTransactions(Array.isArray(tData) ? tData : []);
        setInvoices(Array.isArray(iData) ? iData : []);
        setStockItems(Array.isArray(sData) ? sData : []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId, accessToken]);

  // Derived metrics
  const { totalRevenue, monthlyRevenue, pendingInvoices, lowStockItemsCount } =
    useMemo(() => {
      const paidInvoiceAsIncome: Transaction[] = invoices
        .filter((i) => i.status === "paid")
        .map((i) => ({
          id: i.id,
          businessId: i.businessId.toString(),
          amount: i.amount || 0,
          type: "income",
          date: i.dueDate || new Date().toISOString(),
          category: "Invoice",
        }));

      const allIncome = [
        ...transactions.filter(
          (t) => t.type === "income" && typeof t.amount === "number"
        ),
        ...paidInvoiceAsIncome,
      ];

      const totalRevenueVal = allIncome.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      );

      const currentMonth = new Date().getMonth();
      const monthlyRevenueVal = allIncome
        .filter((t) => new Date(t.date).getMonth() === currentMonth)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const pendingInvoicesCount = invoices.filter(
        (i) => i.status === "unpaid" || i.status === "pending"
      ).length;

      const lowStockCount = stockItems.filter(
        (s) => s.quantity < s.minQuantity
      ).length;

      return {
        totalRevenue: totalRevenueVal,
        monthlyRevenue: monthlyRevenueVal,
        pendingInvoices: pendingInvoicesCount,
        lowStockItems: lowStockCount,
      };
    }, [transactions, invoices, stockItems]);

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + (t.amount || 0), 0),
    [transactions]
  );

  // Revenue vs Expenses chart data
  const revenueVsExpenses = useMemo(() => {
    const paidInvoiceAsIncome: Transaction[] = invoices
      .filter((i) => i.status === "paid")
      .map((i) => ({
        id: i.id,
        businessId: i.businessId.toString(),
        amount: i.amount || 0,
        type: "income",
        date: i.dueDate || new Date().toISOString(),
        category: "Invoice",
      }));

    const allItems: { date: string; amount: number; type: "income" | "expense" }[] =
      [...transactions, ...paidInvoiceAsIncome];

    const monthMap: Record<
      string,
      { month: string; revenue: number; expenses: number }
    > = {};

    allItems.forEach((item) => {
      const date = new Date(item.date);
      const monthKey = date.toLocaleString("default", { month: "short" });
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { month: monthKey, revenue: 0, expenses: 0 };
      }
      if (item.type === "income") monthMap[monthKey].revenue += item.amount;
      if (item.type === "expense") monthMap[monthKey].expenses += item.amount;
    });

    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return Object.values(monthMap).sort(
      (a, b) =>
        MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month)
    );
  }, [transactions, invoices]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-transaction":
        setShowTransactionModal(true);
        break;
      case "add-stock":
        setShowStockModal(true);
        break;
      case "generate-invoice":
        onNavigate(`/business/${businessId}/billing/new`);
        break;
      case "view-transactions":
        onNavigate(`/business/${businessId}/transactions`);
        break;
      case "view-stock":
        onNavigate(`/business/${businessId}/stock`);
        break;
      default:
        break;
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-600">
        Loading dashboard...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-red-500">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={`/business/${businessId}`}
        onNavigate={onNavigate}
        businessId={businessId}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } p-8`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header / Breadcrumb */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <Breadcrumb
                items={[
                  { label: "Home", path: "/" },
                  { label: "Businesses", path: "/businesses" },
                  { label: business?.name || "Dashboard" },
                ]}
                onNavigate={onNavigate}
              />
              <div className="flex items-center gap-3 mt-2">
                {business?.logo && (
                  <img
                    src={business.logo}
                    alt="logo"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-[#0B1A33]">
                    {business?.name}
                  </h1>
                  <p className="text-gray-600">{business?.tagline}</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              icon={<SettingsIcon size={20} />}
              onClick={() =>
                onNavigate(`/business/${businessId}/settings`)
              }
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
              value={lowStockItemsCount}
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
              value={`$${totalExpenses.toLocaleString()}`}
              trend={-3.2}
              icon={<DollarSign size={28} />}
              color="from-[#EF5350] to-[#e53935]"
              delay={700}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard
              title="Revenue Over Time"
              data={revenueVsExpenses}
              type="line"
            />
            <ChartCard
              title="Revenue vs Expenses"
              data={revenueVsExpenses}
              type="bar"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#0B1A33] mb-4">
              Quick Actions
            </h3>
            <QuickActionBar onAction={handleQuickAction} />
          </div>

          {/* Timeline Feed */}
          <TimelineFeed activities={revenueVsExpenses} />
        </div>
      </div>

      {/* Transaction Modal (still UI-only; you can wire POST later) */}
      <Modal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        title="Add New Transaction"
        size="md"
      >
        <form className="space-y-4">
          <Input
            label="Description"
            placeholder="Enter transaction description"
            required
          />
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            required
          />
          <div>
            <label className="block text-sm font-medium text-[#0B1A33] mb-2">
              Type
            </label>
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

      {/* Stock Modal (UI-only; hook to /api/stock-items/ if needed) */}
      <Modal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title="Add Stock Item"
        size="md"
      >
        <form className="space-y-4">
          <Input label="Item Name" placeholder="Enter item name" required />
          <Input label="SKU" placeholder="Enter SKU" required />
          <Input
            label="Quantity"
            type="number"
            placeholder="0"
            required
          />
          <Input
            label="Min Quantity"
            type="number"
            placeholder="0"
            required
          />
          <Input
            label="Price"
            type="number"
            placeholder="0.00"
            required
          />
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
