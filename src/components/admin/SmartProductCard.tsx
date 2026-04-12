"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AlertCircle, Edit, Trash2, Package } from "lucide-react";

interface ProductSize {
  size: "M" | "L" | "XL" | "XXL";
  stock: number;
}

interface ProductProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  isLimited?: boolean;
  isPreOrder?: boolean;
  isComingSoon?: boolean;
  sizes: ProductSize[];
}

export default function SmartProductCard({ product }: { product: ProductProps }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Auto-calculate if any size is below stock threshold
  const lowStockSizes = product.sizes.filter((s) => s.stock < 5);
  const isLowStock = lowStockSizes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-brand-paper border border-brand-card rounded-xl overflow-hidden shadow-lg group"
    >
      {/* Lifecycle Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isLimited && (
          <div className="bg-orange-500 text-brand-bg text-[10px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-tighter italic">
            Limited Edition
          </div>
        )}
        {product.isPreOrder && (
          <div className="bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-tighter italic">
            Pre-order
          </div>
        )}
        {product.isComingSoon && (
          <div className="bg-brand-neon text-brand-bg text-[10px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-tighter italic">
            Coming Soon
          </div>
        )}
      </div>

      {/* Stock Alert Badge */}
      {isLowStock && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3 z-10 bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-sm"
        >
          <AlertCircle size={14} />
          Low Stock ({lowStockSizes.map(s => s.size).join(", ")})
        </motion.div>
      )}

      {/* Image Container with Next.js specific optimizations (WebP by default) */}
      <div className="relative h-60 w-full bg-brand-bg/50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={true}
        />
        
        {/* Quick Admin Actions on Hover */}
        <div className={`absolute inset-0 bg-brand-bg/60 backdrop-blur-sm flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-brand-neon text-brand-bg rounded-lg shadow-lg font-medium"
            title="Edit Product"
          >
            <Edit size={20} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-red-500 text-white rounded-lg shadow-lg font-medium"
            title="Delete Product"
          >
            <Trash2 size={20} />
          </motion.button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-xl font-bold text-brand-neon">৳{product.price}</p>
        </div>

        {/* Dynamic Multi-Size Stock Indicators */}
        <div className="grid grid-cols-4 gap-2">
          {product.sizes.map(({ size, stock }) => (
            <div 
              key={size} 
              className={`flex flex-col items-center justify-center p-2 rounded border ${
                stock === 0 
                  ? "border-red-500/50 bg-red-500/10 text-red-400" 
                  : stock < 5 
                    ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400" 
                    : "border-brand-card bg-brand-bg text-brand-muted"
              }`}
            >
              <span className="text-xs font-bold leading-none mb-1">{size}</span>
              <div className="flex items-center gap-1">
                <Package size={10} />
                <span className="text-xs font-mono">{stock}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
