/* eslint-disable react/no-unescaped-entities */
"use client";

import { Leaf, ShieldCheck, Droplet, Star, ShoppingBag, MessageCircle, ArrowRight, Check } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function HomeClient() {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [addedItem, setAddedItem] = useState<string | null>(null);

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
  // Product Schema for SEO
  const productLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: "DevVibe Core Developer T-Shirt",
    image: "https://devvibe.com/product-placeholder.jpg",
    description: "100% Organic Cotton, 180-220 GSM, Bio-washed. Modern dark-themed t-shirts compiled for comfort.",
    brand: {
      "@type": "Brand",
      name: "DevVibe",
    },
    offers: {
      "@type": "Offer",
      url: "https://devvibe.com",
      priceCurrency: "BDT",
      price: "999",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="flex flex-col gap-24 relative pb-24 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-neon/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-card border border-brand-paper mb-8 text-sm text-brand-neon">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-neon opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-neon"></span>
            </span>
            New Drop: The Syntax Collection
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6"
          >
            <span className="block text-brand-neon mb-2">{t.heroSubtitle}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-muted">DevVibe.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-brand-muted max-w-2xl mb-10 font-medium"
          >
            {t.heroTitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#products"
              className="group relative px-8 py-4 bg-brand-neon text-brand-bg font-bold rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t.shopNow} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="#tech-specs"
              className="px-8 py-4 bg-brand-card border border-brand-paper text-white font-medium rounded-lg hover:border-brand-neon transition-all flex items-center justify-center"
            >
              Tech Specs
            </a>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
          <span className="text-brand-neon">{"//"}</span> Featured Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Collection 1 */}
          <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-brand-paper hover:border-brand-neon transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-bg to-brand-card opacity-90 transition-opacity group-hover:opacity-75 z-10" />
            <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
            <div className="relative z-20 h-full flex flex-col justify-end p-8">
              <p className="text-brand-neon font-mono text-sm mb-2">01 — classic</p>
              <h3 className="text-3xl font-bold text-white mb-4">Round Neck</h3>
              <span className="inline-flex items-center text-sm font-medium text-white group-hover:text-brand-neon transition-colors">
                Explore Collection <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
          {/* Collection 2 */}
          <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-brand-paper hover:border-brand-neon transition-colors">
            <div className="absolute inset-0 bg-gradient-to-bl from-brand-bg to-brand-card opacity-90 transition-opacity group-hover:opacity-75 z-10" />
            <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
            <div className="relative z-20 h-full flex flex-col justify-end p-8">
              <p className="text-brand-neon font-mono text-sm mb-2">02 — relaxed</p>
              <h3 className="text-3xl font-bold text-white mb-4">Drop Shoulder</h3>
              <span className="inline-flex items-center text-sm font-medium text-white group-hover:text-brand-neon transition-colors">
                Explore Collection <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Cards */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-brand-neon">{"{"}</span> {t.latestDrops} <span className="text-brand-neon">{"}"}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: "1", name: "Modern Minimalist (Round)", price: 450, category: "Round Neck", gsm: "180 GSM", isPreOrder: false, imageUrl: "/images/minimalist_coding_tshirt_1_1775163939367.png" },
            { id: "2", name: "Source Code Black (Round)", price: 450, category: "Round Neck", gsm: "180 GSM", isPreOrder: false, imageUrl: "/images/minimalist_coding_tshirt_2_1775163955666.png" },
            { id: "3", name: "DevVibe Signature (Round)", price: 450, category: "Round Neck", gsm: "180 GSM", isPreOrder: false, imageUrl: "/images/minimalist_coding_tshirt_3_1775163974471.png" },
            { id: "4", name: "Premium Comfort (Drop)", price: 650, category: "Drop Shoulder", gsm: "220 GSM", isPreOrder: true, releaseDate: "2026-04-10", imageUrl: "/images/solid_color_tshirt_1_1775163992685.png" },
          ].map((product, idx) => (
            <motion.div 
              key={product.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group flex flex-col bg-brand-paper rounded-xl overflow-hidden border border-brand-card hover:border-brand-neon transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)]"
            >
              <div className="relative aspect-[4/5] w-full bg-brand-bg flex items-center justify-center p-4">
                {product.isPreOrder && (
                  <div className="absolute top-4 right-4 z-20 bg-brand-neon text-brand-bg px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    Pre-Order
                  </div>
                )}
                <div className="w-full h-full rounded bg-gradient-to-br from-brand-card to-brand-bg flex items-center justify-center border border-brand-paper relative overflow-hidden">
                  <div className="absolute top-4 left-4 bg-brand-bg/80 text-brand-text text-[10px] px-2 py-1 rounded font-mono">
                    {product.gsm}
                  </div>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  {/* Fallback svg if image fails */}
                  <div className="absolute inset-0 flex items-center justify-center -z-10 bg-brand-paper">
                    <svg className="w-16 h-16 text-brand-card" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 6.04V7v5h-4.04c-.66-2.53-2.92-4.42-5.63-4.5V1H9L2.09 6.84L4 9l1-1v13h14V8l2.97-2.33zM15 14c0 2.22-1.78 4-4 4s-4-1.78-4-4s1.78-4 4-4 4 1.78 4 4z"/>
                    </svg>
                  </div>
                </div>
                  <div className="absolute inset-0 bg-brand-bg/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToCart(product)}
                      className="bg-brand-neon text-brand-bg p-3 rounded-full hover:scale-110 transition-transform relative"
                    >
                      <AnimatePresence mode="wait">
                        {addedItem === product.id ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check size={20} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="cart"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <ShoppingBag size={20} />
                          </motion.div>
                        )
                        }
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-brand-muted text-[10px] font-mono mb-2">{product.category}</div>
                  <h3 className="text-white font-medium mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <span className="text-lg font-bold text-white">৳{product.price}</span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="text-xs font-bold text-brand-neon hover:underline transition-all flex items-center gap-1"
                    >
                      {addedItem === product.id ? <><Check size={14} /> Added</> : (product.isPreOrder ? "Pre-order" : t.shopNow)}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Tech Specs */}
      <section id="tech-specs" className="border-y border-brand-paper bg-brand-paper/30 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Hardware Specifications</h2>
            <p className="text-brand-muted max-w-2xl mx-auto">Engineered like software, built for everyday use.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-brand-card/50 border border-brand-paper">
              <div className="w-14 h-14 bg-brand-bg rounded-xl flex items-center justify-center text-brand-neon mb-6 border border-brand-paper">
                <Leaf size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Organic Cotton</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Source code verified. Breathable, strictly natural materials causing no memory leaks in comfort.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-brand-card/50 border border-brand-paper">
              <div className="w-14 h-14 bg-brand-bg rounded-xl flex items-center justify-center text-brand-neon mb-6 border border-brand-paper">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">180-220 GSM</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Optimal weight for longevity. Thicker density provides better structure and reduces wear over multiple sprints.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-brand-card/50 border border-brand-paper">
              <div className="w-14 h-14 bg-brand-bg rounded-xl flex items-center justify-center text-brand-neon mb-6 border border-brand-paper">
                <Droplet size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Bio-Washed</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Pre-processed and free from bugs. Extremely soft handfeel that won't shrink after the first deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by 500+ Developers</h2>
            <p className="text-brand-muted mb-8 text-sm leading-relaxed">
              Don't just take our word for it. See what the community is pushing to production.
            </p>
            <div className="flex items-center gap-2 text-brand-neon">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
              <span className="text-white font-bold ml-2">4.9/5</span>
            </div>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="bg-brand-paper p-6 rounded-xl border border-brand-card">
              <div className="flex gap-1 text-brand-neon mb-4">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-brand-text text-sm mb-6 leading-relaxed italic">
                "Finally a brand that understands minimalist tech aesthetics. The Drop Shoulder fit is incredible for long coding sessions."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-card flex items-center justify-center font-bold text-brand-neon text-sm">FA</div>
                <div>
                  <div className="text-white text-sm font-bold">Fahim A.</div>
                  <div className="text-brand-muted text-xs">Full-Stack Dev</div>
                </div>
              </div>
            </div>
            <div className="bg-brand-paper p-6 rounded-xl border border-brand-card lg:translate-y-8">
              <div className="flex gap-1 text-brand-neon mb-4">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-brand-text text-sm mb-6 leading-relaxed italic">
                "The fabric quality feels like a premium Macbook casing, but for your body. No lint, super soft."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-card flex items-center justify-center font-bold text-brand-neon text-sm">RI</div>
                <div>
                  <div className="text-white text-sm font-bold">Rahat I.</div>
                  <div className="text-brand-muted text-xs">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fast Checkout Form Section */}
      <section className="bg-brand-bg border-t border-brand-paper py-20 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-paper rounded-2xl p-8 md:p-12 border border-brand-card shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/5 rounded-full blur-[50px]"></div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Quick Checkout API</h2>
              <p className="text-brand-muted text-sm">No bloat, pure speed. Place your order in O(1) time.</p>
            </div>
            
            <form className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-text">Name</label>
                  <input type="text" className="w-full bg-brand-bg border border-brand-card rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="Linus Torvalds" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-text">Phone (/^01[3-9]\d{8}$/)</label>
                  <input type="tel" className="w-full bg-brand-bg border border-brand-card rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="01XXX-XXXXXX" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-text">Address Array</label>
                <textarea rows={3} className="w-full bg-brand-bg border border-brand-card rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-neon transition-colors resize-none" placeholder="House 123, Road 4, Block A..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-text">Size Selection</label>
                <div className="flex gap-4">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <label key={size} className="cursor-pointer">
                      <input type="radio" name="size" className="peer sr-only" defaultChecked={size === 'M'} />
                      <div className="w-12 h-12 rounded-lg bg-brand-bg border border-brand-card flex items-center justify-center text-brand-muted peer-checked:border-brand-neon peer-checked:text-brand-neon peer-checked:bg-brand-neon/10 transition-all">
                        {size}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); router.push('/checkout'); }}
                className="w-full bg-brand-neon text-brand-bg font-bold py-4 rounded-lg hover:bg-[#4ddbb6] transition-colors flex justify-center items-center gap-2"
              >
                Go to Secure Checkout <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Buy Now (Mobile only) */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-brand-paper/95 backdrop-blur-md border-t border-brand-card md:hidden z-40 transform transition-transform">
        <a href="#products" className="w-full bg-brand-neon text-brand-bg font-bold py-3 rounded-lg hover:bg-[#4ddbb6] transition-colors flex justify-center items-center gap-2 shadow-lg">
          Buy Now <ShoppingBag size={18} />
        </a>
      </div>

      {/* WhatsApp Integration Button (Global) */}
      <a 
        href="https://wa.me/8801XXXXXXXXX" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform z-50 flex items-center justify-center group"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={28} />
        {/* Tooltip */}
        <span className="absolute right-full mr-4 bg-brand-paper text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-brand-card pointer-events-none">
          Need support?
        </span>
      </a>

    </div>
  );
}
