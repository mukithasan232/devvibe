"use client";

import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  isLimited?: boolean;
  isPreOrder?: boolean;
  isComingSoon?: boolean;
  sizes: { size: string; stock: number }[];
}

export default function ProductCard({ id, name, price, imageUrl, category, sizes, isLimited, isPreOrder, isComingSoon }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      productId: id,
      name,
      price,
      size: "M", // Default selection
      quantity: 1,
      category,
      imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group flex flex-col h-full">
      <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden bg-brand-paper border border-brand-card group-hover:border-brand-neon/50 transition-all mb-6 shadow-xl">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {isLimited && (
          <div className="absolute top-6 left-6 z-10 bg-orange-500 text-brand-bg text-[10px] font-black px-3 py-1.5 rounded-xl shadow-2xl uppercase tracking-widest italic">
            Limited
          </div>
        )}

        {isPreOrder && (
          <div className="absolute top-6 left-6 z-10 bg-blue-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-2xl uppercase tracking-widest italic">
            Pre-order
          </div>
        )}

        {isComingSoon && (
          <div className="absolute top-6 left-6 z-10 bg-brand-neon text-brand-bg text-[10px] font-black px-3 py-1.5 rounded-xl shadow-2xl uppercase tracking-widest italic">
            Coming Soon
          </div>
        )}
        
        <div className="absolute inset-0 bg-brand-bg/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="bg-brand-neon text-brand-bg p-5 rounded-2xl shadow-[0_0_30px_rgba(57,255,20,0.4)] transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 active:scale-90"
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check size={28} />
                </motion.div>
              ) : (
                <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <ShoppingBag size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="px-2">
        <p className="text-brand-neon font-black text-[10px] uppercase tracking-[0.3em] mb-2">{category}</p>
        <h3 className="text-white font-black text-xl mb-2 group-hover:text-brand-neon transition-colors truncate tracking-tight">{name}</h3>
        <div className="flex items-center justify-between">
            <p className="text-white/80 font-black text-lg">৳{price}</p>
            <div className="flex gap-1">
                {sizes.map(s => (
                    <span key={s.size} className={`text-[8px] font-bold w-4 h-4 rounded-sm flex items-center justify-center border ${s.stock > 0 ? "border-brand-card text-brand-muted" : "border-red-900/30 text-red-900/30 line-through"}`}>
                        {s.size}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
