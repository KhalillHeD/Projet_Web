import React, { useState, useEffect } from "react";
import { Plus, Search, Package, AlertTriangle, Trash2, Edit3, MinusCircle, PlusCircle } from "lucide-react";
import { Sidebar } from "../layouts/Sidebar";
import { Breadcrumb } from "../layouts/Breadcrumb";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";
import { mockBusinesses } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

interface StockProps {
  businessId: string;
  onNavigate: (path: string) => void;
}

interface DjangoProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  category_name: string;
  is_available: boolean;
  image: string | null;
  quantity?: number;
  initial_quantity: number;
  created_at: string;
  updated_at: string;
}

interface StockItem {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  lastUpdated: string;
}

export const Stock: React.FC<StockProps> = ({ businessId, onNavigate }) => {
  const { accessToken } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<DjangoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!accessToken) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://127.0.0.1:8000/api/products/?business_id=${businessId}&format=json`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        console.error(await res.text());
        throw new Error(`Erreur API: ${res.status}`);
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, accessToken]);

  const handleAddProduct = async (formData: FormData) => {
    if (!accessToken) {
      alert("Not authenticated.");
      return;
    }

    try {
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const price = Number(formData.get("price"));
      const quantity = Number(formData.get("quantity"));
      const categoryName = (formData.get("category_name") as string) || "";

      const existingProduct = products.find(p => p.name.toLowerCase() === name.toLowerCase());

      if (existingProduct) {
        const res = await fetch(
          `http://127.0.0.1:8000/api/products/${existingProduct.id}/?business_id=${businessId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              initial_quantity: existingProduct.initial_quantity + quantity,
              price: price
            }),
          }
        );

        if (!res.ok) {
          console.error(await res.text());
          alert("Error updating product");
          return;
        }
      } else {
        const productData = {
          name,
          description,
          price,
          category_name: categoryName,
          is_available: true,
          initial_quantity: quantity,
        };

        const res = await fetch(
          `http://127.0.0.1:8000/api/products/?business_id=${businessId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(productData),
          }
        );

        if (!res.ok) {
          console.error(await res.text());
          alert("Error creating product");
          return;
        }
      }

      await fetchProducts();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error handling product");
    }
  };

  const handleAdjustQuantity = async (productId: number, adjustment: number) => {
    if (!accessToken) return;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newQuantity = Math.max(0, product.initial_quantity + adjustment);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${productId}/?business_id=${businessId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            initial_quantity: newQuantity
          }),
        }
      );

      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPrice = async (productId: number, newPrice: number) => {
    if (!accessToken) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${productId}/?business_id=${businessId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            price: newPrice
          }),
        }
      );

      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!accessToken) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        await fetchProducts();
      } else {
        alert("Error deleting product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const business = mockBusinesses.find((b) => b.id === businessId);

  const adaptedStockItems: StockItem[] = products.map((product) => ({
    id: product.id.toString(),
    businessId: businessId,
    name: product.name,
    sku: `PROD-${product.id.toString().padStart(4, "0")}`,
    category: product.category_name,
    quantity: product.initial_quantity,
    minQuantity: 5,
    price: parseFloat(product.price),
    lastUpdated: new Date(product.updated_at || product.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }),
  }));

  const filteredItems = adaptedStockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item: StockItem) => {
    if (item.quantity <= 2)
      return {
        label: "Critical",
        color: "from-rose-500 to-red-600",
        bg: "bg-rose-50",
        text: "text-rose-600",
      };
    if (item.quantity < item.minQuantity)
      return {
        label: "Low Stock",
        color: "from-amber-400 to-orange-500",
        bg: "bg-amber-50",
        text: "text-amber-600",
      };
    return {
      label: "Healthy",
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    };
  };

  const lowStockItems = adaptedStockItems.filter(
    (item) => item.quantity < item.minQuantity
  );

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex justify-center items-center text-rose-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={`/business/${businessId}/stock`}
        onNavigate={onNavigate}
        businessId={businessId}
      />

      <div className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarOpen ? "ml-72" : "ml-32"} p-10`}>
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Businesses", path: "/businesses" },
              { label: business?.name || "Dashboard", path: `/business/${businessId}` },
              { label: "Stock Management" },
            ]}
            onNavigate={onNavigate}
          />

          <div className="flex items-center justify-between mt-8 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Stock Management</h1>
              <p className="text-slate-500 font-medium text-lg mt-1">Manage your inventory and stock alerts</p>
            </div>
            <Button
              variant="primary"
              icon={<Plus size={20} />}
              onClick={() => setShowModal(true)}
            >
              Add Stock Item
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Package className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Items</p>
                  <p className="text-3xl font-bold text-slate-900">{adaptedStockItems.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-50 rounded-xl">
                  <AlertTriangle className="text-rose-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Low Stock Alerts</p>
                  <p className="text-3xl font-bold text-rose-600">{lowStockItems.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <DollarSign size={24} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Inventory Value</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    ${adaptedStockItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-10 p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search inventory by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
              />
            </div>
          </Card>

          {/* Stock List */}
          <div className="grid gap-6">
            {filteredItems.map((item, index) => {
              const status = getStockStatus(item);
              return (
                <Card key={item.id} className="p-6 hover:shadow-xl transition-all border-slate-100 group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6 flex-1">
                      <div className={`w-20 h-20 bg-gradient-to-br ${status.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                        <Package size={32} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                          <span className={`${status.bg} ${status.text} px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-slate-500 font-medium text-sm mt-1">
                          SKU: {item.sku} • {item.category}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs font-bold text-slate-400">
                          <Edit3 size={14} />
                          LAST UPDATED: {item.lastUpdated}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="flex items-center gap-6 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-inner">
                        <button
                          onClick={() => handleAdjustQuantity(Number(item.id), -1)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          <MinusCircle size={24} />
                        </button>
                        <div className="text-center min-w-[60px]">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Qty</p>
                          <p className="text-2xl font-black text-slate-800 tracking-tight">{item.quantity}</p>
                        </div>
                        <button
                          onClick={() => handleAdjustQuantity(Number(item.id), 1)}
                          className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          <PlusCircle size={24} />
                        </button>
                      </div>

                      <div className="text-center min-w-[100px]">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-2xl font-black text-blue-600 tracking-tight">${item.price}</p>
                          <button
                            onClick={() => {
                              const val = prompt("New price:", item.price.toString());
                              if (val) handleEditPrice(Number(item.id), parseFloat(val));
                            }}
                            className="p-1.5 text-slate-300 hover:text-blue-500 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(Number(item.id))}
                        className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center">
              <Package size={64} className="text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400">Inventory Empty</h3>
              <p className="text-slate-400 mt-2 font-medium">No items found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Stock Item" size="md">
        <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(new FormData(e.currentTarget)); }} className="space-y-6">
          <Input name="name" label="Item Name" placeholder="e.g. Arabica Roast" required />
          <Input name="description" label="Description" placeholder="Details about the item" required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="category_name" label="Category" placeholder="e.g. Coffee Beans" required />
            <Input name="price" type="number" step="0.01" label="Unit Price ($)" placeholder="0.00" required />
          </div>
          <Input name="quantity" type="number" label="Initial Quantity" placeholder="Current amount in stock" required />
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1 py-4">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 py-4">Add or Update Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const DollarSign: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);
