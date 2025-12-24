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
import { Button } from "../components/Button";
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
  const { totalRevenue, monthlyRevenue, pendingInvoices, lowStockItems } =
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
        className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarOpen ? "ml-72" : "ml-32"
          } p-10`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header / Breadcrumb */}
          <div className="flex items-center justify-between mb-12 animate-fade-in">
            <div className="space-y-3">
              <Breadcrumb
                items={[
                  { label: "Home", path: "/" },
                  { label: "Businesses", path: "/businesses" },
                  { label: business?.name || "Dashboard" },
                ]}
                onNavigate={onNavigate}
              />
              <div className="flex items-center gap-5 mt-4">
                {business?.logo && (
                  <div className="p-1 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <img
                      src={business.logo}
                      alt="logo"
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {business?.name}
                  </h1>
                  <p className="text-slate-500 font-medium text-lg mt-1">{business?.tagline}</p>
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
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
              color="from-blue-600 to-indigo-600"
              delay={0}
            />
            <KPICard
              title="Monthly Revenue"
              value={`$${monthlyRevenue.toLocaleString()}`}
              trend={8.3}
              icon={<TrendingUp size={28} />}
              color="from-emerald-500 to-teal-500"
              delay={100}
            />
            <KPICard
              title="Transactions"
              value={transactions.length}
              trend={5.2}
              icon={<Receipt size={28} />}
              color="from-amber-400 to-orange-500"
              delay={200}
            />
            <KPICard
              title="Pending Invoices"
              value={pendingInvoices}
              icon={<FileText size={28} />}
              color="from-sky-500 to-blue-600"
              delay={300}
            />
          </div>

          {/* Stock & Invoice KPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Stock Alerts"
              value={lowStockItems}
              icon={<AlertTriangle size={28} />}
              color="from-rose-500 to-red-600"
              delay={400}
            />
            <KPICard
              title="Total Invoices"
              value={invoices.length}
              icon={<FileText size={28} />}
              color="from-teal-500 to-emerald-600"
              delay={500}
            />
            <KPICard
              title="Stock Items"
              value={stockItems.length}
              icon={<Package size={28} />}
              color="from-orange-400 to-amber-500"
              delay={600}
            />
            <KPICard
              title="Total Expenses"
              value={`$${totalExpenses.toLocaleString()}`}
              trend={-3.2}
              icon={<DollarSign size={28} />}
              color="from-rose-600 to-red-700"
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


          {/* Timeline Feed */}
          {/* <TimelineFeed activities={revenueVsExpenses} /> */}
        </div>
      </div>

    </div>
  );
};
