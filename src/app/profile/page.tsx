"use client";

import { useState, useEffect } from "react";
import { Package, User as UserIcon, Truck, CheckCircle2, Edit3, Save, Search, LogOut, Activity } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerProfile() {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Customer Stats & Info
  const [customer, setCustomer] = useState({
    name: "Developer",
    email: "user@devvibe.com",
    phone: "",
    address: ""
  });

  const [searchId, setSearchId] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("devvibe-customer");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCustomer(parsed);
      if (parsed.phone) {
        fetchRealOrders(parsed.phone);
      } else {
        setLoadingOrders(false);
      }
    } else {
      setLoadingOrders(false);
    }
  }, []);

  const fetchRealOrders = async (phone: string) => {
    try {
      const res = await fetch(`/api/customer/orders?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Order Fetch Error:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem("devvibe-customer", JSON.stringify(customer));
    setIsEditing(false);
    if (customer.phone) {
      setLoadingOrders(true);
      fetchRealOrders(customer.phone);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-12"
      >
        <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
          <span className="text-brand-neon">{"{"}</span> {t.portalTitle} <span className="text-brand-neon">{"}"}</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-brand-paper border border-brand-card rounded-2xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10">
               <UserIcon size={120} />
            </div>
            
            <div className="w-24 h-24 bg-brand-bg rounded-2xl border border-brand-paper mx-auto mb-6 flex items-center justify-center text-brand-neon shadow-[0_0_20px_rgba(57,255,20,0.1)] relative z-10">
              <UserIcon size={40} />
            </div>

            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div 
                  key="edit-fields"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 text-left relative z-10"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-brand-muted">{t.fullName}</label>
                    <input 
                      type="text" 
                      value={customer.name} 
                      onChange={(e) => setCustomer({...customer, name: e.target.value})}
                      className="w-full bg-brand-bg border border-brand-card rounded-lg px-3 py-2 text-sm text-white focus:border-brand-neon outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-brand-muted">Email</label>
                    <input 
                      type="email" 
                      value={customer.email} 
                      onChange={(e) => setCustomer({...customer, email: e.target.value})}
                      className="w-full bg-brand-bg border border-brand-card rounded-lg px-3 py-2 text-sm text-white focus:border-brand-neon outline-none" 
                    />
                  </div>
                  <button 
                    onClick={handleSave}
                    className="w-full bg-brand-neon text-brand-bg font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#4ddbb6] transition-colors mt-4"
                  >
                    <Save size={16} /> {t.saveProfile}
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="view-fields"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10"
                >
                  <h2 className="text-xl font-bold text-white mb-1 truncate">{customer.name}</h2>
                  <p className="text-sm text-brand-muted mb-6 truncate">{customer.email}</p>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 text-brand-neon text-sm border border-brand-neon/30 px-6 py-2 rounded-lg font-medium hover:bg-brand-neon/10 transition-all w-full"
                  >
                    <Edit3 size={16} /> {t.editProfile}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="bg-brand-paper border border-brand-card rounded-2xl overflow-hidden divide-y divide-brand-card">
            <div className="p-4 bg-brand-bg/30 text-xs font-mono text-brand-muted uppercase tracking-widest">System_Nav</div>
            <div className="p-4 text-brand-neon bg-brand-neon/5 border-l-2 border-brand-neon flex items-center gap-3 font-medium cursor-default">
              <Package size={18} /> {t.orderHistory}
            </div>
            <div className="p-4 text-brand-muted hover:text-white flex items-center gap-3 cursor-pointer transition-colors group">
              <UserIcon size={18} className="group-hover:text-brand-neon transition-colors" /> {t.accountDetails}
            </div>
          </div>
        </div>

        {/* Orders Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
            <input 
              type="text"
              placeholder="Search Order Hash (DV-XXXX-XXXX)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
              className="w-full bg-brand-paper border border-brand-card rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-brand-neon transition-all"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-brand-neon">{"//"}</span> {t.recentCompiles}
            </h2>
            
            {loadingOrders ? (
               <div className="py-20 text-center animate-pulse">
                  <Activity className="mx-auto text-brand-neon mb-4" size={32} />
                  <p className="text-brand-muted font-mono text-[10px] uppercase tracking-widest text-white italic">Querying Fulfillment Database...</p>
               </div>
            ) : orders.length === 0 ? (
               <div className="py-20 text-center bg-brand-paper/30 rounded-2xl border border-brand-card border-dashed">
                  <Package className="mx-auto text-brand-muted mb-4 opacity-30" size={48} />
                  <p className="text-brand-muted font-mono text-xs uppercase italic">No active compiles detected in your history.</p>
                  <Link href="/shop" className="text-brand-neon hover:text-white text-xs font-bold mt-4 inline-block underline underline-offset-4">INITIATE NEW ORDER</Link>
               </div>
            ) : orders.map((order, index) => (
              <motion.div 
                key={order.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-brand-paper border border-brand-card rounded-3xl p-6 hover:border-brand-neon/30 transition-all group shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Package size={80} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-card pb-4 mb-4 gap-4 relative z-10">
                  <div>
                    <p className="text-brand-neon font-black font-mono text-sm tracking-[0.2em]">{order.serializedId}</p>
                    <p className="text-[10px] text-brand-muted mt-1 uppercase font-black tracking-widest">{new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     {order.status === "DELIVERED" ? (
                       <span className="bg-brand-neon/10 text-brand-neon px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 border border-brand-neon/30 uppercase tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                         <CheckCircle2 size={12} /> {order.status}
                       </span>
                     ) : (
                       <span className="bg-brand-bg text-brand-text px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 border border-brand-card uppercase tracking-widest italic">
                         <Truck size={12} className="text-brand-neon animate-pulse" /> {order.status}
                       </span>
                     )}
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4 text-white">
                        <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center font-black text-xs border border-brand-card text-brand-neon shadow-inner">
                          {item.quantity}x
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold uppercase tracking-tight">{item.product?.name || "Premium DevVibe Item"}</span>
                           <span className="text-[9px] font-black text-brand-muted font-mono tracking-widest bg-brand-bg w-fit px-2 py-0.5 rounded border border-brand-card mt-1.5">
                             SIZE: {item.size}
                           </span>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="text-brand-neon font-black text-[10px] font-mono tracking-tighter">SUCCESS_FETCH</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-brand-card flex flex-col sm:flex-row justify-between items-start sm:items-center bg-brand-bg/40 -mx-6 -mb-6 p-8 rounded-b-3xl gap-6 relative z-10">
                   <div>
                      <p className="text-brand-muted font-black font-mono text-[9px] uppercase tracking-[0.3em] mb-2">Authenticated Total</p>
                      <p className="text-white text-2xl font-black tracking-tighter italic">৳{order.totalAmount.toLocaleString()}</p>
                   </div>
                   <Link 
                      href={`/invoice/${order.serializedId}`}
                      target="_blank"
                      className="w-full sm:w-auto bg-brand-paper hover:bg-brand-neon hover:text-brand-bg border border-brand-card hover:border-brand-neon px-8 py-3.5 rounded-xl text-[10px] font-black transition-all shadow-2xl flex items-center justify-center gap-3 text-white uppercase tracking-widest group/btn"
                   >
                      <Activity size={14} className="group-hover/btn:animate-spin" /> Download Official Invoice
                   </Link>
                </div>
              </motion.div>
            ))}
            
            <div className="pt-8 flex flex-col items-center gap-4">
               <Link href="/" className="group flex items-center gap-2 text-brand-neon text-sm hover:text-white transition-all font-bold">
                 <LogOut size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> {t.returnToShop}
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
