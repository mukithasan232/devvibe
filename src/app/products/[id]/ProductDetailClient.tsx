"use client";

import { useState } from "react";
import { 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  Check,
  Star,
  Info
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

export default function ProductDetailClient({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [mainImage, setMainImage] = useState(product.imageUrl?.split(",")[0] || "/placeholder.jpg");

  const images = product.imageUrl?.split(",") || ["/placeholder.jpg"];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size to continue.");
      return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      category: product.category,
      imageUrl: images[0]
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const sizes = [
    { label: "M", stock: product.stockM },
    { label: "L", stock: product.stockL },
    { label: "XL", stock: product.stockXL },
    { label: "XXL", stock: product.stockXXL },
  ];

  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-brand-muted hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="translate-x-0 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest font-mono">Return to Matrix</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Galaxy */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[3/4] rounded-[40px] overflow-hidden border border-brand-card shadow-2xl bg-brand-paper"
            >
              <Image 
                src={mainImage} 
                alt={product.name} 
                fill 
                className="object-contain p-6 md:p-12"
                priority
              />
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                 <span className="bg-brand-neon/10 backdrop-blur-md border border-brand-neon/30 text-brand-neon px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg w-fit">
                    {product.category}
                 </span>
                {product.isLimitedEdition && (
                  <div className="bg-orange-500 text-brand-bg px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest italic shadow-2xl w-fit">
                    Limited Edition
                  </div>
                )}
                {product.isPreOrder && (
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest italic shadow-2xl w-fit">
                    Pre-order
                  </div>
                )}
                {product.isComingSoon && (
                  <div className="bg-brand-neon text-brand-bg px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest italic shadow-2xl w-fit">
                    Coming Soon
                  </div>
                )}
              </div>
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
               {images.map((img: string, i: number) => (
                 <button 
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${mainImage === img ? 'border-brand-neon scale-105 shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'border-brand-card opacity-50 hover:opacity-100'}`}
                 >
                   <Image src={img} alt={`View ${i}`} fill className="object-contain p-2" />
                 </button>
               ))}
            </div>
          </div>

          {/* Intel & Configuration */}
          <div className="flex flex-col">
             <div className="mb-8 overflow-hidden">
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-brand-neon font-black text-xs uppercase tracking-[0.4em] mb-4"
                >
                  Authentic Apparel // {product.id.slice(-6).toUpperCase()}
                </motion.p>
                <motion.h1 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-tight mb-4 italic"
                >
                  {product.name}
                </motion.h1>
                <div className="flex items-center gap-4">
                   <div className="flex text-brand-neon gap-0.5">
                      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                   </div>
                   <span className="text-brand-muted text-xs font-bold uppercase tracking-widest">(4.9 Internal Rating)</span>
                </div>
             </div>

             <div className="bg-brand-paper rounded-3xl border border-brand-card p-8 mb-10 shadow-xl">
                <p className="text-4xl font-black text-white italic tracking-tighter mb-8 flex items-end gap-2">
                   ৳{product.price.toLocaleString()}
                   <span className="text-xs text-brand-muted not-italic font-mono uppercase tracking-widest mb-1.5 opacity-50">Incl. VAT</span>
                </p>

                <div className="space-y-8">
                   <div>
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Select Fitment Matrix</span>
                         <span className="text-[10px] font-black text-brand-neon uppercase tracking-[0.2em] border-b border-brand-neon cursor-pointer">Size Guide</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                         {sizes.map((s) => (
                            <button
                               key={s.label}
                               onClick={() => s.stock > 0 && setSelectedSize(s.label)}
                               disabled={s.stock === 0}
                               className={`py-4 rounded-xl font-black text-sm transition-all border flex flex-col items-center gap-1 ${
                                 selectedSize === s.label 
                                 ? 'bg-brand-neon text-brand-bg border-brand-neon shadow-[0_0_20px_rgba(57,255,20,0.3)]' 
                                 : s.stock > 0 
                                 ? 'bg-brand-bg text-white border-brand-card hover:border-brand-neon/50' 
                                 : 'bg-brand-bg/50 text-brand-muted border-brand-card opacity-30 cursor-not-allowed'
                               }`}
                            >
                               {s.label}
                               <span className="text-[8px] opacity-60 uppercase">{s.stock > 0 ? 'In Stock' : 'Empty'}</span>
                            </button>
                         ))}
                      </div>
                   </div>

                   <button 
                    onClick={handleAddToCart}
                    disabled={added || product.isComingSoon}
                    className={`w-full py-6 rounded-2xl flex items-center justify-center gap-4 transition-all overflow-hidden relative ${product.isComingSoon ? 'bg-brand-paper cursor-not-allowed opacity-50' : added ? 'bg-green-500 scale-95' : 'bg-brand-neon hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(57,255,20,0.2)]'}`}
                   >
                     <AnimatePresence mode="wait">
                       {product.isComingSoon ? (
                         <motion.div key="coming" initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center gap-3 text-brand-muted font-black uppercase tracking-widest italic">
                            <Layers size={20} /> Teaser: Coming Soon
                         </motion.div>
                       ) : added ? (
                         <motion.div 
                          key="added"
                          initial={{ y: 20 }} animate={{ y: 0 }}
                          className="flex items-center gap-2 text-brand-bg font-black uppercase tracking-widest italic"
                         >
                           <Check size={20} /> Deployment Successful
                         </motion.div>
                       ) : (
                         <motion.div 
                          key="idle"
                          initial={{ y: -20 }} animate={{ y: 0 }}
                          className="flex items-center gap-3 text-brand-bg font-black uppercase tracking-widest italic"
                         >
                           <ShoppingBag size={20} /> {product.isPreOrder ? "Secure Pre-order" : "Initialize Checkout"}
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </button>
                </div>
             </div>

             {/* Bio-Data Sheet */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-paper/50 border border-brand-card rounded-2xl p-6 flex flex-col gap-3">
                   <ShieldCheck className="text-brand-neon" size={24} />
                   <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Quality Assurance</p>
                   <p className="text-xs text-white leading-relaxed">220 GSM Bio-Washed Cotton. Zero shrinkage architecture.</p>
                </div>
                <div className="bg-brand-paper/50 border border-brand-card rounded-2xl p-6 flex flex-col gap-3">
                   <Truck className="text-brand-neon" size={24} />
                   <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Fast Fulfillment</p>
                   <p className="text-xs text-white leading-relaxed">Secure shipping via Steadfast Courier across Bangladesh.</p>
                </div>
             </div>

             <div className="mt-12 p-8 bg-brand-bg border border-brand-card border-dashed rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                   <Info className="text-brand-muted" size={16} />
                   <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Product Intel</h3>
                </div>
                <p className="text-brand-muted text-sm leading-relaxed font-medium">
                   {product.description}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
