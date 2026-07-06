import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "../types";
import { useAuth } from "./AuthContext";

export interface PromoCodeDetails {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  wishlist: string[];
  favoriteCount: number;
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  promoCode: PromoCodeDetails | null;
  applyPromo: (code: string) => Promise<{ success: boolean; error?: string }>;
  removePromo: () => void;
  discountAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getProductId = (product: Product) => product.id || (product as any)._id || "";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("bloom_petal_cart");
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      // Remove a known demo/default item if present (prevents a seeded demo product showing by default)
      if (Array.isArray(parsed)) {
        return parsed.filter((it) => getProductId(it.product) !== "prod-1");
      }
      return [];
    } catch (err) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("bloom_petal_wishlist");
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [promoCode, setPromoCode] = useState<PromoCodeDetails | null>(() => {
    const saved = localStorage.getItem("bloom_petal_promo");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("bloom_petal_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("bloom_petal_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // If an admin logs in, clear any cart and prevent cart usage
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      setCart([]);
      setIsCartOpen(false);
      setPromoCode(null);
      localStorage.removeItem("bloom_petal_cart");
      localStorage.removeItem("bloom_petal_promo");
    }
  }, [isAdmin]);

  useEffect(() => {
    if (promoCode) {
      localStorage.setItem("bloom_petal_promo", JSON.stringify(promoCode));
    } else {
      localStorage.removeItem("bloom_petal_promo");
    }
  }, [promoCode]);

  const addToCart = (product: Product, size: string = "Classic") => {
    if (isAdmin) return;

    const productId = getProductId(product);
    if (!productId) return;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => getProductId(item.product) === productId && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }

      return [...prevCart, { product, quantity: 1, selectedSize: size }];
    });
    setIsCartOpen(true); // Automatically slide open cart on add!
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(getProductId(item.product) === productId && item.selectedSize === size))
    );
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        getProductId(item.product) === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => wishlist.includes(productId);

  const toggleCart = () => {
    if (isAdmin) return;
    setIsCartOpen((prev) => !prev);
  };
  const openCart = () => {
    if (isAdmin) return;
    setIsCartOpen(true);
  };
  const closeCart = () => setIsCartOpen(false);
  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favoriteCount = wishlist.length;

  // Deluxe adds +$30, Grandeur adds +$65 to custom pricing
  const cartSubtotal = cart.reduce((total, item) => {
    let priceModifier = 0;
    if (item.selectedSize === "Deluxe") priceModifier = 30;
    if (item.selectedSize === "Grandeur") priceModifier = 65;
    return total + (item.product.price + priceModifier) * item.quantity;
  }, 0);

  // Calculate discount and total amount
  let discountAmount = 0;
  if (promoCode) {
    if (promoCode.discountType === "percentage") {
      discountAmount = Math.round((cartSubtotal * promoCode.discountValue) / 100);
    } else {
      discountAmount = Math.min(promoCode.discountValue, cartSubtotal);
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const applyPromo = async (code: string) => {
    try {
      const response = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (response.ok) {
        setPromoCode({
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue
        });
        return { success: true };
      } else {
        return { success: false, error: data.message || "Invalid coupon code" };
      }
    } catch (err) {
      return { success: false, error: "Network error validating promo" };
    }
  };

  const removePromo = () => {
    setPromoCode(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        wishlist,
        favoriteCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        openCart,
        closeCart,
        clearCart,
        toggleWishlist,
        isFavorite,
        cartCount,
        cartSubtotal,
        cartTotal,
        promoCode,
        applyPromo,
        removePromo,
        discountAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
