/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Filter, 
  Search, 
  ShoppingBag, 
  ChevronDown, 
  X, 
  ArrowUpDown,
  SlidersHorizontal,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";
import ProductCard from "@/components/ProductCard";

interface ProductShape {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stockM: number;
  stockL: number;
  stockXL: number;
  stockXXL: number;
  isPublished: boolean;
  isLimitedEdition: boolean;
  isPreOrder: boolean;
  isComingSoon: boolean;
}

export default function ShopClient() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<ProductShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("latest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Shop Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.isPublished || p.isComingSoon || p.isPreOrder) // Show published items OR teasers
      .filter(p => {
        if (category === "All") return true;
        if (category === "Limited Edition") return p.isLimitedEdition;
        if (category === "Pre-order") return p.isPreOrder;
        if (category === "Coming Soon") return p.isComingSoon;
        return p.category === category;
      })
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0; // Default latest
      });
  }, [products, search, category, sortBy]);

  const categories = ["All", "Solid", "Graphics", "Drop Shoulder", "Limited Edition", "Pre-order", "Coming Soon"];

  return (
    <div className="min-h-screen bg-brand-bg pt-20 pb-20">
      {/* Shop Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 text-brand-muted text-sm mb-4">
           <Link href="/" className="hover:text-brand-neon flex items-center gap-1"><Home size={14} /> Home</Link>
           <span>/</span>
           <span className="text-white">Shop</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Full Collection</h1>
            <p className="text-brand-muted font-medium italic">Compiled for performance. Designed for your lifestyle.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-brand-paper border border-brand-card rounded-2xl pl-12 pr-6 py-4 text-white placeholder-brand-muted w-full md:w-80 focus:outline-none focus:border-brand-neon transition-all"
              />
            </div>
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="bg-brand-paper border border-brand-card p-4 rounded-2xl text-white hover:border-brand-neon transition-all md:hidden"
            >
                <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filter for Desktop */}
          <aside className="hidden md:block w-64 shrink-0 space-y-10">
            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Filter size={18} className="text-brand-neon" /> Categories
              </h3>
              <div className="flex flex-col gap-3">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-left px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                      category === cat 
                        ? "bg-brand-neon text-brand-bg translate-x-1" 
                        : "text-brand-muted hover:text-white hover:bg-brand-card"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <ArrowUpDown size={18} className="text-brand-neon" /> Sort By
              </h3>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-brand-paper border border-brand-card p-4 rounded-2xl text-white w-full appearance-none focus:outline-none focus:border-brand-neon cursor-pointer font-bold text-sm"
              >
                <option value="latest">Latest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="p-6 bg-brand-neon/5 border border-brand-neon/20 rounded-3xl">
                <p className="text-brand-neon font-black text-[10px] uppercase tracking-widest mb-2">Pro Tip</p>
                <p className="text-sm text-brand-muted leading-relaxed">
                    Looking for the latest drops? Filter by <strong>Pre-order</strong> to secure your unit today.
                </p>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/4] bg-brand-paper rounded-3xl animate-pulse" />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40 bg-brand-paper/20 rounded-[40px] border border-brand-card border-dashed">
                <Search size={64} className="text-brand-muted mb-6 opacity-20" />
                <h3 className="text-2xl font-bold text-white mb-2">Zero Matches Found</h3>
                <p className="text-brand-muted">Try adjusting your filters or search keywords.</p>
                <button 
                    onClick={() => { setCategory("All"); setSearch(""); }}
                    className="mt-8 text-brand-neon font-bold hover:underline"
                >
                    Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 sm:gap-10">
                {filteredProducts.map((p, idx) => (
                    <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (idx % 3) * 0.1 }}
                    >
                        <ProductCard
                            id={p.id}
                            name={p.name}
                            price={p.price}
                            imageUrl={p.imageUrl?.split(",")[0] || "/placeholder.jpg"}
                            category={p.category}
                            isLimited={p.isLimitedEdition}
                            isPreOrder={p.isPreOrder}
                            isComingSoon={p.isComingSoon}
                            sizes={[
                                { size: "M", stock: p.stockM },
                                { size: "L", stock: p.stockL },
                                { size: "XL", stock: p.stockXL },
                                { size: "XXL", stock: p.stockXXL },
                            ]}
                        />
                    </motion.div>
                ))}
              </div>
            )}
            
            <div className="mt-20 flex justify-center">
                <p className="text-brand-muted text-sm font-medium">Viewing {filteredProducts.length} unique items</p>
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-brand-bg/90 backdrop-blur-xl p-8 flex flex-col"
            >
                <button onClick={() => setIsFilterOpen(false)} className="self-end p-4 text-white hover:text-brand-neon transition-colors">
                    <X size={32} />
                </button>
                <div className="flex-1 flex flex-col justify-center space-y-12">
                    <div>
                        <h3 className="text-4xl font-black text-white mb-8 border-l-4 border-brand-neon pl-6">Categories</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => { setCategory(cat); setIsFilterOpen(false); }}
                                    className={`p-5 rounded-2xl text-left font-black tracking-tighter text-xl transition-all ${
                                        category === cat ? "bg-brand-neon text-brand-bg" : "bg-brand-paper text-brand-muted"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
