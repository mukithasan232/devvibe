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
        <h1 className="text-3xl font-bold text-white">Store Manager</h1>
        <button onClick={() => openForm()} className="bg-brand-neon text-brand-bg px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(57,255,20,0.3)]">
          + Add New Product
        </button>
      </div>

      {loading && <p className="text-brand-muted">Loading products...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map((p) => (
          <div key={p.id} className="relative group">
            <SmartProductCard
              product={{
                id: p.id,
                name: p.name,
                price: p.price,
                imageUrl: p.imageUrl ? p.imageUrl.split(',')[0] : "https://devvibe.com/default-product.jpg",
                category: p.category,
                sizes: [
                  { size: "M", stock: p.stockM },
                  { size: "L", stock: p.stockL },
                  { size: "XL", stock: p.stockXL },
                  { size: "XXL", stock: p.stockXXL },
                ],
              }}
            />
            <button
              onClick={() => handleToggleFeature(p)}
              className={`absolute top-3 left-3 z-20 p-2 rounded-full shadow-md backdrop-blur-sm transition-colors ${p.isPublished ? "bg-yellow-500 text-white" : "bg-brand-bg/60 text-brand-muted hover:text-yellow-500"}`}
              title={p.isPublished ? "Unpublish Product" : "Publish Product"}
            >
              <Star size={16} fill={p.isPublished ? "currentColor" : "none"} />
            </button>
            <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="flex gap-2 pointer-events-auto">
                <button onClick={() => openForm(p)} className="bg-brand-neon text-brand-bg text-xs px-3 py-1 rounded shadow hover:bg-brand-neon/80 font-bold">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white text-xs px-3 py-1 rounded shadow hover:bg-red-600 font-bold">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-paper border border-brand-card rounded-3xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-brand-card flex justify-between items-center">
              <h2 className="text-xl font-bold text-white tracking-tight">{editingId ? "Edit Hardware Instance" : "Initialize New Product"}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-brand-bg rounded-full text-brand-muted hover:text-white transition-all hover:rotate-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="product-form" onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Product Name</label>
                    <input 
                      value={formData.name} 
                      required 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full bg-brand-bg border border-brand-card rounded-xl px-4 py-3 text-white focus:border-brand-neon focus:ring-1 focus:ring-brand-neon/20 transition-all outline-none" 
                      placeholder="e.g. Modern Syntax Tee"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">MSRP Price (BDT)</label>
                    <input 
                      value={formData.price} 
                      required 
                      type="number" 
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                      className="w-full bg-brand-bg border border-brand-card rounded-xl px-4 py-3 text-white focus:border-brand-neon outline-none" 
                      placeholder="450"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Hardware Cost (Profit Base)</label>
                    <input 
                      value={formData.costPrice} 
                      required 
                      type="number" 
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} 
                      className="w-full bg-brand-bg border border-brand-card rounded-xl px-4 py-3 text-white focus:border-[#FF5555] outline-none" 
                      placeholder="200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Technical Description</label>
                  <textarea 
                    value={formData.description} 
                    rows={3} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    className="w-full bg-brand-bg border border-brand-card rounded-xl px-4 py-3 text-white focus:border-brand-neon outline-none resize-none" 
                    placeholder="Describe material, GSM, and fit characteristics..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Classification</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                      className="w-full bg-brand-bg border border-brand-card rounded-xl px-4 py-3 text-white focus:border-brand-neon outline-none cursor-pointer"
                    >
                      <option value="Solid">Solid (Round Neck)</option>
                      <option value="Graphics">Graphics Collection</option>
                      <option value="Drop Shoulder">Relaxed Fit (Drop Shoulder)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Inventory Matrix (Stocks)</label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-muted block text-center">M</span>
                        <input value={formData.stockM} required type="number" min={0} onChange={(e) => setFormData({ ...formData, stockM: e.target.value })} className="w-full bg-brand-bg border border-brand-card rounded-lg px-2 py-2 text-white text-center text-xs" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-muted block text-center">L</span>
                        <input value={formData.stockL} required type="number" min={0} onChange={(e) => setFormData({ ...formData, stockL: e.target.value })} className="w-full bg-brand-bg border border-brand-card rounded-lg px-2 py-2 text-white text-center text-xs" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-muted block text-center">XL</span>
                        <input value={formData.stockXL} required type="number" min={0} onChange={(e) => setFormData({ ...formData, stockXL: e.target.value })} className="w-full bg-brand-bg border border-brand-card rounded-lg px-2 py-2 text-white text-center text-xs" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-muted block text-center">XXL</span>
                        <input value={formData.stockXXL} required type="number" min={0} onChange={(e) => setFormData({ ...formData, stockXXL: e.target.value })} className="w-full bg-brand-bg border border-brand-card rounded-lg px-2 py-2 text-white text-center text-xs" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Asset Pipeline (Images)</label>
                  <ImageUploadDropzone value={formData.imageUrls} onChange={(urls) => setFormData({ ...formData, imageUrls: urls })} />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-brand-card">
              <button 
                type="submit" 
                form="product-form"
                className="w-full bg-brand-neon text-brand-bg py-4 rounded-xl font-bold hover:bg-[#4ddbb6] transition-all hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] active:scale-[0.98]"
              >
                {editingId ? "Commit Changes" : "Deploy Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
