import React, { useState, useEffect } from "react";
import { Plus, Search, Package, AlertTriangle } from "lucide-react";
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
  created_at: string;
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
  const [productQuantities, setProductQuantities] = useState<{
    [key: number]: number;
  }>(() => {
    const saved = localStorage.getItem("productQuantities");
    return saved ? JSON.parse(saved) : {};
  });

  const updateProductQuantity = (productId: number, quantity: number) => {
    setProductQuantities((prev) => {
      const newQuantities = { ...prev, [productId]: quantity };
      localStorage.setItem(
        "productQuantities",
        JSON.stringify(newQuantities)
      );
      return newQuantities;
    });
  };

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

      const newProduct = await res.json();
      updateProductQuantity(newProduct.id, quantity);
      await fetchProducts();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error creating product");
    }
  };

  const business = mockBusinesses.find((b) => b.id === businessId);

  const adaptedStockItems: StockItem[] = products.map((product) => ({
    id: product.id.toString(),
    businessId: businessId,
    name: product.name,
    sku: `PROD-${product.id.toString().padStart(4, "0")}`,
    category: product.category_name,
    quantity: productQuantities[product.id] || 10,
    minQuantity: 0,
    price: parseFloat(product.price),
    lastUpdated: new Date(product.created_at).toLocaleDateString("fr-FR"),
  }));

  const filteredItems = adaptedStockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item: StockItem) => {
    const percentage =
      item.minQuantity === 0
        ? 100
        : (item.quantity / item.minQuantity) * 100;
    if (percentage <= 50)
      return {
        label: "Critical",
        color: "from-[#EF5350] to-[#e53935]",
        bg: "bg-[#EF5350]/10",
        text: "text-[#EF5350]",
      };
    if (percentage <= 100)
      return {
        label: "Low",
        color: "from-[#FFA726] to-[#f59518]",
        bg: "bg-[#FFA726]/10",
        text: "text-[#FFA726]",
      };
    return {
      label: "Good",
      color: "from-[#16C47F] to-[#13ad70]",
      bg: "bg-[#16C47F]/10",
      text: "text-[#16C47F]",
    };
  };

  const lowStockItems = adaptedStockItems.filter(
    (item) => item.quantity < item.minQuantity
  );

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={`/business/${businessId}/stock`}
        onNavigate={onNavigate}
        businessId={businessId}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } p-8`}
      >
        <div className="max-w-7xl mx-auto mb-8">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Businesses", path: "/businesses" },
              { label: business?.name || "", path: `/business/${businessId}` },
              { label: "Stock" },
            ]}
            onNavigate={onNavigate}
          />
          <div className="flex items-center justify-between mt-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#0B1A33]">
                Stock Management
              </h1>
              <p className="text-gray-600 mt-2">
                {products.length} produit(s) chargé(s) depuis l&apos;API Django
              </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <p className="text-sm text-gray-600 mb-2">Total Items</p>
              <p className="text-3xl font-bold text-[#0B1A33]">
                {adaptedStockItems.length}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-2">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-[#EF5350]">
                {lowStockItems.length}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-2">Total Value</p>
              <p className="text-3xl font-bold text-[#16C47F]">
                $
                {adaptedStockItems
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toLocaleString()}
              </p>
            </Card>
          </div>

          {/* Low stock alerts */}
          {lowStockItems.length > 0 && (
            <Card className="mb-6 bg-[#EF5350]/5 border-2 border-[#EF5350]/20">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={24}
                  className="text-[#EF5350] flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-bold text-[#0B1A33] mb-2">
                    Low Stock Alerts
                  </h3>
                  <p className="text-gray-600 mb-3">
                    The following items are running low on stock:
                  </p>
                  <div className="space-y-2">
                    {lowStockItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white rounded-lg px-4 py-2"
                      >
                        <span className="font-medium text-[#0B1A33]">
                          {item.name}
                        </span>
                        <span className="text-[#EF5350]">
                          {item.quantity} left (min: {item.minQuantity})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Search */}
          <Card className="mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search stock items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none"
              />
            </div>
          </Card>

          {/* Stock Items */}
          <div className="grid gap-4">
            {filteredItems.map((item, index) => {
              const status = getStockStatus(item);
              return (
                <Card
                  key={item.id}
                  hover
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${status.color} rounded-xl flex items-center justify-center`}
                      >
                        <Package size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#0B1A33] text-lg">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          SKU: {item.sku} • {item.category}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {item.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="text-2xl font-bold text-[#0B1A33]">
                          {item.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-lg font-bold text-[#1A6AFF]">
                          ${item.price}
                        </p>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Stock Level</span>
                      <span className="font-medium text-[#0B1A33]">
                        {item.quantity} / {item.minQuantity} min
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${status.color} transition-all duration-500`}
                        style={{
                          width: `${Math.min(
                            (item.quantity / (item.minQuantity || 1)) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && !loading && (
            <Card className="text-center py-12">
              <Package size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Aucun produit trouvé</p>
              <p className="text-gray-500 text-sm">
                {searchTerm
                  ? "Aucun résultat pour votre recherche."
                  : "Aucun produit dans la base de données."}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Stock Item"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            const qtyRaw = formData.get("quantity") as string;
            const qty = Number(qtyRaw);
            if (Number.isNaN(qty) || qty < 0) {
              alert("Initial quantity must be a non-negative number.");
              return;
            }

            handleAddProduct(formData);
          }}
          className="space-y-4"
        >
          <Input
            name="name"
            label="Item Name"
            placeholder="Enter item name"
            required
          />
          <Input
            name="description"
            label="Description"
            placeholder="Enter description"
            required
          />
          <Input
            name="category_name"
            label="Category"
            placeholder="Enter category"
            required
          />
          <Input
            name="quantity"
            type="number"
            label="Initial Quantity"
            placeholder="0"
            min={0}
            required
          />
          <Input
            name="price"
            type="number"
            label="Price"
            placeholder="0.00"
            step="0.01"
            min={0}
            required
          />
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="success"
              className="flex-1 bg-green-500 text-white py-2 rounded"
            >
              Add Item
            </Button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-2 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
