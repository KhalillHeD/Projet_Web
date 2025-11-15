export interface Business {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  industry: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  businessId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Invoice {
  id: string;
  businessId: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'pending' | 'overdue';
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export interface StockItem {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  price: number;
  category: string;
  lastUpdated: string;
}

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Tech Solutions Inc',
    logo: '💻',
    tagline: 'Innovative software solutions',
    industry: 'Technology',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Green Retail Co',
    logo: '🛒',
    tagline: 'Sustainable shopping experience',
    industry: 'Retail',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Creative Studios',
    logo: '🎨',
    tagline: 'Design and creativity unleashed',
    industry: 'Creative',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Food Delights',
    logo: '🍕',
    tagline: 'Culinary excellence delivered',
    industry: 'Food & Beverage',
    createdAt: '2024-04-05',
  },
  {
    id: '5',
    name: 'Fitness Pro',
    logo: '💪',
    tagline: 'Your health, our priority',
    industry: 'Health & Fitness',
    createdAt: '2024-05-12',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'T001',
    businessId: '1',
    type: 'income',
    amount: 5400,
    description: 'Web development project',
    category: 'Services',
    date: '2024-11-10',
    status: 'completed',
  },
  {
    id: 'T002',
    businessId: '1',
    type: 'expense',
    amount: 1200,
    description: 'Software licenses',
    category: 'Operations',
    date: '2024-11-12',
    status: 'completed',
  },
  {
    id: 'T003',
    businessId: '1',
    type: 'income',
    amount: 3200,
    description: 'Mobile app consultation',
    category: 'Consulting',
    date: '2024-11-13',
    status: 'pending',
  },
  {
    id: 'T004',
    businessId: '1',
    type: 'expense',
    amount: 800,
    description: 'Marketing campaign',
    category: 'Marketing',
    date: '2024-11-14',
    status: 'completed',
  },
  {
    id: 'T005',
    businessId: '1',
    type: 'income',
    amount: 7500,
    description: 'Enterprise solution deployment',
    category: 'Services',
    date: '2024-11-15',
    status: 'completed',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    businessId: '1',
    invoiceNumber: 'INV-2024-001',
    clientName: 'Acme Corporation',
    amount: 5400,
    dueDate: '2024-12-01',
    status: 'paid',
    items: [
      { description: 'Website Design', quantity: 1, price: 2500 },
      { description: 'Frontend Development', quantity: 40, price: 50 },
      { description: 'Backend Integration', quantity: 20, price: 45 },
    ],
    createdAt: '2024-11-10',
  },
  {
    id: 'INV-002',
    businessId: '1',
    invoiceNumber: 'INV-2024-002',
    clientName: 'Global Tech Ltd',
    amount: 3200,
    dueDate: '2024-12-05',
    status: 'unpaid',
    items: [
      { description: 'Mobile App Consultation', quantity: 8, price: 400 },
    ],
    createdAt: '2024-11-13',
  },
  {
    id: 'INV-003',
    businessId: '1',
    invoiceNumber: 'INV-2024-003',
    clientName: 'StartUp Ventures',
    amount: 7500,
    dueDate: '2024-12-10',
    status: 'pending',
    items: [
      { description: 'Enterprise Solution', quantity: 1, price: 5000 },
      { description: 'Training Sessions', quantity: 5, price: 500 },
    ],
    createdAt: '2024-11-15',
  },
  {
    id: 'INV-004',
    businessId: '1',
    invoiceNumber: 'INV-2024-004',
    clientName: 'Metro Services',
    amount: 2100,
    dueDate: '2024-11-20',
    status: 'overdue',
    items: [
      { description: 'Database Optimization', quantity: 1, price: 2100 },
    ],
    createdAt: '2024-10-15',
  },
];

export const mockStockItems: StockItem[] = [
  {
    id: 'S001',
    businessId: '1',
    name: 'Laptop - Dell XPS 15',
    sku: 'DELL-XPS15-001',
    quantity: 15,
    minQuantity: 5,
    price: 1499,
    category: 'Hardware',
    lastUpdated: '2024-11-14',
  },
  {
    id: 'S002',
    businessId: '1',
    name: 'Office Chair - Ergonomic Pro',
    sku: 'CHAIR-ERGO-002',
    quantity: 3,
    minQuantity: 10,
    price: 349,
    category: 'Furniture',
    lastUpdated: '2024-11-13',
  },
  {
    id: 'S003',
    businessId: '1',
    name: 'Monitor - 27" 4K',
    sku: 'MON-4K27-003',
    quantity: 22,
    minQuantity: 8,
    price: 499,
    category: 'Hardware',
    lastUpdated: '2024-11-15',
  },
  {
    id: 'S004',
    businessId: '1',
    name: 'Keyboard - Mechanical RGB',
    sku: 'KB-MECH-004',
    quantity: 8,
    minQuantity: 12,
    price: 129,
    category: 'Accessories',
    lastUpdated: '2024-11-12',
  },
  {
    id: 'S005',
    businessId: '1',
    name: 'Mouse - Wireless Pro',
    sku: 'MS-WIRE-005',
    quantity: 45,
    minQuantity: 15,
    price: 79,
    category: 'Accessories',
    lastUpdated: '2024-11-15',
  },
  {
    id: 'S006',
    businessId: '1',
    name: 'Desk - Standing Electric',
    sku: 'DESK-STAND-006',
    quantity: 2,
    minQuantity: 5,
    price: 699,
    category: 'Furniture',
    lastUpdated: '2024-11-10',
  },
];

export const getMonthlyRevenue = () => {
  return [
    { month: 'Jan', revenue: 12400, expenses: 8200 },
    { month: 'Feb', revenue: 15600, expenses: 9100 },
    { month: 'Mar', revenue: 18900, expenses: 10300 },
    { month: 'Apr', revenue: 16200, expenses: 9800 },
    { month: 'May', revenue: 21500, expenses: 11200 },
    { month: 'Jun', revenue: 19800, expenses: 10600 },
    { month: 'Jul', revenue: 23400, expenses: 12100 },
    { month: 'Aug', revenue: 26700, expenses: 13500 },
    { month: 'Sep', revenue: 24300, expenses: 12800 },
    { month: 'Oct', revenue: 28100, expenses: 14200 },
    { month: 'Nov', revenue: 31200, expenses: 15400 },
    { month: 'Dec', revenue: 29500, expenses: 14800 },
  ];
};

export const getRecentActivity = () => [
  { id: '1', type: 'transaction', message: 'New transaction: Enterprise solution deployment', date: '2024-11-15', icon: '💰' },
  { id: '2', type: 'invoice', message: 'Invoice INV-2024-003 generated for StartUp Ventures', date: '2024-11-15', icon: '📄' },
  { id: '3', type: 'stock', message: 'Stock updated: Monitor - 27" 4K', date: '2024-11-15', icon: '📦' },
  { id: '4', type: 'stock', message: 'Low stock alert: Office Chair - Ergonomic Pro', date: '2024-11-14', icon: '⚠️' },
  { id: '5', type: 'transaction', message: 'New expense: Marketing campaign', date: '2024-11-14', icon: '💳' },
  { id: '6', type: 'invoice', message: 'Invoice INV-2024-001 marked as paid', date: '2024-11-13', icon: '✅' },
];
