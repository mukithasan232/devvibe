"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/track?id=${orderId.trim()}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data?.error || "Order not found");
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { label: "PENDING", icon: Package, color: "text-brand-muted" },
    { label: "PROCESSING", icon: Search, color: "text-blue-400" },
    { label: "SHIPPED", icon: Truck, color: "text-brand-neon" },
    { label: "DELIVERED", icon: CheckCircle2, color: "text-green-400" },
  ];

  const currentStep = order ? statusSteps.findIndex(s => s.label === order.status) : -1;

  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Track Your Vibe.</h1>
          <p className="text-brand-muted">Enter your Order ID (e.g. DV-2024...) to get real-time delivery status.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-brand-paper p-6 rounded-2xl border border-brand-card shadow-2xl mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              placeholder="DV-XXXXXXXX-XXXX"
              className="flex-1 bg-brand-bg border border-brand-card rounded-xl px-4 py-3 text-white outline-none focus:border-brand-neon transition-all font-mono"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-brand-neon text-brand-bg font-bold px-8 py-3 rounded-xl hover:bg-[#4ddbb6] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Searching..." : <><Search size={20} /> Track</>}
            </button>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-500 mb-8"
            >
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {order && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 animate-in"
            >
              {/* Order Info Card */}
              <div className="bg-brand-paper p-8 rounded-2xl border border-brand-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/5 rounded-full blur-3xl"></div>
                
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-[0.2em] mb-1">Status</p>
                    <h2 className={`text-2xl font-black ${order.status === 'SHIPPED' ? 'text-brand-neon' : 'text-white'}`}>{order.status}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-[0.2em] mb-1">Order ID</p>
                    <p className="text-white font-mono">{order.serializedId}</p>
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-brand-card -translate-y-1/2 rounded-full"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-brand-neon -translate-y-1/2 transition-all duration-1000 rounded-full"
                    style={{ width: `${(Math.max(0, currentStep) / (statusSteps.length - 1)) * 100}%` }}
                  ></div>
                  
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, i) => (
                      <div key={step.label} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-500 ${i <= currentStep ? 'bg-brand-bg border-brand-neon text-brand-neon' : 'bg-brand-paper border-brand-card text-brand-muted'}`}>
                          <step.icon size={18} />
                        </div>
                        <span className={`text-[10px] font-bold tracking-widest ${i <= currentStep ? 'text-white' : 'text-brand-muted'}`}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.trackingUrl && (
                  <a 
                    href={order.trackingUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-brand-card/50 p-6 rounded-2xl border border-brand-card hover:border-brand-neon transition-all group flex flex-col gap-2"
                  >
                    <div className="text-brand-neon flex items-center justify-between">
                      <Truck size={24} />
                      <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Courier Tracking</h3>
                      <p className="text-xs text-brand-muted">View real-time location on Steadfast Portal</p>
                    </div>
                  </a>
                )}
                
                <Link 
                  href="/"
                  className="bg-brand-card/50 p-6 rounded-2xl border border-brand-card hover:border-white transition-all flex flex-col gap-2"
                >
                  <div className="text-white">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Shop More</h3>
                    <p className="text-xs text-brand-muted">Return to store for the latest drops</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
