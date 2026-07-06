import React, { useState, useEffect } from "react";
import { useAuth, RecipientProfile } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogOut, MapPin, Gift, Clipboard, RefreshCw, 
  CheckCircle, Truck, Package, Clock, Eye, X, Plus, Trash2
} from "lucide-react";

interface OrderProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface OrderItem {
  product: OrderProduct;
  quantity: number;
  selectedSize: string;
}

interface OrderDetails {
  _id: string;
  recipientName: string;
  deliveryDate: string;
  deliverySlot: string;
  deliveryAddress: string;
  deliveryNote?: string;
  status: "received" | "processing" | "out for delivery" | "delivered";
  subtotal: number;
  discountCode?: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function AccountView() {
  const { user, login, register, logout, updateAddresses, updateRecipients } = useAuth();
  
  // Auth Form State
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Orders State
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile forms
  const [newAddress, setNewAddress] = useState("");
  const [newRecipient, setNewRecipient] = useState({ name: "", address: "", deliveryNote: "" });
  const [activeProfileTab, setActiveProfileTab] = useState<"orders" | "addresses" | "recipients">("orders");

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem("bloom_auth_token");
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch order history:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (isLoginTab) {
      const res = await login(authForm.email, authForm.password);
      if (!res.success) setAuthError(res.error || "Authentication failed");
    } else {
      if (!authForm.name) {
        setAuthError("Name is required");
        return;
      }
      const res = await register(authForm.name, authForm.email, authForm.password);
      if (!res.success) setAuthError(res.error || "Registration failed");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    const currentAddresses = user?.savedAddresses || [];
    const updated = [...currentAddresses, newAddress.trim()];
    const success = await updateAddresses(updated);
    if (success) {
      setNewAddress("");
    }
  };

  const handleRemoveAddress = async (indexToRemove: number) => {
    const currentAddresses = user?.savedAddresses || [];
    const updated = currentAddresses.filter((_, idx) => idx !== indexToRemove);
    await updateAddresses(updated);
  };

  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.name.trim() || !newRecipient.address.trim()) return;
    const currentRecipients = user?.savedRecipients || [];
    const updated = [...currentRecipients, {
      name: newRecipient.name.trim(),
      address: newRecipient.address.trim(),
      deliveryNote: newRecipient.deliveryNote.trim() || undefined
    }];
    const success = await updateRecipients(updated);
    if (success) {
      setNewRecipient({ name: "", address: "", deliveryNote: "" });
    }
  };

  const handleRemoveRecipient = async (indexToRemove: number) => {
    const currentRecipients = user?.savedRecipients || [];
    const updated = currentRecipients.filter((_, idx) => idx !== indexToRemove);
    await updateRecipients(updated);
  };

  const getStatusStep = (status: string) => {
    const steps = ["received", "processing", "out for delivery", "delivered"];
    return steps.indexOf(status);
  };

  // If not logged in, show Auth Gate
  if (!user) {
    return (
      <div className="min-h-screen bg-brand-cream pt-32 pb-24 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-brand-dark/5 p-8 shadow-sm">
          {/* Tab buttons */}
          <div className="flex border-b border-brand-dark/10 mb-8">
            <button
              onClick={() => { setIsLoginTab(true); setAuthError(null); }}
              className={`flex-1 pb-3 text-[10px] font-bold uppercase tracking-widest text-center transition-colors focus:outline-none ${
                isLoginTab ? "text-brand-burgundy border-b-2 border-brand-burgundy" : "text-brand-dark/40 hover:text-brand-dark"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLoginTab(false); setAuthError(null); }}
              className={`flex-1 pb-3 text-[10px] font-bold uppercase tracking-widest text-center transition-colors focus:outline-none ${
                !isLoginTab ? "text-brand-burgundy border-b-2 border-brand-burgundy" : "text-brand-dark/40 hover:text-brand-dark"
              }`}
            >
              Create Account
            </button>
          </div>

          <h2 className="font-serif text-3xl font-light text-brand-dark mb-2 text-center">
            {isLoginTab ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="font-body-serif italic text-xs text-brand-dark/50 text-center mb-6">
            {isLoginTab ? "Enter your email and password to sign in." : "Create an account to see your orders and saved addresses."}
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLoginTab && (
              <div>
                <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full rounded-none border border-brand-dark/15 bg-white px-4 py-2.5 text-xs tracking-wide text-brand-dark placeholder-brand-dark/30 focus:border-brand-gold focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full rounded-none border border-brand-dark/15 bg-white px-4 py-2.5 text-xs tracking-wide text-brand-dark placeholder-brand-dark/30 focus:border-brand-gold focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-none border border-brand-dark/15 bg-white px-4 py-2.5 text-xs tracking-wide text-brand-dark placeholder-brand-dark/30 focus:border-brand-gold focus:outline-none transition-colors"
              />
            </div>

            {authError && (
              <div className="text-[10px] font-bold text-center text-brand-burgundy bg-brand-blush/60 border border-brand-burgundy/10 p-2.5">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-none bg-brand-dark py-3.5 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-brand-sage transition-all duration-300 shadow-sm mt-4"
            >
              {isLoginTab ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Logged-in Customer View
  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-24 text-brand-dark px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Profile Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-dark/10 pb-8 mb-12">
          <div>
                <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold tracking-[0.2em] bg-brand-blush px-3 py-1 text-brand-sage uppercase font-sans">
                {user.role === "admin" ? "Admin" : "Your Account"}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-brand-dark mt-2">
              Hello, {user.name}
            </h1>
            <p className="font-body-serif italic text-sm text-brand-dark/50 mt-1">
              Email: {user.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 mt-4 md:mt-0 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-red-700 border border-red-200 hover:bg-red-50 transition-colors focus:outline-none w-fit"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>

        {/* Multi-tab workspace layout */}
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Tabs */}
          <nav className="flex flex-row lg:flex-col border-b lg:border-b-0 lg:border-r border-brand-dark/15 pb-4 lg:pb-0 lg:pr-8 gap-4 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveProfileTab("orders")}
              className={`flex items-center gap-2.5 pb-2 lg:pb-0 lg:py-3.5 px-4 text-left text-[10px] font-bold uppercase tracking-widest transition-all focus:outline-none shrink-0 ${
                activeProfileTab === "orders" ? "text-brand-burgundy border-b-2 lg:border-b-0 lg:border-l-2 border-brand-burgundy font-extrabold bg-white/40" : "text-brand-dark/50 hover:text-brand-dark"
              }`}
            >
              <Clipboard className="h-4 w-4" />
              Orders
            </button>
            <button
              onClick={() => setActiveProfileTab("addresses")}
              className={`flex items-center gap-2.5 pb-2 lg:pb-0 lg:py-3.5 px-4 text-left text-[10px] font-bold uppercase tracking-widest transition-all focus:outline-none shrink-0 ${
                activeProfileTab === "addresses" ? "text-brand-burgundy border-b-2 lg:border-b-0 lg:border-l-2 border-brand-burgundy font-extrabold bg-white/40" : "text-brand-dark/50 hover:text-brand-dark"
              }`}
            >
              <MapPin className="h-4 w-4" />
              Saved Addresses
            </button>
            <button
              onClick={() => setActiveProfileTab("recipients")}
              className={`flex items-center gap-2.5 pb-2 lg:pb-0 lg:py-3.5 px-4 text-left text-[10px] font-bold uppercase tracking-widest transition-all focus:outline-none shrink-0 ${
                activeProfileTab === "recipients" ? "text-brand-burgundy border-b-2 lg:border-b-0 lg:border-l-2 border-brand-burgundy font-extrabold bg-white/40" : "text-brand-dark/50 hover:text-brand-dark"
              }`}
            >
              <Gift className="h-4 w-4" />
              Recipients
            </button>
          </nav>

          {/* Core Panel Content */}
          <div className="lg:col-span-3">
            {/* 1. ORDERS TAB */}
            {activeProfileTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-light text-brand-dark">Orders</h3>
                  <button 
                    onClick={fetchOrders}
                    className="p-2 text-brand-dark/50 hover:text-brand-dark focus:outline-none"
                    aria-label="Refresh orders"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingOrders ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="flex justify-center py-12">
                    <div className="h-6 w-6 border border-brand-dark/20 border-t-brand-sage rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white border border-brand-dark/5 p-8 text-center font-body-serif italic text-brand-dark/50">
                    You have no orders yet. Any purchases you make will show up here.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order._id}
                        className="bg-white border border-brand-dark/5 p-6 hover:shadow-xs transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-serif text-sm font-semibold tracking-wider">
                              Order ID: {order._id.substring(18).toUpperCase()}
                            </span>
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                              order.status === 'delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                              order.status === 'out for delivery' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                              order.status === 'processing' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                              'bg-brand-blush border-brand-dark/10 text-brand-sage'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-brand-dark/60">
                            Deliver to: <strong className="font-sans font-semibold text-brand-dark">{order.recipientName}</strong> on <strong className="font-sans font-semibold text-brand-dark">{order.deliveryDate} ({order.deliverySlot})</strong>
                          </p>
                          <p className="font-serif text-sm font-light text-brand-burgundy">
                            Amount: ${order.totalAmount}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1.5 px-4.5 py-2.5 text-[9px] font-bold uppercase tracking-widest border border-brand-dark/20 text-brand-dark hover:border-brand-dark focus:outline-none transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Track Order
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ADDRESSES TAB */}
            {activeProfileTab === "addresses" && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-light text-brand-dark">Saved Delivery Locations</h3>
                
                {/* Form to add address */}
                <form onSubmit={handleAddAddress} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter absolute address details (e.g. 52 Fifth Ave, New York, NY)"
                    className="flex-1 rounded-none border border-brand-dark/15 bg-white px-4 py-2.5 text-xs tracking-wide text-brand-dark placeholder-brand-dark/30 focus:border-brand-gold focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="rounded-none bg-brand-dark px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-brand-sage transition-all focus:outline-none flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </form>

                {/* List of addresses */}
                {(!user.savedAddresses || user.savedAddresses.length === 0) ? (
                  <div className="bg-white border border-brand-dark/5 p-6 text-center font-body-serif italic text-brand-dark/40">
                    No locations saved yet. Record delivery points for faster booking checks.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {user.savedAddresses.map((addr, idx) => (
                      <div 
                        key={idx}
                        className="bg-white border border-brand-dark/5 px-5 py-4 flex items-center justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-brand-gold mt-0.5 shrink-0" />
                          <span className="text-xs text-brand-dark/80">{addr}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveAddress(idx)}
                          className="text-red-700 hover:text-red-900 p-1 focus:outline-none"
                          aria-label="Delete Address"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. RECIPIENTS TAB */}
            {activeProfileTab === "recipients" && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-light text-brand-dark">Saved Gift Recipients</h3>
                
                {/* Form to add recipient */}
                <form onSubmit={handleAddRecipient} className="bg-white border border-brand-dark/5 p-5 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-sage">Add Recipient Profile</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={newRecipient.name}
                        onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                        placeholder="Penelope Sterling"
                        className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs tracking-wide text-brand-dark placeholder-brand-dark/30 focus:border-brand-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Shipping Address</label>
                      <input
                        type="text"
                        required
                        value={newRecipient.address}
                        onChange={(e) => setNewRecipient({ ...newRecipient, address: e.target.value })}
                        placeholder="52 Fifth Ave, New York, NY"
                        className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs tracking-wide text-brand-dark placeholder-brand-dark/30 focus:border-brand-gold focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Default Note (Optional)</label>
                    <textarea
                      rows={2}
                      value={newRecipient.deliveryNote}
                      onChange={(e) => setNewRecipient({ ...newRecipient, deliveryNote: e.target.value })}
                      placeholder="Write default linen card script greeting..."
                      className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs tracking-wide text-brand-dark placeholder-brand-dark/30 focus:border-brand-gold focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-none bg-brand-dark px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-brand-sage transition-all focus:outline-none flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" /> Save Recipient
                  </button>
                </form>

                {/* List of recipients */}
                {(!user.savedRecipients || user.savedRecipients.length === 0) ? (
                  <div className="bg-white border border-brand-dark/5 p-6 text-center font-body-serif italic text-brand-dark/40">
                    No recipients saved. Record recurring gifting profiles (friends, family, partners).
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {user.savedRecipients.map((rec, idx) => (
                      <div 
                        key={idx}
                        className="bg-white border border-brand-dark/5 p-5 relative space-y-3"
                      >
                        <button
                          onClick={() => handleRemoveRecipient(idx)}
                          className="absolute top-4 right-4 text-red-700 hover:text-red-900 p-1 focus:outline-none"
                          aria-label="Delete Recipient"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <div className="bg-brand-blush p-2 text-brand-sage border border-brand-dark/5">
                            <Gift className="h-4 w-4" />
                          </div>
                          <h4 className="font-serif text-lg font-light">{rec.name}</h4>
                        </div>
                        
                        <p className="text-xs text-brand-dark/70">
                          <strong className="text-[9px] font-sans font-bold text-brand-dark/55 block uppercase tracking-wider mb-0.5">Location:</strong>
                          {rec.address}
                        </p>

                        {rec.deliveryNote && (
                          <p className="text-xs bg-brand-cream/80 border border-brand-dark/5 p-2.5 font-body-serif italic text-brand-dark/75">
                            <strong className="text-[9px] font-sans font-bold text-brand-dark/55 block uppercase tracking-wider not-italic mb-1">Standard Message:</strong>
                            "{rec.deliveryNote}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ORDER TRACKING MODAL BACKDROP */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 z-50 bg-brand-dark/25 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              className="fixed inset-x-6 md:inset-x-auto md:w-full md:max-w-2xl md:left-1/2 md:-translate-x-1/2 top-24 bottom-24 bg-brand-cream border border-brand-dark/10 p-6 z-50 overflow-y-auto flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-brand-dark/5 pb-4 mb-6">
                <div>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-brand-sage">Acquisition Tracking dossier</span>
                  <h3 className="font-serif text-2xl font-light">Order {selectedOrder._id.substring(16).toUpperCase()}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-brand-dark/40 hover:text-brand-dark focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status Tracker Graphic */}
              <div className="bg-white border border-brand-dark/5 p-6 mb-6">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/40 mb-6 text-center">Commission Progression Tracking</h4>
                <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
                  {/* Progress Line */}
                  <div className="absolute left-1/2 md:left-0 md:top-4 h-full md:h-0.5 w-0.5 md:w-full bg-brand-dark/5 z-0" />
                  
                  {/* Stages */}
                  {[
                    { key: "received", label: "Received", icon: Clock },
                    { key: "processing", label: "Processing", icon: Package },
                    { key: "out for delivery", label: "In Transit", icon: Truck },
                    { key: "delivered", label: "Delivered", icon: CheckCircle }
                  ].map((stage, idx) => {
                    const Icon = stage.icon;
                    const isActive = getStatusStep(selectedOrder.status) >= idx;
                    return (
                      <div key={stage.key} className="relative z-10 flex flex-col items-center text-center">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center border transition-all duration-500 ${
                          isActive 
                            ? 'bg-brand-sage border-brand-sage text-white shadow-sm' 
                            : 'bg-brand-cream border-brand-dark/15 text-brand-dark/35'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${
                          isActive ? 'text-brand-sage font-extrabold' : 'text-brand-dark/40'
                        }`}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Directive Detail */}
              <div className="grid md:grid-cols-2 gap-6 mb-6 text-xs text-brand-dark/80 font-body-serif leading-relaxed">
                <div className="bg-white border border-brand-dark/5 p-4 space-y-2">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-brand-sage border-b border-brand-dark/5 pb-1">Delivery details</h4>
                  <p><strong>Recipient:</strong> {selectedOrder.recipientName}</p>
                  <p><strong>Date:</strong> {selectedOrder.deliveryDate} ({selectedOrder.deliverySlot})</p>
                  <p><strong>Location:</strong> {selectedOrder.deliveryAddress}</p>
                </div>
                <div className="bg-white border border-brand-dark/5 p-4 space-y-2">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-brand-sage border-b border-brand-dark/5 pb-1">Botanical Card Message</h4>
                  <p className="italic text-brand-dark/95">
                    {selectedOrder.deliveryNote ? `"${selectedOrder.deliveryNote}"` : "No envelope script registered."}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-white border border-brand-dark/5 p-4 flex-1">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-brand-sage border-b border-brand-dark/5 pb-2 mb-4">Acquisition Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center justify-between border-b border-brand-dark/5 pb-3">
                      <div className="flex gap-3 items-center">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-12 w-9 object-cover border border-brand-dark/5"
                        />
                        <div>
                          <h5 className="font-serif text-sm font-semibold">{item.product.name}</h5>
                          <span className="text-[8px] uppercase tracking-wider text-brand-dark/40">Size: {item.selectedSize}</span>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-bold">Qty: {item.quantity}</p>
                        <p className="text-brand-burgundy font-serif">${item.product.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Financial Summary */}
                <div className="mt-4 pt-3 border-t border-brand-dark/5 text-right space-y-1 text-xs">
                  <p className="text-brand-dark/60">Subtotal: ${selectedOrder.subtotal}</p>
                  {selectedOrder.discountCode && (
                    <p className="text-brand-sage">Discount applied ({selectedOrder.discountCode})</p>
                  )}
                  <p className="font-serif text-base font-bold text-brand-burgundy mt-1">Total: ${selectedOrder.totalAmount}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
