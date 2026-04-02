"use client";

import { useState, useEffect } from "react";
import { Package, User as UserIcon, Truck, CheckCircle2, Edit3, Save, Search, LogOut } from "lucide-react";
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

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("devvibe-customer");
    if (saved) {
      setCustomer(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("devvibe-customer", JSON.stringify(customer));
    setIsEditing(false);
  };

  // Mock orders for visual completeness (in production, fetch these via API based on phone/email)
  const mockOrders = [
    {
      id: "DV-20260402-8492",
      date: "Apr 02, 2026",
      amount: 1059,
      status: "DELIVERED",
      items: [{ name: "DevVibe Core T-Shirt", size: "M", quantity: 1 }]
    },
    {
      id: "DV-20260403-1193",
      date: "Apr 03, 2026",
      amount: 2258,
      status: "PROCESSING",
      items: [{ name: "Drop Shoulder Aesthetic", size: "L", quantity: 2 }]
    }
  ];

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
            
            {mockOrders.map((order, index) => (
              <motion.div 
                key={order.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-brand-paper border border-brand-card rounded-2xl p-6 hover:border-brand-neon/30 transition-all group shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-card pb-4 mb-4 gap-4">
                  <div>
                    <p className="text-brand-neon font-mono text-sm tracking-widest">{order.id}</p>
                    <p className="text-[10px] text-brand-muted mt-1 uppercase font-mono tracking-tighter">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     {order.status === "DELIVERED" ? (
                       <span className="bg-brand-neon/10 text-brand-neon px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-brand-neon/20 uppercase tracking-wider">
                         <CheckCircle2 size={12} /> Delivered
                       </span>
                     ) : (
                       <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-yellow-500/20 uppercase tracking-wider">
                         <Truck size={12} /> Processing
                       </span>
                     )}
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4 text-white">
                        <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center font-mono text-xs border border-brand-card text-brand-neon">
                          {item.quantity}x
                        </div>
                        <div className="flex flex-col">
                           <span className="font-medium">{item.name}</span>
                           <span className="text-[10px] text-brand-muted font-mono tracking-wider bg-brand-bg w-fit px-1.5 rounded border border-brand-card mt-1">
                             SIZE: {item.size}
                           </span>
                        </div>
                      </div>
                      <span className="text-white font-mono text-xs">EXE_DONE</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-brand-card flex justify-between items-center bg-brand-bg/20 -mx-6 -mb-6 p-6 rounded-b-2xl">
                   <p className="text-brand-muted font-mono text-[10px] uppercase tracking-widest">Total Amount Paid</p>
                   <p className="text-white text-xl font-bold tracking-tight">৳{order.amount}</p>
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
