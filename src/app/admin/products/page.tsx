"use client";



import { useEffect, useState } from "react";
import SmartProductCard from "@/components/admin/SmartProductCard";
import { Star, X } from "lucide-react";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";

interface ProductShape {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stockM: number;
  stockL: number;
  stockXL: number;
  stockXXL: number;
  isPublished: boolean;
  isLimitedEdition: boolean;
  costPrice: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    costPrice: "",
    imageUrls: [] as string[],
    category: "Solid",
    stockM: "0",
    stockL: "0",
    stockXL: "0",
    stockXXL: "0",
    isLimitedEdition: false,
    isPreOrder: false,
    isComingSoon: false,
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed loading products");
      setProducts(data.products);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const generateIntel = () => {
    const adjectives = ["Infinite", "Quantum", "Cyber", "Aesthetic", "Minimalist", "Oversized", "Premium", "Core", "Legacy", "Syntax", "Binary", "Stealth"];
    const nouns = ["Cotton", "Jersey", "Hoodie", "Vibe", "Drop", "Release", "Element", "Artifact", "Protocol", "Echo", "Void", "Matrix"];
    const descriptions = [
      "220 GSM Bio-Washed premium cotton for ultimate comfort. Designed for the code-native generation.",
      "Breathable 180 GSM cotton with high-fidelity print quality. Engineered for durability.",
      "A testament to tech-minimalism. Relaxed fit, premium drape, zero compromise.",
      "Limited batch release featuring the iconic DevVibe aesthetic. Pre-shrunk for a perfect fit.",
      "Durable, soft-touch fabric designed for the high-performance developer lifestyle."
    ];

    const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} ${Math.floor(Math.random() * 999)}`;
    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    setFormData(prev => ({
      ...prev,
      name: randomName,
      description: randomDesc
    }));
  };

  const openForm = (product?: ProductShape & { costPrice?: number }) => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description ?? "",
        price: product.price.toString(),
        costPrice: (product.costPrice ?? 0).toString(),
        imageUrls: product.imageUrl ? product.imageUrl.split(",") : [],
        category: product.category,
        stockM: product.stockM.toString(),
        stockL: product.stockL.toString(),
        stockXL: product.stockXL.toString(),
        stockXXL: product.stockXXL.toString(),
        isLimitedEdition: product.isLimitedEdition ?? false,
        isPreOrder: product.isPreOrder ?? false,
        isComingSoon: product.isComingSoon ?? false,
      });
      setEditingId(product.id);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        costPrice: "0",
        imageUrls: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"],
        category: "Solid",
        stockM: "0",
        stockL: "0",
        stockXL: "0",
        stockXXL: "0",
        isLimitedEdition: false,
        isPreOrder: false,
        isComingSoon: false,
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      costPrice: Number(formData.costPrice),
      imageUrl: formData.imageUrls.join(","),
      category: formData.category,
      stockM: Number(formData.stockM),
      stockL: Number(formData.stockL),
      stockXL: Number(formData.stockXL),
      stockXXL: Number(formData.stockXXL),
      isLimitedEdition: formData.isLimitedEdition,
      isPreOrder: formData.isPreOrder,
      isComingSoon: formData.isComingSoon,
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save product");
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Unknown error saving product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Unknown error deleting product");
    }
  };

  const handleToggleFeature = async (product: ProductShape) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !product.isPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update feature state");
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, isPublished: !p.isPublished } : p)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Unknown error toggling feature");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Command Center <span className="text-brand-neon">/ Products</span></h1>
        <button onClick={() => openForm()} className="bg-brand-neon text-brand-bg px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-[0_0_25px_rgba(57,255,20,0.3)] italic">
          + Initialize Entry
        </button>
      </div>

      {loading && <div className="p-20 text-center animate-pulse"><p className="text-brand-neon font-black tracking-widest">QUERYING INVENTORY...</p></div>}
      {error && <p className="text-red-400 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {products.map((p) => (
          <div key={p.id} className="relative group">
            <SmartProductCard
              product={{
                id: p.id,
                name: p.name,
                price: p.price,
                imageUrl: p.imageUrl ? p.imageUrl.split(',')[0] : "https://devvibe.com/default-product.jpg",
                category: p.category,
                isLimited: p.isLimitedEdition,
                sizes: [
                  { size: "M", stock: p.stockM },
                  { size: "L", stock: p.stockL },
                  { size: "XL", stock: p.stockXL },
                  { size: "XXL", stock: p.stockXXL },
                ],
              }}
            />
            
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleToggleFeature(p)}
                  className={`p-2 rounded-lg shadow-md backdrop-blur-md border transition-colors ${p.isPublished ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-500" : "bg-brand-bg/60 border-brand-card text-brand-muted hover:text-yellow-500"}`}
                  title={p.isPublished ? "Unpublish" : "Publish"}
                >
                  <Star size={14} fill={p.isPublished ? "currentColor" : "none"} />
                </button>
            </div>

            <div className="absolute inset-0 bg-brand-bg/60 backdrop-blur-sm z-30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center pointer-events-none">
              <div className="flex gap-3 pointer-events-auto">
                <button onClick={() => openForm(p)} className="bg-white text-brand-bg px-4 py-2 rounded-lg shadow hover:bg-white/90 font-black uppercase text-[10px] tracking-widest">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 font-black uppercase text-[10px] tracking-widest">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-bg/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-paper border border-brand-card rounded-[32px] w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[95vh] my-8">
            {/* Header */}
            <div className="p-4 md:p-8 border-b border-brand-card flex justify-between items-center bg-brand-bg/50 rounded-t-[32px]">
              <div>
                <p className="text-[10px] font-black text-brand-neon uppercase tracking-[0.3em] mb-1">Product Configuration</p>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic">{editingId ? "Modify Instance" : "Initialize New Entry"}</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 md:p-3 bg-brand-bg border border-brand-card rounded-2xl text-brand-muted hover:text-white transition-all hover:rotate-90 hover:border-brand-neon/50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
              <form id="product-form" onSubmit={handleSave} className="space-y-8">
                <div className="flex justify-end">
                   <button 
                    type="button" 
                    onClick={generateIntel}
                    className="text-[10px] font-black text-brand-neon uppercase tracking-widest border border-brand-neon/30 px-3 py-1.5 rounded-lg hover:bg-brand-neon/10 transition-colors"
                   >
                     ⚡ Generate Intel
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">Hardware Name</label>
                    <input 
                      value={formData.name} 
                      required 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full bg-brand-bg border border-brand-card rounded-2xl px-5 py-4 text-white focus:border-brand-neon focus:ring-1 focus:ring-brand-neon/20 transition-all outline-none" 
                      placeholder="e.g. Modern Syntax Tee"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">MSRP (BDT)</label>
                    <input 
                      value={formData.price} 
                      required 
                      type="number" 
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                      className="w-full bg-brand-bg border border-brand-card rounded-2xl px-5 py-4 text-white focus:border-brand-neon outline-none" 
                      placeholder="450"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">Technical Description</label>
                  <textarea 
                    value={formData.description} 
                    rows={3} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    className="w-full bg-brand-bg border border-brand-card rounded-2xl px-5 py-4 text-white focus:border-brand-neon outline-none resize-none" 
                    placeholder="Describe material, GSM, and fit characteristics..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">Classification</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                      className="w-full bg-brand-bg border border-brand-card rounded-2xl px-5 py-4 text-white focus:border-brand-neon outline-none cursor-pointer appearance-none"
                    >
                      <option value="Solid">Solid (Round Neck)</option>
                      <option value="Graphics">Graphics Collection</option>
                      <option value="Drop Shoulder">Relaxed Fit (Drop Shoulder)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">Lifecycle Status</label>
                    <div className="flex flex-wrap gap-2 min-h-[60px]">
                       <button
                        type="button"
                        onClick={() => setFormData({...formData, isLimitedEdition: !formData.isLimitedEdition})}
                        className={`flex-1 min-w-[120px] h-12 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all ${formData.isLimitedEdition ? 'bg-orange-500/20 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-brand-bg border-brand-card text-brand-muted opacity-50'}`}
                       >
                         {formData.isLimitedEdition ? 'Limited Edition active' : 'Standard Edition'}
                       </button>
                       <button
                        type="button"
                        onClick={() => setFormData({...formData, isPreOrder: !formData.isPreOrder})}
                        className={`flex-1 min-w-[120px] h-12 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all ${formData.isPreOrder ? 'bg-blue-500/20 border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-brand-bg border-brand-card text-brand-muted opacity-50'}`}
                       >
                         {formData.isPreOrder ? 'Pre-order active' : 'Regular Order'}
                       </button>
                       <button
                        type="button"
                        onClick={() => setFormData({...formData, isComingSoon: !formData.isComingSoon})}
                        className={`flex-1 min-w-[120px] h-12 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all ${formData.isComingSoon ? 'bg-brand-neon/20 border-brand-neon text-brand-neon shadow-[0_0_15px_rgba(57,255,20,0.2)]' : 'bg-brand-bg border-brand-card text-brand-muted opacity-50'}`}
                       >
                         {formData.isComingSoon ? 'Coming Soon / Teaser' : 'Live Status'}
                       </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">Inventory Matrix (Stocks)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["M", "L", "XL", "XXL"].map((sz) => (
                      <div key={sz} className="space-y-2">
                        <span className="text-[9px] font-bold text-brand-muted block text-center">{sz}</span>
                        <input 
                          value={formData[`stock${sz}` as keyof typeof formData] as string} 
                          required type="number" min={0} 
                          onChange={(e) => setFormData({ ...formData, [`stock${sz}`]: e.target.value })} 
                          className="w-full bg-brand-bg border border-brand-card rounded-xl px-2 py-3 text-white text-center text-sm focus:border-brand-neon outline-none font-mono" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">Asset Pipeline (Cloudinary)</label>
                  <ImageUploadDropzone value={formData.imageUrls} onChange={(urls) => setFormData({ ...formData, imageUrls: urls })} />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-brand-card bg-brand-bg/50 rounded-b-[32px]">
              <button 
                type="submit" 
                form="product-form"
                className="w-full bg-brand-neon text-brand-bg py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_0_30px_rgba(57,255,20,0.4)] active:scale-[0.98] italic"
              >
                {editingId ? "Commit Payload Changes" : "Deploy to Mainframe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

