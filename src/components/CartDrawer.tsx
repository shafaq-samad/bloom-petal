import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Sparkles, Check, Tag, User, MapPin } from "lucide-react";
import { Product } from "../types";

// Helper to calculate pricing with size options
const getItemPrice = (basePrice: number, size: string) => {
  let modifier = 0;
  if (size === "Deluxe") modifier = 30;
  if (size === "Grandeur") modifier = 65;
  return basePrice + modifier;
};

// --- Subcomponent 1: Cart Items List ---
interface CartItemsListProps {
  cart: any[];
  updateQuantity: (id: string, size: string, qty: number) => void;
  removeFromCart: (id: string, size: string) => void;
  onBrowseClick: () => void;
}

function CartItemsList({ cart, updateQuantity, removeFromCart, onBrowseClick }: CartItemsListProps) {
  if (cart.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center py-20">
        <div className="mb-6 rounded-none bg-brand-blush p-6 text-brand-burgundy border border-brand-dark/5">
          <ShoppingBag className="h-8 w-8 animate-pulse" />
        </div>
        <p className="font-serif text-2xl font-light text-brand-dark">Your Cart is Empty</p>
        <p className="mt-2 text-xs font-body-serif italic text-brand-dark/60 max-w-[240px] leading-relaxed">
          Add a beautiful bouquet to your cart to get started.
        </p>
        <button
          onClick={onBrowseClick}
          className="mt-8 rounded-none border border-brand-dark bg-brand-dark px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-brand-sage hover:border-brand-sage transition-all"
        >
          Browse Collections
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cart.map((item, index) => {
        const actualPrice = getItemPrice(item.product.price, item.selectedSize);
        return (
          <motion.div
            key={`${item.product._id || item.product.id}-${item.selectedSize}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 border-b border-brand-dark/5 pb-5"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              referrerPolicy="no-referrer"
              className="h-24 w-18 object-cover border border-brand-dark/5"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-serif text-lg font-light tracking-tight text-brand-dark">
                    {item.product.name}
                  </h4>
                  <span className="font-serif text-base font-light text-brand-burgundy">
                    ${actualPrice * item.quantity}
                  </span>
                </div>
                <span className="inline-block mt-1 bg-brand-blush/60 px-2.5 py-0.5 text-[8px] font-bold tracking-widest text-brand-dark/60 uppercase">
                  Size: {item.selectedSize}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5 border border-brand-dark/10 bg-white p-0.5">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id || item.product.id, item.selectedSize, item.quantity - 1)
                    }
                    className="p-1 text-brand-dark/60 hover:text-brand-burgundy focus:outline-none"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-brand-dark">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id || item.product.id, item.selectedSize, item.quantity + 1)
                    }
                    className="p-1 text-brand-dark/60 hover:text-brand-burgundy focus:outline-none"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product._id || item.product.id, item.selectedSize)}
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-red-700 hover:text-red-900 transition-colors focus:outline-none"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// --- Subcomponent 2: Authentication Inline Gate ---
interface AuthFormGateProps {
  onSuccess: () => void;
}

function AuthFormGate({ onSuccess }: AuthFormGateProps) {
  const { login, register } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isLoginTab) {
      const res = await login(form.email, form.password);
      if (res.success) onSuccess();
      else setError(res.error || "Login credentials incorrect.");
    } else {
      if (!form.name) {
        setError("Name is required");
        return;
      }
      const res = await register(form.name, form.email, form.password);
      if (res.success) onSuccess();
      else setError(res.error || "Failed to create account.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="border-b border-brand-dark/10 pb-4">
        <p className="text-[9px] font-bold uppercase tracking-widest text-brand-sage">
          Step 2: Your Details
        </p>
        <h4 className="font-serif text-2xl font-light text-brand-dark mt-1">
          Login or Create an Account
        </h4>
        <p className="text-[11px] font-body-serif italic text-brand-dark/60 mt-1">
          Please login or register to continue your order.
        </p>
      </div>

      <div className="flex border-b border-brand-dark/5 gap-4">
        <button
          type="button"
          onClick={() => setIsLoginTab(true)}
          className={`pb-2 text-[9px] font-bold uppercase tracking-widest ${isLoginTab ? 'text-brand-burgundy border-b border-brand-burgundy' : 'text-brand-dark/40'}`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setIsLoginTab(false)}
          className={`pb-2 text-[9px] font-bold uppercase tracking-widest ${!isLoginTab ? 'text-brand-burgundy border-b border-brand-burgundy' : 'text-brand-dark/40'}`}
        >
          Create Profile
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLoginTab && (
          <div>
            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
              placeholder="Penelope Sterling"
            />
          </div>
        )}
        <div>
          <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
            placeholder="curator@botany.com"
          />
        </div>
        <div>
          <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-none border border-brand-dark/15 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="text-[9px] font-bold text-center text-brand-burgundy bg-brand-blush/60 border border-brand-burgundy/10 p-2.5">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-none bg-brand-dark py-3 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-brand-sage transition-all focus:outline-none"
        >
          {isLoginTab ? "Sign In" : "Create Account"}
        </button>
      </form>
    </motion.div>
  );
}

// --- Subcomponent 3: Checkout Details Form ---
interface CheckoutDetailsFormProps {
  formData: {
    recipientName: string;
    deliveryDate: string;
    deliverySlot: "morning" | "afternoon";
    deliveryAddress: string;
    deliveryNote: string;
  };
  formError: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  savedAddresses: string[];
  savedRecipients: any[];
  onSelectSavedRecipient: (rec: any) => void;
  onSelectSavedAddress: (addr: string) => void;
}

function CheckoutDetailsForm({
  formData,
  formError,
  onInputChange,
  onSubmit,
  onBack,
  savedAddresses,
  savedRecipients,
  onSelectSavedRecipient,
  onSelectSavedAddress
}: CheckoutDetailsFormProps) {
  return (
    <motion.form
      id="checkout-details-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <div className="border-b border-brand-dark/10 pb-4">
        <p className="text-[9px] font-bold uppercase tracking-widest text-brand-sage">
          Step 3: Delivery Details
        </p>
        <h4 className="font-serif text-2xl font-light text-brand-dark mt-1">
          Recipient & Delivery
        </h4>
      </div>

      {/* Autopopulate helpers */}
      {savedRecipients.length > 0 && (
        <div className="space-y-1.5">
          <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-sage">Use Saved Gifting Profile</label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                onSelectSavedRecipient(savedRecipients[Number(e.target.value)]);
              }
            }}
            className="w-full rounded-none border border-brand-dark/10 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
            defaultValue=""
          >
            <option value="">-- Select a Saved Recipient --</option>
            {savedRecipients.map((rec, idx) => (
              <option key={idx} value={idx}>{rec.name} ({rec.address.substring(0, 15)}...)</option>
            ))}
          </select>
        </div>
      )}

      {savedAddresses.length > 0 && (
        <div className="space-y-1.5">
          <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-sage">Use Saved Location</label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                onSelectSavedAddress(e.target.value);
              }
            }}
            className="w-full rounded-none border border-brand-dark/10 bg-white px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
            defaultValue=""
          >
            <option value="">-- Select a Saved Address --</option>
            {savedAddresses.map((addr, idx) => (
              <option key={idx} value={addr}>{addr}</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1.5">
            Recipient Name *
          </label>
          <input
            type="text"
            name="recipientName"
            required
            value={formData.recipientName}
            onChange={onInputChange}
            placeholder="e.g., Penelope Sterling"
            className="w-full rounded-none border border-brand-dark/15 bg-white px-4 py-3 text-xs tracking-wide text-brand-dark placeholder-brand-dark/30 focus:border-brand-gold focus:outline-none focus:ring-0 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1.5">
            Delivery Address *
          </label>
          <input
            type="text"
            name="deliveryAddress"
            required
            value={formData.deliveryAddress}
            onChange={onInputChange}
            placeholder="e.g., 52 Fifth Ave, New York, NY"
            className="w-full rounded-none border border-brand-dark/15 bg-white px-4 py-3 text-xs tracking-wide text-brand-dark placeholder-brand-dark/30 focus:border-brand-gold focus:outline-none focus:ring-0 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1.5">
              Delivery Date *
            </label>
            <input
              type="date"
              name="deliveryDate"
              required
              min={new Date().toISOString().split("T")[0]}
              value={formData.deliveryDate}
              onChange={onInputChange}
              className="w-full rounded-none border border-brand-dark/15 bg-white px-4 py-3 text-xs tracking-wide text-brand-dark focus:border-brand-gold focus:outline-none focus:ring-0 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1.5">
              Delivery Window *
            </label>
            <select
              name="deliverySlot"
              required
              value={formData.deliverySlot}
              onChange={onInputChange}
              className="w-full rounded-none border border-brand-dark/15 bg-white px-4 py-3.5 text-xs tracking-wide text-brand-dark focus:border-brand-gold focus:outline-none focus:ring-0 transition-colors"
            >
              <option value="morning">Morning (8am-12pm)</option>
              <option value="afternoon">Afternoon (1pm-5pm)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-dark/60 mb-1.5">
            Gift Message (Optional)
          </label>
          <textarea
            name="deliveryNote"
            rows={3}
            value={formData.deliveryNote}
            onChange={onInputChange}
            placeholder="Write a message for the card..."
            className="w-full rounded-none border border-brand-dark/15 bg-white px-4 py-3 text-xs tracking-wide text-brand-dark placeholder-brand-dark/30 focus:border-brand-gold focus:outline-none focus:ring-0 transition-colors resize-none"
          />
        </div>
      </div>

      <div className="bg-brand-blush/40 p-4 border border-brand-dark/5">
        <p className="flex items-start gap-2.5 text-[10px] font-body-serif italic text-brand-dark/80 leading-relaxed">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-gold mt-0.5" />
          <span>
            Every arrangement is wrapped in protective linen, packed in a secure vase, and hand-delivered by our courier.
          </span>
        </p>
      </div>

      {formError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-bold text-center text-brand-burgundy bg-brand-blush/60 border border-brand-burgundy/10 p-3"
          role="alert"
        >
          {formError}
        </motion.div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-none border border-brand-dark/20 bg-transparent py-4 text-[9px] font-bold uppercase tracking-widest text-brand-dark hover:bg-white hover:border-brand-dark transition-all duration-300"
        >
          Back to Cart
        </button>
        <button
          type="submit"
          className="flex-1 rounded-none border border-brand-dark bg-brand-dark py-4 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-brand-sage hover:border-brand-sage transition-all duration-300"
        >
          Place Order
        </button>
      </div>
    </motion.form>
  );
}

// --- Subcomponent 4: Checkout Success Screen ---
interface OrderSuccessPanelProps {
  formData: any;
  onFinish: () => void;
  orderResult: any;
}

function OrderSuccessPanel({ formData, onFinish, orderResult }: OrderSuccessPanelProps) {
  return (
    <motion.div
      id="order-success-panel"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full flex-col items-center justify-center text-center py-6"
    >
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-sage/10 text-brand-sage border border-brand-sage/20">
        <Check className="h-6 w-6" />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute inset-0 rounded-full border border-brand-sage/35"
        />
      </div>
      
      <h4 className="font-serif text-3xl font-light tracking-tight text-brand-dark">
        Order Confirmed
      </h4>
      <p className="mt-3 text-xs font-body-serif italic text-brand-dark/70 max-w-[260px] leading-relaxed">
        Your order has been placed. A confirmation has been sent to your email.
      </p>

      {orderResult && (
        <div className="mt-8 w-full bg-white p-6 border border-brand-dark/5 text-left space-y-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-brand-sage border-b border-brand-dark/5 pb-2">
            Order Summary
          </p>
          <div className="text-xs space-y-2 text-brand-dark/80 font-body-serif">
            <p>
              <span className="text-brand-dark/40 font-sans font-semibold text-[9px] uppercase tracking-wider block">Order #:</span>{" "}
              <span className="font-mono text-brand-dark text-xs font-semibold">{orderResult._id.toUpperCase()}</span>
            </p>
            <p>
              <span className="text-brand-dark/40 font-sans font-semibold text-[9px] uppercase tracking-wider block">Recipient:</span>{" "}
              <span className="font-sans font-bold text-brand-dark text-xs">{orderResult.recipientName}</span>
            </p>
            <p>
              <span className="text-brand-dark/40 font-sans font-semibold text-[9px] uppercase tracking-wider block">Shipping To:</span>{" "}
              <span className="font-sans text-brand-dark text-xs">{orderResult.deliveryAddress}</span>
            </p>
            <p>
              <span className="text-brand-dark/40 font-sans font-semibold text-[9px] uppercase tracking-wider block">Delivery:</span>{" "}
              <span className="font-sans font-bold text-brand-dark text-xs">{orderResult.deliveryDate} ({orderResult.deliverySlot})</span>
            </p>
            <p>
              <span className="text-brand-dark/40 font-sans font-semibold text-[9px] uppercase tracking-wider block">Order Total:</span>{" "}
              <span className="font-sans font-bold text-brand-burgundy text-xs">${orderResult.totalAmount}</span>
            </p>
          </div>
        </div>
      )}

      <button
        id="finish-checkout-btn"
        onClick={onFinish}
        className="mt-8 w-full rounded-none border border-brand-dark bg-brand-dark py-4 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-brand-sage hover:border-brand-sage transition-all duration-300"
      >
        Return to Studio
      </button>
    </motion.div>
  );
}

// --- Main CartDrawer Wrapper ---
export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartTotal,
    clearCart,
    promoCode,
    applyPromo,
    removePromo,
    discountAmount
  } = useCart();

  const { user, token } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "auth" | "details" | "success">("cart");
  const [formData, setFormData] = useState({
    recipientName: "",
    deliveryDate: "",
    deliverySlot: "morning" as "morning" | "afternoon",
    deliveryAddress: "",
    deliveryNote: "",
  });

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleProceedClick = () => {
    if (!user) {
      setCheckoutStep("auth");
    } else {
      setCheckoutStep("details");
    }
  };

  const handleApplyPromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoInput.trim()) return;
    const res = await applyPromo(promoInput);
    if (res.success) {
      setPromoInput("");
    } else {
      setPromoError(res.error || "Failed to validate coupon");
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.deliveryDate || !formData.deliveryAddress) {
      setFormError("Please fill out all required delivery fields.");
      return;
    }

    try {
      const itemsPayload = cart.map(item => ({
        id: item.product._id || item.product.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: itemsPayload,
          recipientName: formData.recipientName,
          deliveryDate: formData.deliveryDate,
          deliverySlot: formData.deliverySlot,
          deliveryAddress: formData.deliveryAddress,
          deliveryNote: formData.deliveryNote,
          discountCode: promoCode?.code
        })
      });

      const data = await res.json();
      if (res.ok) {
        setOrderResult(data);
        setCheckoutStep("success");
      } else {
        setFormError(data.message || "Failed to place your order.");
      }
    } catch (err) {
      setFormError("A network error occurred. Please try again.");
    }
  };

  const resetDrawer = () => {
    setCheckoutStep("cart");
    setFormData({ recipientName: "", deliveryDate: "", deliverySlot: "morning", deliveryAddress: "", deliveryNote: "" });
    setOrderResult(null);
    clearCart();
    closeCart();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Blur Glass Screen Backdrop */}
          <motion.div
            id="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-brand-dark/20 backdrop-blur-xs"
          />

          {/* Drawer Sidebar Panel */}
          <motion.div
            id="cart-drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex h-full w-full max-w-md flex-col bg-brand-cream shadow-2xl border-l border-brand-dark/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-dark/5 p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-brand-dark/70" />
                <h3 className="font-serif text-2xl font-light tracking-tight text-brand-dark">
                  Your Cart
                </h3>
              </div>
              <button
                id="close-cart-btn"
                onClick={closeCart}
                className="p-2 text-brand-dark/40 hover:text-brand-dark transition-colors focus:outline-none"
                aria-label="Close cart sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Interactive Screen Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
              {checkoutStep === "cart" && (
                <CartItemsList
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  onBrowseClick={closeCart}
                />
              )}

              {checkoutStep === "auth" && (
                <AuthFormGate
                  onSuccess={() => setCheckoutStep("details")}
                />
              )}

              {checkoutStep === "details" && (
                <CheckoutDetailsForm
                  formData={formData}
                  formError={formError}
                  onInputChange={handleInputChange}
                  onSubmit={handleCheckoutSubmit}
                  onBack={() => setCheckoutStep("cart")}
                  savedAddresses={user?.savedAddresses || []}
                  savedRecipients={user?.savedRecipients || []}
                  onSelectSavedRecipient={(rec) => setFormData(prev => ({
                    ...prev,
                    recipientName: rec.name,
                    deliveryAddress: rec.address,
                    deliveryNote: rec.deliveryNote || ""
                  }))}
                  onSelectSavedAddress={(addr) => setFormData(prev => ({
                    ...prev,
                    deliveryAddress: addr
                  }))}
                />
              )}

              {checkoutStep === "success" && (
                <OrderSuccessPanel
                  formData={formData}
                  onFinish={resetDrawer}
                  orderResult={orderResult}
                />
              )}
            </div>

            {/* Sticky Pricing Summary Footer */}
            {cart.length > 0 && checkoutStep === "cart" && (
              <div className="border-t border-brand-dark/5 bg-white p-6 space-y-4">
                
                {/* Promo Code Input block */}
                <div className="border-b border-brand-dark/5 pb-3">
                  {promoCode ? (
                    <div className="flex items-center justify-between bg-green-50/50 border border-green-200 p-2.5 text-xs text-green-700">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5" />
                        <span>Code Applied: <strong>{promoCode.code}</strong> ({promoCode.discountType === 'percentage' ? `${promoCode.discountValue}%` : `$${promoCode.discountValue}`})</span>
                      </div>
                      <button 
                        onClick={removePromo}
                        className="text-[9px] font-bold uppercase tracking-wider text-red-700 hover:text-red-900 focus:outline-none"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromoSubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={e => setPromoInput(e.target.value)}
                        placeholder="Promo Code (VALENTINE20)"
                        className="flex-1 rounded-none border border-brand-dark/15 px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-none bg-brand-dark hover:bg-brand-sage text-white px-4 py-2 text-[9px] font-bold uppercase tracking-widest focus:outline-none"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoError && <p className="text-[9px] text-red-700 font-semibold mt-1">{promoError}</p>}
                </div>

                {/* Subtotals & total calculations */}
                <div className="space-y-1.5 text-brand-dark">
                  <div className="flex items-center justify-between text-xs text-brand-dark/60">
                    <span className="font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="font-semibold font-serif">${cartSubtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-xs text-green-700 font-semibold">
                      <span className="uppercase tracking-widest">Discount Applied</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-brand-dark/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60">
                      Total
                    </span>
                    <span className="font-serif text-2xl font-light text-brand-burgundy">
                      ${cartTotal}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] font-body-serif italic text-brand-dark/50 leading-relaxed">
                  Shipping and taxes will be calculated at the next step.
                </p>
                <button
                  id="proceed-to-checkout-btn"
                  onClick={handleProceedClick}
                  className="flex w-full items-center justify-center gap-2 rounded-none bg-brand-dark py-4 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-brand-sage transition-all duration-300 shadow-sm"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
