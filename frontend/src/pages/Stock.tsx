import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import { Sidebar } from '../layouts/Sidebar';
import { Breadcrumb } from '../layouts/Breadcrumb';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { mockBusinesses } from '../data/mockData';

interface StockProps {
  businessId: string;
  onNavigate: (path: string) => void;
}

// Interface pour les produits Django
interface DjangoProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  category_name: string;
  is_available: boolean;
  image: string | null;
  created_at: string;
}

// Interface adaptée pour le frontend
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<DjangoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les produits depuis l'API Django
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://127.0.0.1:8000/api/products/?format=json', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Données API reçues:', data);
        
        if (Array.isArray(data)) {
          setProducts(data);
          console.log(`✅ ${data.length} produits chargés`);
        } else {
          console.error('❌ Format inattendu:', data);
          setProducts([]);
        }
        
      } catch (error) {
        console.error('❌ Erreur API:', error);
        setError('Impossible de charger les produits.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); // ⭐ APPEL DE LA FONCTION ⭐
    
  }, []); // ⭐ ACCOLADE FERMANTE DU USEEFFECT ⭐

  const business = mockBusinesses.find((b) => b.id === businessId);
  
  // Adapter les données Django au format attendu par le composant
  const adaptedStockItems: StockItem[] = products.map(product => ({
    id: product.id.toString(),
    businessId: businessId,
    name: product.name,
    sku: `PROD-${product.id.toString().padStart(4, '0')}`,
    category: product.category_name,
    quantity: product.is_available ? Math.floor(Math.random() * 50) + 1 : 0, // Quantité aléatoire pour la démo
    minQuantity: 5,
    price: parseFloat(product.price),
    lastUpdated: new Date(product.created_at).toLocaleDateString('fr-FR')
  }));

  const filteredItems = adaptedStockItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item: StockItem) => {
    const percentage = (item.quantity / item.minQuantity) * 100;
    if (percentage <= 50) return { label: 'Critical', color: 'from-[#EF5350] to-[#e53935]', bg: 'bg-[#EF5350]/10', text: 'text-[#EF5350]' };
    if (percentage <= 100) return { label: 'Low', color: 'from-[#FFA726] to-[#f59518]', bg: 'bg-[#FFA726]/10', text: 'text-[#FFA726]' };
    return { label: 'Good', color: 'from-[#16C47F] to-[#13ad70]', bg: 'bg-[#16C47F]/10', text: 'text-[#16C47F]' };
  };

  const lowStockItems = adaptedStockItems.filter(item => item.quantity < item.minQuantity);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F8FF]">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPath={`/business/${businessId}/stock`}
          onNavigate={onNavigate}
          businessId={businessId}
        />
        <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A6AFF] mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des produits depuis l'API...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F8FF]">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPath={`/business/${businessId}/stock`}
          onNavigate={onNavigate}
          businessId={businessId}
        />
        <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
          <div className="max-w-7xl mx-auto">
            <Card className="bg-[#EF5350]/10 border-2 border-[#EF5350]/20">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-[#EF5350] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-[#0B1A33] mb-2">Erreur de connexion</h3>
                  <p className="text-gray-600 mb-3">{error}</p>
                  <p className="text-sm text-gray-500">
                    Assurez-vous que le serveur Django est démarré sur http://127.0.0.1:8000
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={`/business/${businessId}/stock`}
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
                { label: 'Stock' },
              ]}
              onNavigate={onNavigate}
            />
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-3xl font-bold text-[#0B1A33]">Stock Management</h1>
                <p className="text-gray-600 mt-2">
                  {products.length} produit(s) chargé(s) depuis l'API Django
                </p>
              </div>
              <Button variant="primary" icon={<Plus size={20} />} onClick={() => setShowModal(true)}>
                Add Stock Item
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <p className="text-sm text-gray-600 mb-2">Total Items</p>
              <p className="text-3xl font-bold text-[#0B1A33]">{adaptedStockItems.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-2">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-[#EF5350]">{lowStockItems.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-2">Total Value</p>
              <p className="text-3xl font-bold text-[#16C47F]">
                ${adaptedStockItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
              </p>
            </Card>
          </div>

          {lowStockItems.length > 0 && (
            <Card className="mb-6 bg-[#EF5350]/5 border-2 border-[#EF5350]/20 animate-slide-up">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-[#EF5350] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-[#0B1A33] mb-2">Low Stock Alerts</h3>
                  <p className="text-gray-600 mb-3">The following items are running low on stock:</p>
                  <div className="space-y-2">
                    {lowStockItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
                        <span className="font-medium text-[#0B1A33]">{item.name}</span>
                        <span className="text-[#EF5350]">{item.quantity} left (min: {item.minQuantity})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="mb-6 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search stock items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none"
              />
            </div>
          </Card>

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
                      <div className={`w-16 h-16 bg-gradient-to-br ${status.color} rounded-xl flex items-center justify-center`}>
                        <Package size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#0B1A33] text-lg">{item.name}</h3>
                        <p className="text-gray-600 text-sm">SKU: {item.sku} • {item.category}</p>
                        <p className="text-xs text-gray-500 mt-1">Last updated: {item.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="text-2xl font-bold text-[#0B1A33]">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-lg font-bold text-[#1A6AFF]">${item.price}</p>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Stock Level</span>
                      <span className="font-medium text-[#0B1A33]">{item.quantity} / {item.minQuantity} min</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${status.color} transition-all duration-500`}
                        style={{ width: `${Math.min((item.quantity / item.minQuantity) * 100, 100)}%` }}
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
                {searchTerm ? 'Aucun résultat pour votre recherche.' : 'Aucun produit dans la base de données.'}
              </p>
            </Card>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Stock Item" size="md">
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
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};