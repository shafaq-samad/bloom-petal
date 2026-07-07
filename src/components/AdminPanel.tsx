import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { 
  BarChart2, ShoppingCart, Archive, Calendar, Tag, MessageSquare, 
  Settings, PenTool, Plus, Edit2, Trash2, Printer, Check, X, AlertTriangle, RefreshCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
interface ProductItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  tags: string[];
  rating: number;
  isBestseller: boolean;
  sizeOptions: string[];
  stock: number;
  lowStockThreshold: number;
}

interface OrderItem {
  product: { _id: string; name: string; price: number; image: string };
  quantity: number;
  selectedSize: string;
}

interface OrderDetails {
  _id: string;
  user: { name: string; email: string } | null;
  items: OrderItem[];
  recipientName: string;
  senderEmail: string;
  deliveryDate: string;
  deliverySlot: "morning" | "afternoon";
  deliveryAddress: string;
  deliveryNote?: string;
  status: "received" | "processing" | "out for delivery" | "delivered";
  subtotal: number;
  discountCode?: string;
  totalAmount: number;
  createdAt: string;
}

interface DiscountCodeItem {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  active: boolean;
  expiresAt: string;
}

interface ReviewItem {
  _id: string;
  product: { _id: string; name: string } | null;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

interface BlogPostItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  publishedAt: string;
}

export default function AdminPanel() {
  const { user, logout } = useAuth();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"dashboard" | "catalog" | "inventory" | "orders" | "discounts" | "reviews" | "blog">("dashboard");

  // Global database states
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [discounts, setDiscounts] = useState<DiscountCodeItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    totalRevenue: 0,
    averageOrderValue: 0,
    totalOrders: 0,
    customerCount: 0,
    repeatPurchaseRate: 0,
    categorySales: {},
    bestSellers: []
  });

  const [loading, setLoading] = useState(true);

  // Forms state controls
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<Partial<DiscountCodeItem> | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPostItem> | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<OrderDetails | null>(null);

  // Calendar filter
  const [calendarDate, setCalendarDate] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    const token = localStorage.getItem("bloom_auth_token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Products
      const prodRes = await fetch(api("/api/products"));
      if (prodRes.ok) setProducts(await prodRes.json());

      // Orders
      const orderRes = await fetch(api("/api/orders"), { headers });
      if (orderRes.ok) setOrders(await orderRes.json());

      // Discounts
      const discRes = await fetch(api("/api/discounts"), { headers });
      if (discRes.ok) setDiscounts(await discRes.json());

      // Reviews
      const revRes = await fetch(api("/api/reviews"), { headers });
      if (revRes.ok) setReviews(await revRes.json());

      // Blog posts
      const blogRes = await fetch(api("/api/blog"));
      if (blogRes.ok) setBlogPosts(await blogRes.json());

      // Analytics
      const analRes = await fetch(api("/api/analytics"), { headers });
      if (analRes.ok) setAnalytics(await analRes.json());

    } catch (error) {
      console.error("Failed to load admin panel data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD Operations handlers ---

  // Products CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("bloom_auth_token");
    const method = editingProduct?._id ? "PUT" : "POST";
    const url = editingProduct?._id ? `/api/products/${editingProduct._id}` : "/api/products";

    const body = {
      ...editingProduct,
      price: Number(editingProduct?.price),
      stock: Number(editingProduct?.stock),
      lowStockThreshold: Number(editingProduct?.lowStockThreshold || 5),
      tags: typeof editingProduct?.tags === "string" 
        ? (editingProduct.tags as string).split(",").map(t => t.trim()) 
        : editingProduct?.tags || []
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to save product", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this composition?")) return;
    const token = localStorage.getItem("bloom_auth_token");
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickStockAdjust = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    const token = localStorage.getItem("bloom_auth_token");
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stock: newStock })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Orders update status
  const handleUpdateOrderStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("bloom_auth_token");
    try {
      const res = await fetch(api(`/api/orders/${id}/status`), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Discounts CRUD
  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("bloom_auth_token");
    const method = editingDiscount?._id ? "PUT" : "POST";
    const url = editingDiscount?._id ? `/api/discounts/${editingDiscount._id}` : "/api/discounts";

    const body = {
      ...editingDiscount,
      discountValue: Number(editingDiscount?.discountValue),
      expiresAt: editingDiscount?.expiresAt ? new Date(editingDiscount.expiresAt) : new Date()
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setEditingDiscount(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    const token = localStorage.getItem("bloom_auth_token");
    try {
      const res = await fetch(api(`/api/discounts/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Reviews approval
  const handleModerateReview = async (id: string, approved: boolean) => {
    const token = localStorage.getItem("bloom_auth_token");
    try {
      const res = await fetch(api(`/api/reviews/${id}/approve`), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approved })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Blog CRUD
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("bloom_auth_token");
    const method = editingPost?._id ? "PUT" : "POST";
    const url = editingPost?._id ? `/api/blog/${editingPost._id}` : "/api/blog";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingPost)
      });
      if (res.ok) {
        setEditingPost(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete this journal post?")) return;
    const token = localStorage.getItem("bloom_auth_token");
    try {
      const res = await fetch(api(`/api/blog/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Printable slip control
  const triggerPrintInvoice = (order: OrderDetails) => {
    setInvoiceOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-brand-cream pt-32 pb-24 flex items-center justify-center text-center px-6">
        <div className="max-w-md bg-white border border-brand-dark/5 p-8 shadow-sm">
          <AlertTriangle className="h-10 w-10 text-brand-burgundy mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-light text-brand-dark">Access Denied</h2>
          <p className="font-body-serif text-sm italic text-brand-dark/60 mt-2">
            You do not possess the required credentials to view the Studio Director dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Helper to filter deliveries for calendar
  const scheduledDeliveries = orders.filter(o => o.deliveryDate === calendarDate);
  const morningDeliveries = scheduledDeliveries.filter(o => o.deliverySlot === "morning");
  const afternoonDeliveries = scheduledDeliveries.filter(o => o.deliverySlot === "afternoon");
  const pendingOrders = orders.filter(o => o.status !== "delivered");
  const lowStockItems = products.filter((product) => product.stock <= (product.lowStockThreshold || 5));
  const nextScheduledDelivery = scheduledDeliveries[0];

  return (
    <div className="min-h-screen bg-brand-cream pt-28 pb-24 text-brand-dark px-6 md:px-12 print:bg-white print:p-0 print:pt-0">
      
      {/* Printable Invoice Container (Visible only in CSS Print queries) */}
      <AnimatePresence>
        {invoiceOrder && (
          <div className="hidden print:block fixed inset-0 bg-white z-50 p-12 text-brand-dark text-xs space-y-8 font-sans">
            {/* Header Invoice slip */}
            <div className="flex justify-between border-b border-brand-dark/10 pb-6">
              <div>
                <h1 className="font-serif text-3xl font-light tracking-wide text-brand-burgundy">Bloom & Petal</h1>
                <p className="text-[9px] text-brand-dark/50 mt-1">Spatial Botany Studio & Gifting</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold uppercase tracking-wider">Acquisition Packing Slip</h2>
                <p className="text-[10px] text-brand-dark/60 mt-1">Order Ref: {invoiceOrder._id.toUpperCase()}</p>
                <p className="text-[10px] text-brand-dark/60">Registered: {new Date(invoiceOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Courier instructions */}
            <div className="grid grid-cols-2 gap-8 border-b border-brand-dark/10 pb-6">
              <div className="space-y-1">
                <h3 className="text-[9px] font-bold uppercase tracking-wider text-brand-sage">Courier Directive</h3>
                <p><strong>Recipient Name:</strong> {invoiceOrder.recipientName}</p>
                <p><strong>Delivery Location:</strong> {invoiceOrder.deliveryAddress}</p>
                <p><strong>Delivery Date Slot:</strong> {invoiceOrder.deliveryDate} ({invoiceOrder.deliverySlot})</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-[9px] font-bold uppercase tracking-wider text-brand-sage">Purchaser Details</h3>
                <p><strong>Sender Email:</strong> {invoiceOrder.senderEmail}</p>
                <p><strong>Status:</strong> {invoiceOrder.status.toUpperCase()}</p>
              </div>
            </div>

            {/* Inscription Card */}
            <div className="bg-brand-cream border border-brand-dark/5 p-4 italic font-serif text-sm">
              <span className="text-[8px] font-bold uppercase tracking-wider font-sans text-brand-sage block mb-1">Linen Card Envelope Script:</span>
              "{invoiceOrder.deliveryNote || "No custom greeting card scripted."}"
            </div>

            {/* Table */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-brand-dark/15 text-left text-[9px] uppercase tracking-wider text-brand-dark/50">
                  <th className="py-2.5">Composition Arrangement</th>
                  <th className="py-2.5">Dimension</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {invoiceOrder.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-brand-dark/5 text-xs">
                    <td className="py-3 font-semibold">{item.product?.name || "Deleted Composition"}</td>
                    <td className="py-3">{item.selectedSize}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">${item.product?.price || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Subtotals */}
            <div className="flex justify-end pt-4">
              <div className="w-64 space-y-1 text-right text-xs">
                <p className="text-brand-dark/60">Subtotal Valuation: ${invoiceOrder.subtotal}</p>
                {invoiceOrder.discountCode && (
                  <p className="text-brand-sage">Promotional Applied: {invoiceOrder.discountCode}</p>
                )}
                <p className="text-lg font-serif font-bold text-brand-burgundy border-t border-brand-dark/10 pt-2">
                  Total Valuation: ${invoiceOrder.totalAmount}
                </p>
              </div>
            </div>

            {/* Footer Slip disclaimer */}
            <div className="border-t border-brand-dark/10 pt-6 text-center text-[9px] text-brand-dark/40 uppercase tracking-widest">
              Thank you for commissioning Bloom & Petal Studio.
            </div>

            <button 
              onClick={() => setInvoiceOrder(null)} 
              className="print:hidden absolute top-4 right-4 bg-brand-dark text-white px-3 py-1.5 font-sans font-bold uppercase tracking-widest text-[9px]"
            >
              Close Print
            </button>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto print:hidden">
        {/* Title and stats refresh */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-dark/10 pb-6 mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-brand-sage uppercase font-sans">
              Admin Dashboard
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-brand-dark mt-1">
              Sales & Order Control
            </h1>
            <p className="text-[10px] text-brand-dark/50 mt-2 max-w-xl">
              Manage products, sales, and fulfillment from one simple dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={fetchAdminData}
              className="flex items-center gap-1.5 px-4 py-2 border border-brand-dark/15 bg-white text-[9px] font-bold uppercase tracking-widest text-brand-dark hover:border-brand-dark transition-colors focus:outline-none w-fit"
            >
              <RefreshCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Database
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 border border-brand-dark/15 bg-brand-burgundy text-[9px] font-bold uppercase tracking-widest text-white hover:bg-brand-dark transition-colors focus:outline-none w-fit"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Workspace layout grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Dashboard Sidebar Tabs */}
          <nav className="flex flex-row lg:flex-col overflow-x-auto gap-1 border-b lg:border-b-0 lg:border-r border-brand-dark/10 pb-4 lg:pb-0 lg:pr-6 scrollbar-none shrink-0 lg:col-span-1">
            {[
              { id: "dashboard", label: "Analytics", icon: BarChart2 },
              { id: "catalog", label: "Bouquets Catalog", icon: ShoppingCart },
              { id: "inventory", label: "Inventory Levels", icon: Archive },
              { id: "orders", label: "Orders Desk & Calendar", icon: Calendar },
              { id: "discounts", label: "Promotional Codes", icon: Tag },
              { id: "reviews", label: "Review Moderation", icon: MessageSquare },
              { id: "blog", label: "Journal Editor", icon: PenTool }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-left transition-colors focus:outline-none shrink-0 ${
                    activeTab === tab.id 
                      ? "text-brand-burgundy border-b-2 lg:border-b-0 lg:border-l-2 border-brand-burgundy font-extrabold bg-white/40" 
                      : "text-brand-dark/50 hover:text-brand-dark"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Main workspace section */}
          <div className="lg:col-span-4 min-h-[500px]">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="h-8 w-8 border-2 border-brand-dark/10 border-t-brand-sage rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn">

                {/* ========================================== */}
                {/* 1. DASHBOARD / ANALYTICS VIEW */}
                {/* ========================================== */}
                {activeTab === "dashboard" && (
                  <div className="space-y-8">
                    <h3 className="font-serif text-2xl font-light text-brand-dark">Sales dashboard</h3>
                    
                    {/* Stats counters */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white border border-brand-dark/5 p-5 shadow-xs">
                        <span className="text-[8px] font-bold text-brand-dark/45 uppercase tracking-widest block mb-1">Total revenue</span>
                        <p className="font-serif text-3xl text-brand-burgundy font-light">${analytics.totalRevenue}</p>
                      </div>
                      <div className="bg-white border border-brand-dark/5 p-5 shadow-xs">
                        <span className="text-[8px] font-bold text-brand-dark/45 uppercase tracking-widest block mb-1">Average Order Value</span>
                        <p className="font-serif text-3xl text-brand-dark font-light">${analytics.averageOrderValue}</p>
                      </div>
                      <div className="bg-white border border-brand-dark/5 p-5 shadow-xs">
                        <span className="text-[8px] font-bold text-brand-dark/45 uppercase tracking-widest block mb-1">Commission Requests</span>
                        <p className="font-serif text-3xl text-brand-dark font-light">{analytics.totalOrders}</p>
                      </div>
                      <div className="bg-white border border-brand-dark/5 p-5 shadow-xs">
                        <span className="text-[8px] font-bold text-brand-dark/45 uppercase tracking-widest block mb-1">Repeat Customer Rate</span>
                        <p className="font-serif text-3xl text-brand-sage font-semibold">{analytics.repeatPurchaseRate}%</p>
                      </div>
                    </div>

                    {/* Quick action and queue grid */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white border border-brand-dark/5 p-5 shadow-xs">
                        <p className="text-[8px] uppercase tracking-[0.2em] text-brand-dark/45 mb-2">Open order queue</p>
                        <p className="font-serif text-3xl text-brand-dark font-light">{pendingOrders.length}</p>
                        <p className="text-[10px] text-brand-dark/60 mt-3">Orders still in progress</p>
                      </div>
                      <div className="bg-white border border-brand-dark/5 p-5 shadow-xs">
                        <p className="text-[8px] uppercase tracking-[0.2em] text-brand-dark/45 mb-2">Low stock alerts</p>
                        <p className="font-serif text-3xl text-brand-burgundy font-light">{lowStockItems.length}</p>
                        <p className="text-[10px] text-brand-dark/60 mt-3">Products hitting reorder threshold</p>
                      </div>
                      <div className="bg-white border border-brand-dark/5 p-5 shadow-xs">
                        <p className="text-[8px] uppercase tracking-[0.2em] text-brand-dark/45 mb-2">Next delivery slot</p>
                        <p className="font-serif text-3xl text-brand-sage font-semibold">
                          {nextScheduledDelivery ? nextScheduledDelivery.deliverySlot : "None"}
                        </p>
                        <p className="text-[10px] text-brand-dark/60 mt-3">
                          {nextScheduledDelivery ? `Due ${nextScheduledDelivery.deliveryDate}` : "No deliveries today"}
                        </p>
                      </div>
                    </div>

                    {/* Graphics grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Top Compositions */}
                      <div className="bg-white border border-brand-dark/5 p-6 space-y-4">
                        <h4 className="font-serif text-lg font-light border-b border-brand-dark/5 pb-2">Top sellers</h4>
                        {analytics.bestSellers.length === 0 ? (
                          <p className="text-xs font-body-serif italic text-brand-dark/45 text-center py-6">No purchase records registered yet.</p>
                        ) : (
                          <div className="space-y-4 pt-2">
                            {analytics.bestSellers.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-3">
                                  <span className="h-5 w-5 bg-brand-blush text-brand-sage border border-brand-dark/5 flex items-center justify-center font-bold text-[10px]">{idx + 1}</span>
                                  <span className="font-medium">{item.name}</span>
                                </div>
                                <span className="font-serif font-bold text-brand-burgundy">{item.quantity} arrangements sold</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Category Sales distributions */}
                      <div className="bg-white border border-brand-dark/5 p-6 space-y-4">
                        <h4 className="font-serif text-lg font-light border-b border-brand-dark/5 pb-2">Sales by category</h4>
                        {Object.keys(analytics.categorySales).length === 0 ? (
                          <p className="text-xs font-body-serif italic text-brand-dark/45 text-center py-6">No sales logs parsed yet.</p>
                        ) : (
                          <div className="space-y-3 pt-2">
                            {Object.entries(analytics.categorySales).map(([cat, val]: any) => (
                              <div key={cat} className="space-y-1">
                                <div className="flex justify-between text-[10px] uppercase font-bold text-brand-dark/60">
                                  <span>{cat}</span>
                                  <span>${val}</span>
                                </div>
                                <div className="h-1.5 w-full bg-brand-blush/60 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-brand-sage" 
                                    style={{ width: `${Math.min(100, (val / (analytics.totalRevenue || 1)) * 100)}%` }} 
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* 2. CATALOG MANAGEMENT VIEW */}
                {/* ========================================== */}
                {activeTab === "catalog" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-2xl font-light text-brand-dark">Arrangement Catalog</h3>
                      <button
                        onClick={() => setEditingProduct({})}
                        className="flex items-center gap-1 bg-brand-dark text-white px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-brand-sage transition-all focus:outline-none shadow-sm"
                      >
                        <Plus className="h-4 w-4" /> Add Composition
                      </button>
                    </div>

                    {/* Add/Edit form overlay */}
                    {editingProduct && (
                      <form onSubmit={handleSaveProduct} className="bg-white border border-brand-dark/10 p-6 space-y-4">
                        <h4 className="font-serif text-lg font-light border-b border-brand-dark/5 pb-2">
                          {editingProduct._id ? "Edit Composition Details" : "Record New Composition"}
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Composition Name</label>
                            <input
                              type="text"
                              required
                              value={editingProduct.name || ""}
                              onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              placeholder="e.g. Composition I: 'Nostalgia & Sage'"
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Base Price ($)</label>
                            <input
                              type="number"
                              required
                              value={editingProduct.price || ""}
                              onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                              placeholder="95"
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Category</label>
                            <select
                              required
                              value={editingProduct.category || ""}
                              onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            >
                              <option value="">Select Category</option>
                              <option value="Signature Bouquets">Signature Bouquets</option>
                              <option value="Moody Elegance">Moody Elegance</option>
                              <option value="Classic White">Classic White</option>
                              <option value="Bohemian Earth">Bohemian Earth</option>
                              <option value="Seasonal Bloom">Seasonal Bloom</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Tags (Comma separated)</label>
                            <input
                              type="text"
                              value={editingProduct.tags ? editingProduct.tags.join(", ") : ""}
                              onChange={e => setEditingProduct({ ...editingProduct, tags: e.target.value as any })}
                              placeholder="Romantic, Pastel, signature"
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Image URL</label>
                            <input
                              type="text"
                              required
                              value={editingProduct.image || ""}
                              onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Stock</label>
                              <input
                                type="number"
                                required
                                value={editingProduct.stock === undefined ? 15 : editingProduct.stock}
                                onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                                className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Low Alert</label>
                              <input
                                type="number"
                                required
                                value={editingProduct.lowStockThreshold === undefined ? 5 : editingProduct.lowStockThreshold}
                                onChange={e => setEditingProduct({ ...editingProduct, lowStockThreshold: Number(e.target.value) })}
                                className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Composition Description</label>
                          <textarea
                            rows={3}
                            required
                            value={editingProduct.description || ""}
                            onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            placeholder="Provide design architectural details..."
                            className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none resize-none"
                          />
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                            className="rounded-none border border-brand-dark/20 px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest text-brand-dark hover:bg-brand-cream focus:outline-none"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-none bg-brand-dark px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-brand-sage focus:outline-none"
                          >
                            Save Composition
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Catalog list */}
                    <div className="bg-white border border-brand-dark/5 p-4 space-y-4">
                      {products.map((p) => (
                        <div 
                          key={p._id}
                          className="flex items-center gap-4 border-b border-brand-dark/5 pb-4 last:border-b-0 last:pb-0"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-16 w-12 object-cover border border-brand-dark/5"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-serif text-base font-light tracking-tight">{p.name}</h4>
                              <span className="font-serif text-sm font-semibold text-brand-burgundy">${p.price}</span>
                            </div>
                            <p className="text-[10px] text-brand-dark/50 uppercase tracking-wider">{p.category} • Stock: {p.stock} units</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-2 border border-brand-dark/10 hover:border-brand-dark text-brand-dark focus:outline-none"
                              aria-label="Edit Composition"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-2 border border-red-200 text-red-700 hover:bg-red-50 focus:outline-none"
                              aria-label="Delete Composition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* 3. INVENTORY LOG VIEW */}
                {/* ========================================== */}
                {activeTab === "inventory" && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-2xl font-light text-brand-dark">Stock Levels Logging</h3>
                    
                    <div className="bg-white border border-brand-dark/5 p-6 overflow-x-auto shadow-xs">
                      <table className="w-full min-w-[600px] border-collapse">
                        <thead>
                          <tr className="border-b border-brand-dark/15 text-left text-[9px] uppercase tracking-wider text-brand-dark/50">
                            <th className="pb-3">Botanical Composition</th>
                            <th className="pb-3">Category</th>
                            <th className="pb-3 text-center">In-Stock Supply</th>
                            <th className="pb-3 text-center">Status</th>
                            <th className="pb-3 text-right">Adjust Level</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p) => {
                            const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
                            const isOut = p.stock === 0;
                            return (
                              <tr key={p._id} className="border-b border-brand-dark/5 last:border-b-0 text-xs">
                                <td className="py-4 font-serif text-sm font-semibold">{p.name}</td>
                                <td className="py-4 text-brand-dark/60">{p.category}</td>
                                <td className="py-4 text-center font-bold">{p.stock}</td>
                                <td className="py-4 text-center">
                                  {isOut && (
                                    <span className="bg-red-50 text-red-700 border border-red-200 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                      Sold Out
                                    </span>
                                  )}
                                  {isLow && (
                                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                      Low stock
                                    </span>
                                  )}
                                  {!isOut && !isLow && (
                                    <span className="bg-green-50 text-green-700 border border-green-200 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                      Normal supply
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 text-right">
                                  <div className="inline-flex items-center border border-brand-dark/10 p-0.5 bg-white">
                                    <button
                                      onClick={() => handleQuickStockAdjust(p._id, p.stock - 1)}
                                      className="px-2 py-0.5 text-brand-dark/60 hover:text-brand-burgundy font-bold text-xs"
                                      disabled={p.stock === 0}
                                    >
                                      -
                                    </button>
                                    <span className="w-8 text-center text-xs font-semibold">{p.stock}</span>
                                    <button
                                      onClick={() => handleQuickStockAdjust(p._id, p.stock + 1)}
                                      className="px-2 py-0.5 text-brand-dark/60 hover:text-brand-burgundy font-bold text-xs"
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* 4. ORDERS DESK & SCHEDULER VIEW */}
                {/* ========================================== */}
                {activeTab === "orders" && (
                  <div className="space-y-8">
                    
                    {/* Delivery Slot Scheduling Section */}
                    <div className="bg-white border border-brand-dark/5 p-6 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-dark/5 pb-3">
                        <div>
                          <h4 className="font-serif text-lg font-light">Delivery Capacity Slot Scheduler</h4>
                          <p className="text-[10px] text-brand-dark/50">See today’s delivery schedule and pending orders at a glance.</p>
                        </div>
                        <input
                          type="date"
                          value={calendarDate}
                          onChange={e => setCalendarDate(e.target.value)}
                          className="mt-2 md:mt-0 rounded-none border border-brand-dark/15 bg-brand-cream px-3 py-1.5 text-xs focus:border-brand-gold focus:outline-none"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Morning Slots */}
                        <div className="bg-brand-cream/40 border border-brand-dark/5 p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-brand-sage">Morning Window (8am - 12pm)</span>
                            <span className="bg-brand-blush px-2 py-0.5 text-[9px] font-bold font-serif">{morningDeliveries.length} orders scheduled</span>
                          </div>
                          {morningDeliveries.length === 0 ? (
                            <p className="text-[11px] font-body-serif italic text-brand-dark/40 py-2">No morning dispatches for this date.</p>
                          ) : (
                            <div className="space-y-2">
                              {morningDeliveries.map(d => (
                                <div key={d._id} className="bg-white p-2.5 border border-brand-dark/5 text-[11px]">
                                  <div className="flex justify-between font-bold">
                                    <span>To: {d.recipientName}</span>
                                    <span className="text-brand-burgundy font-serif">${d.totalAmount}</span>
                                  </div>
                                  <p className="text-[9px] text-brand-dark/50 line-clamp-1 mt-0.5">{d.deliveryAddress}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Afternoon Slots */}
                        <div className="bg-brand-cream/40 border border-brand-dark/5 p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-brand-sage">Afternoon Window (1pm - 5pm)</span>
                            <span className="bg-brand-blush px-2 py-0.5 text-[9px] font-bold font-serif">{afternoonDeliveries.length} orders scheduled</span>
                          </div>
                          {afternoonDeliveries.length === 0 ? (
                            <p className="text-[11px] font-body-serif italic text-brand-dark/40 py-2">No afternoon dispatches for this date.</p>
                          ) : (
                            <div className="space-y-2">
                              {afternoonDeliveries.map(d => (
                                <div key={d._id} className="bg-white p-2.5 border border-brand-dark/5 text-[11px]">
                                  <div className="flex justify-between font-bold">
                                    <span>To: {d.recipientName}</span>
                                    <span className="text-brand-burgundy font-serif">${d.totalAmount}</span>
                                  </div>
                                  <p className="text-[9px] text-brand-dark/50 line-clamp-1 mt-0.5">{d.deliveryAddress}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order desk table */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-2xl font-light text-brand-dark">Order queue</h3>
                      <div className="bg-white border border-brand-dark/5 p-4 overflow-x-auto shadow-xs">
                        <table className="w-full min-w-[700px] border-collapse">
                          <thead>
                            <tr className="border-b border-brand-dark/15 text-left text-[9px] uppercase tracking-wider text-brand-dark/50">
                              <th className="pb-3">Order ID</th>
                              <th className="pb-3">Recipient / Date</th>
                              <th className="pb-3">Total Amount</th>
                              <th className="pb-3">Dispatch Status</th>
                              <th className="pb-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((o) => (
                              <tr key={o._id} className="border-b border-brand-dark/5 last:border-b-0 text-xs">
                                <td className="py-4">
                                  <span className="font-mono text-[10px] font-semibold">{o._id.substring(18).toUpperCase()}</span>
                                  <p className="text-[9px] text-brand-dark/40 block mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="py-4">
                                  <strong>{o.recipientName}</strong>
                                  <p className="text-[10px] text-brand-dark/60 block mt-0.5">{o.deliveryDate} ({o.deliverySlot})</p>
                                </td>
                                <td className="py-4 font-serif text-sm font-semibold text-brand-burgundy">${o.totalAmount}</td>
                                <td className="py-4">
                                  <select
                                    value={o.status}
                                    onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                                    className={`rounded-none border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider focus:outline-none ${
                                      o.status === 'delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                                      o.status === 'out for delivery' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                      o.status === 'processing' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                      'bg-brand-blush border-brand-dark/10 text-brand-sage'
                                    }`}
                                  >
                                    <option value="received">Received</option>
                                    <option value="processing">Processing</option>
                                    <option value="out for delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                  </select>
                                </td>
                                <td className="py-4 text-right">
                                  <button
                                    onClick={() => triggerPrintInvoice(o)}
                                    className="inline-flex items-center gap-1 border border-brand-dark/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-brand-dark hover:border-brand-dark focus:outline-none bg-white transition-colors"
                                  >
                                    <Printer className="h-3.5 w-3.5" /> packing Slip
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

                {/* ========================================== */}
                {/* 5. PROMO CODES VIEW */}
                {/* ========================================== */}
                {activeTab === "discounts" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-2xl font-light text-brand-dark">Promotional Discount Codes</h3>
                      <button
                        onClick={() => setEditingDiscount({})}
                        className="flex items-center gap-1 bg-brand-dark text-white px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-brand-sage transition-all focus:outline-none"
                      >
                        <Plus className="h-4 w-4" /> Create Promo Code
                      </button>
                    </div>

                    {editingDiscount && (
                      <form onSubmit={handleSaveDiscount} className="bg-white border border-brand-dark/10 p-6 space-y-4">
                        <h4 className="font-serif text-lg font-light border-b border-brand-dark/5 pb-2">
                          {editingDiscount._id ? "Edit Promo Code" : "Create New Promotional Coupon"}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Coupon Code (Uppercase)</label>
                            <input
                              type="text"
                              required
                              value={editingDiscount.code || ""}
                              onChange={e => setEditingDiscount({ ...editingDiscount, code: e.target.value.toUpperCase().trim() })}
                              placeholder="VALENTINE25"
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Expiration Date</label>
                            <input
                              type="date"
                              required
                              value={editingDiscount.expiresAt ? editingDiscount.expiresAt.substring(0, 10) : ""}
                              onChange={e => setEditingDiscount({ ...editingDiscount, expiresAt: e.target.value })}
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Discount Type</label>
                            <select
                              required
                              value={editingDiscount.discountType || ""}
                              onChange={e => setEditingDiscount({ ...editingDiscount, discountType: e.target.value as any })}
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            >
                              <option value="">Select Type</option>
                              <option value="percentage">Percentage (%)</option>
                              <option value="fixed">Fixed Price ($)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Discount Value</label>
                            <input
                              type="number"
                              required
                              value={editingDiscount.discountValue || ""}
                              onChange={e => setEditingDiscount({ ...editingDiscount, discountValue: Number(e.target.value) })}
                              placeholder="e.g. 15"
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Active Status</label>
                            <select
                              required
                              value={editingDiscount.active === undefined ? "true" : String(editingDiscount.active)}
                              onChange={e => setEditingDiscount({ ...editingDiscount, active: e.target.value === "true" })}
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            >
                              <option value="true">Active</option>
                              <option value="false">Disabled</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingDiscount(null)}
                            className="rounded-none border border-brand-dark/20 px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest text-brand-dark hover:bg-brand-cream focus:outline-none"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-none bg-brand-dark px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-brand-sage focus:outline-none"
                          >
                            Save Promo Code
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Coupons list table */}
                    <div className="bg-white border border-brand-dark/5 p-4 shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px] border-collapse">
                          <thead>
                            <tr className="border-b border-brand-dark/15 text-left text-[9px] uppercase tracking-wider text-brand-dark/50">
                              <th className="pb-3">Coupon Code</th>
                              <th className="pb-3">Value / Type</th>
                              <th className="pb-3">Expiry Date</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3 text-right">Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {discounts.map((d) => (
                              <tr key={d._id} className="border-b border-brand-dark/5 last:border-b-0 text-xs">
                                <td className="py-4 font-mono font-bold tracking-wider">{d.code}</td>
                                <td className="py-4">
                                  {d.discountType === "percentage" ? `${d.discountValue}% Off` : `$${d.discountValue} Off`}
                                </td>
                                <td className="py-4">{new Date(d.expiresAt).toLocaleDateString()}</td>
                                <td className="py-4">
                                  <span className={`px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider border ${
                                    d.active && new Date(d.expiresAt) > new Date()
                                      ? "bg-green-50 border-green-200 text-green-700"
                                      : "bg-red-50 border-red-200 text-red-700"
                                  }`}>
                                    {d.active && new Date(d.expiresAt) > new Date() ? "Active" : "Expired/Disabled"}
                                  </span>
                                </td>
                                <td className="py-4 text-right">
                                  <button
                                    onClick={() => handleDeleteDiscount(d._id)}
                                    className="text-red-700 hover:text-red-900 p-1 focus:outline-none"
                                    aria-label="Delete Promo"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* 6. REVIEWS MODERATION VIEW */}
                {/* ========================================== */}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-2xl font-light text-brand-dark">Customer Reviews Moderation</h3>
                    
                    <div className="space-y-4">
                      {reviews.length === 0 ? (
                        <p className="text-center font-body-serif italic text-brand-dark/50 bg-white border border-brand-dark/5 p-8">No customer reviews submitted yet.</p>
                      ) : (
                        reviews.map((rev) => (
                          <div 
                            key={rev._id}
                            className="bg-white border border-brand-dark/5 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-xs transition-shadow"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-3">
                                <span className="font-serif text-sm font-semibold">User: {rev.userName} ({rev.userEmail})</span>
                                <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                                  rev.approved ? "bg-green-50 border-green-200 text-green-700" : "bg-amber-50 border-amber-200 text-amber-700"
                                }`}>
                                  {rev.approved ? "Approved" : "Pending moderation"}
                                </span>
                              </div>
                              <p className="text-[10px] text-brand-dark/50 uppercase tracking-wider">
                                Composition: <strong className="font-sans font-bold text-brand-dark">{rev.product?.name || "Deleted Composition"}</strong> • Rating: {rev.rating}/5 Stars
                              </p>
                              <p className="font-body-serif text-xs italic text-brand-dark/80">"{rev.comment}"</p>
                            </div>
                            <div className="flex gap-2">
                              {!rev.approved ? (
                                <button
                                  onClick={() => handleModerateReview(rev._id, true)}
                                  className="flex items-center gap-1 px-4 py-2 border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 text-[9px] font-bold uppercase tracking-widest focus:outline-none"
                                >
                                  <Check className="h-3.5 w-3.5" /> Approve
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleModerateReview(rev._id, false)}
                                  className="flex items-center gap-1 px-4 py-2 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-[9px] font-bold uppercase tracking-widest focus:outline-none"
                                >
                                  <X className="h-3.5 w-3.5" /> Reject/Reject
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* 7. BOTANICAL JOURNAL / BLOG VIEW */}
                {/* ========================================== */}
                {activeTab === "blog" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-2xl font-light text-brand-dark">Botanical Journal list</h3>
                      <button
                        onClick={() => setEditingPost({})}
                        className="flex items-center gap-1 bg-brand-dark text-white px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-brand-sage transition-all focus:outline-none"
                      >
                        <Plus className="h-4 w-4" /> Publish Entry
                      </button>
                    </div>

                    {editingPost && (
                      <form onSubmit={handleSavePost} className="bg-white border border-brand-dark/10 p-6 space-y-4">
                        <h4 className="font-serif text-lg font-light border-b border-brand-dark/5 pb-2">
                          {editingPost._id ? "Edit Journal Entry" : "Publish Botanical Journal Entry"}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Article Title</label>
                            <input
                              type="text"
                              required
                              value={editingPost.title || ""}
                              onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                              placeholder="The Architecture of Asymmetrical Arrangement"
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Author Name / Role</label>
                            <input
                              type="text"
                              required
                              value={editingPost.author || ""}
                              onChange={e => setEditingPost({ ...editingPost, author: e.target.value })}
                              placeholder="Curator Penelope Sterling"
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Cover Image URL</label>
                            <input
                              type="text"
                              required
                              value={editingPost.image || ""}
                              onChange={e => setEditingPost({ ...editingPost, image: e.target.value })}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Excerpt summary</label>
                            <input
                              type="text"
                              required
                              value={editingPost.excerpt || ""}
                              onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                              placeholder="Summary for log tiles catalog..."
                              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Body Content (Markdown format supported)</label>
                          <textarea
                            rows={8}
                            required
                            value={editingPost.content || ""}
                            onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                            placeholder="Write complete article details..."
                            className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none resize-none font-mono"
                          />
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingPost(null)}
                            className="rounded-none border border-brand-dark/20 px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest text-brand-dark hover:bg-brand-cream focus:outline-none"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-none bg-brand-dark px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-brand-sage focus:outline-none"
                          >
                            Publish Entry
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Articles list */}
                    <div className="bg-white border border-brand-dark/5 p-4 space-y-4 shadow-xs">
                      {blogPosts.map((post) => (
                        <div 
                          key={post._id}
                          className="flex items-center gap-4 border-b border-brand-dark/5 pb-4 last:border-b-0 last:pb-0"
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-16 w-24 object-cover border border-brand-dark/5"
                          />
                          <div className="flex-1 space-y-0.5">
                            <h4 className="font-serif text-base font-light tracking-tight">{post.title}</h4>
                            <p className="text-[10px] text-brand-dark/45 uppercase tracking-wider">By {post.author} • {new Date(post.publishedAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingPost(post)}
                              className="p-2 border border-brand-dark/10 hover:border-brand-dark text-brand-dark focus:outline-none"
                              aria-label="Edit Entry"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="p-2 border border-red-200 text-red-700 hover:bg-red-50 focus:outline-none"
                              aria-label="Delete Entry"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
