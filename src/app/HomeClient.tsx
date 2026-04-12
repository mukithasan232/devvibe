/* eslint-disable react/no-unescaped-entities */
"use client";

import { 
  Leaf, 
  ShieldCheck, 
  Star, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  Package,
  Truck,
  Layers,
  Zap
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import TrustBar from "@/components/TrustBar";
import Link from "next/link";

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
}

export default function HomeClient() {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<ProductShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Home Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart({ 
      productId: product.id, 
      name: product.name, 
      price: product.price, 
      size: "M", 
      quantity: 1, 
      category: product.category, 
      imageUrl: product.imageUrl 
    });
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <div className="flex flex-col bg-brand-bg relative overflow-hidden">
      <TrustBar />

      {/* Hero Section - Lifestyle Overhaul */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/lifestyle/banner.png"
            alt="DevVibe Lifestyle"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
          <div className="max-w-3xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-neon/10 border border-brand-neon/30 mb-8 text-[10px] font-bold text-brand-neon uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-neon opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-neon"></span>
              </span>
              Season 01: The Syntax Drop
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
              COMPILED <br />
              <span className="text-brand-neon">FOR COMFORT.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-brand-muted max-w-xl mb-10 font-medium leading-relaxed">
              Streetwear engineered for the modern developer. <br className="hidden md:block" />
              100% Organic Bio-Washed Cotton. Zero Stiction.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/#shop"
                className="bg-brand-neon text-brand-bg font-black px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(57,255,20,0.3)] flex items-center justify-center gap-2 tracking-tighter"
              >
                {t.heroCta} <ArrowRight size={20} />
              </Link>
              <Link 
                href="/track"
                className="bg-brand-paper/50 backdrop-blur-md border border-brand-card text-white font-bold px-10 py-5 rounded-2xl hover:bg-white hover:text-brand-bg transition-all flex items-center justify-center gap-2"
              >
                Track Order <Truck size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Matrix */}
      <section className="max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8" id="collections">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none mb-4">Shop Categories</h2>
            <p className="text-brand-muted font-medium text-lg">Select your preferred fit and style matrix.</p>
          </div>
          <div className="hidden md:block h-px flex-1 bg-brand-card ml-12 mb-4 opacity-50"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Drop Shoulder", desc: "Relaxed Boxy Fit", img: "/images/solid/5.png" },
            { name: "Graphics Cotton", desc: "Visual Tech Code", img: "/images/graphics/1.png" },
            { name: "Solid Minimalist", desc: "Clean Syntax", img: "/images/solid/7.png" },
          ].map((cat) => (
            <Link 
              key={cat.name} 
              href="/#shop" 
              className="group relative aspect-[3/4] md:h-[600px] rounded-[40px] overflow-hidden border border-brand-card hover:border-brand-neon/50 transition-all shadow-2xl bg-brand-paper"
            >
              <Image 
                src={cat.img} 
                alt={cat.name} 
                fill 
                className="object-contain group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 p-12 md:p-16"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-10 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="h-1.5 w-12 bg-brand-neon mb-6 group-hover:w-full transition-all duration-700 rounded-full"></div>
                <h3 className="text-4xl font-black text-white mb-3 tracking-tighter">{cat.name}</h3>
                <p className="text-brand-neon font-bold text-xs uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-700">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Feed Spotlight */}
      <section id="shop" className="max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8 border-t border-brand-paper">
        <div className="text-center mb-24">
          <p className="text-brand-neon font-black text-xs uppercase tracking-[0.4em] mb-4">Live Drops</p>
          <h2 className="text-7xl font-black text-white tracking-tighter uppercase mb-6">Latest Arrivals</h2>
          <div className="flex justify-center gap-4">
            <div className="h-2 w-32 bg-brand-neon rounded-full shadow-[0_0_15px_rgba(57,255,20,0.5)]" />
            <div className="h-2 w-8 bg-brand-card rounded-full" />
          </div>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1,2,3,4].map(i => <div key={i} className="aspect-[4/5] bg-brand-paper rounded-2xl animate-pulse" />)}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {products.map((p, idx) => (
                <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group flex flex-col"
                >
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-brand-paper border border-brand-card group-hover:border-brand-neon/50 transition-all mb-8 shadow-xl">
                        <Image 
                            src={p.imageUrl?.split(",")[0] || "https://devvibe.com/placeholder.jpg"}
                            alt={p.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-brand-bg/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <button 
                                onClick={() => handleAddToCart(p)}
                                className="bg-brand-neon text-brand-bg p-5 rounded-2xl shadow-[0_0_30px_rgba(57,255,20,0.4)] transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 active:scale-90"
                            >
                                <ShoppingBag size={28} />
                            </button>
                        </div>
                    </div>
                    <div className="px-4">
                        <p className="text-brand-neon font-black text-[10px] uppercase tracking-[0.3em] mb-2">{p.category}</p>
                        <h3 className="text-white font-black text-xl mb-2 group-hover:text-brand-neon transition-colors truncate tracking-tight">{p.name}</h3>
                        <p className="text-white/80 font-black text-lg">৳{p.price}</p>
                    </div>
                </motion.div>
            ))}
            </div>
        )}
      </section>n>

      {/* Tech Spec section */}
      <section className="bg-brand-paper/30 py-32 border-y border-brand-card relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                  <div>
                      <p className="text-brand-neon font-black text-[10px] uppercase tracking-[0.3em] mb-4">Fabric DNA</p>
                      <h2 className="text-5xl font-black text-white tracking-tighter mb-8 leading-tight">HARDWARE <br /> FOR YOUR SKIN.</h2>
                      <div className="space-y-6">
                            <FeatureItem icon={ShieldCheck} title="Bio-Washed Strength" desc="Double washed to eliminate pilling and ensure lifelong softness." />
                            <FeatureItem icon={Zap} title="Breathable Syntax" desc="High air-permeability weave designed for long coding sessions." />
                            <FeatureItem icon={Layers} title="220 GSM Density" desc="The perfect balance between heavyweight durability and comfort." />
                      </div>
                  </div>
                  <div className="relative aspect-square rounded-[40px] overflow-hidden border border-brand-card">
                      <Image 
                        src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800" 
                        alt="Fabric Close-up" 
                        fill 
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      />
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="flex gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center text-brand-neon">
                <Icon size={24} />
            </div>
            <div>
                <h4 className="text-white font-bold text-lg">{title}</h4>
                <p className="text-brand-muted text-sm">{desc}</p>
            </div>
        </div>
    );
}
