"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartHeaderIcon() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/checkout" className="p-2 text-brand-text hover:text-brand-neon transition-colors relative" aria-label="Shopping Cart">
      <ShoppingCart size={20} />
      {mounted && totalItems > 0 && (
        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-brand-neon text-brand-bg text-[10px] font-bold flex items-center justify-center animate-fade-in shadow-[0_0_10px_rgba(57,255,20,0.5)]">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
