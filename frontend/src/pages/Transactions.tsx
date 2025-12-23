import React, { useState, useEffect } from "react";
import { Plus, Search, TrendingUp, TrendingDown } from "lucide-react";
import { Sidebar } from "../layouts/Sidebar";
import { Breadcrumb } from "../layouts/Breadcrumb";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";

interface TransactionsProps {
  businessId: string;
  onNavigate: (path: string) => void;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  status: "completed" | "pending" | "cancelled" | string;
}

export const Transactions: React.FC<TransactionsProps> = ({
  businessId,
  onNavigate,
}) => {
  const { accessToken } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form states
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, accessToken]);

  const fetchTransactions = async () => {
    if (!accessToken) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://127.0.0.1:8000/api/transactions/?business_id=${businessId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Error fetching transactions:", await res.text());
        setError("Unable to load transactions.");
        return;
      }

      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching transactions:", error);
      setError("Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      alert("Not authenticated.");
      return;
    }

    const newTransaction = {
      description,
      amount: Number(amount),
      type,
      category,
      date,
      status: "completed",
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/transactions/?business_id=${businessId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newTransaction),
        }
      );

      if (!res.ok) {
        console.error("Error creating transaction:", await res.text());
        alert("Error creating transaction.");
        return;
      }

      setShowModal(false);
      await fetchTransactions();

      // reset input fields
      setDescription("");
      setAmount("");
      setCategory("");
      setDate("");
    } catch (err) {
      console.error("Error creating transaction:", err);
      alert("Error creating transaction.");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      (t.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (t.category || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success-10 text-success";
      case "pending":
        return "bg-warning-10 text-warning";
      case "cancelled":
        return "bg-[color:var(--error)]/10 text-[color:var(--error)]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading transactions...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={`/business/${businessId}/transactions`}
        onNavigate={onNavigate}
        businessId={businessId}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } p-8`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Businesses", path: "/businesses" },
                { label: "Transactions" },
              ]}
              onNavigate={onNavigate}
            />
            <div className="flex items-center justify-between mt-4">
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                Transactions
              </h1>
              <Button
                variant="primary"
                icon={<Plus size={20} />}
                onClick={() => setShowModal(true)}
              >
                Add Transaction
              </Button>
            </div>
          </div>

          <Card className="mb-6 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[rgba(255,255,255,0.06)]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-3 rounded-xl ${
                    filterType === "all"
                      ? "bg-[color:var(--secondary)] text-white"
                      : "bg-card border-[rgba(255,255,255,0.06)] border-2"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("income")}
                  className={`px-4 py-3 rounded-xl ${
                    filterType === "income"
                      ? "bg-[color:var(--success)] text-white"
                      : "bg-card border-[rgba(255,255,255,0.06)] border-2"
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilterType("expense")}
                  className={`px-4 py-3 rounded-xl ${
                    filterType === "expense"
                      ? "bg-[color:var(--error)] text-white"
                      : "bg-card border-[rgba(255,255,255,0.06)] border-2"
                  }`}
                >
                  Expense
                </button>
              </div>
            </div>
          </Card>

          <div className="grid gap-4">
            {filteredTransactions.map((t, index) => (
              <Card
                key={t.id}
                hover
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        t.type === "income"
                          ? "bg-gradient-to-br from-[color:var(--success)] to-[color:var(--success)]"
                          : "bg-gradient-to-br from-[color:var(--error)] to-[color:var(--error)]"
                      }`}
                    >
                      {t.type === "income" ? (
                        <TrendingUp size={24} className="text-white" />
                      ) : (
                        <TrendingDown size={24} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-[color:var(--text)] text-lg">
                          {t.description}
                        </h3>
                      <p className="text-gray-600 text-sm">
                        {t.category} • {t.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <p className={`text-2xl font-bold ${t.type === "income" ? "text-[color:var(--success)]" : "text-[color:var(--error)]"}`}>
                      ${t.amount}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        t.status
                      )}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-[color:var(--muted)] text-lg">No transactions found</p>
            </Card>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Transaction"
        size="md"
      >
        <form className="space-y-4" onSubmit={handleAddTransaction}>
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-[color:var(--text)] mb-2">
              Type
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border-2 border-[rgba(255,255,255,0.06)]"
              value={type}
              onChange={(e) => setType(e.target.value as "income" | "expense")}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <Input
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1">
              Add Transaction
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
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
