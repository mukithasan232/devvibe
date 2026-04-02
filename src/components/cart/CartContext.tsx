"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
  id: string; // Cart internal ID
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  category?: string; // e.g., "Round Neck"
  imageUrl?: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("devvibe-cart");
    if (!saved) return [];

    try {
      return JSON.parse(saved) as CartItem[];
    } catch {
      localStorage.removeItem("devvibe-cart");
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("devvibe-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  };

  const clearCart = () => setItems([]);

  // Dynamic Automated Pricing Logic: 2 Round Neck for 800 BDT (100 BDT discount per pair)
  const totalAmount = (() => {
    const rawTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const roundNeckCount = items
      .filter(item => item.category === "Round Neck")
      .reduce((sum, item) => sum + item.quantity, 0);
    const comboDiscount = Math.floor(roundNeckCount / 2) * 100;
    return rawTotal - comboDiscount;
  })();

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
