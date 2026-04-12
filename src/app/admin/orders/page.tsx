"use client";

import { useEffect, useState } from "react";
import { Download, Edit2, Truck, CheckCircle2, ChevronRight, X, User, MapPin, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface OrderShape {
  id: string;
  serializedId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: any[];
  trxId?: string | null;
  courierTrackingId?: string | null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<OrderShape | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courierLoading, setCourierLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
        await fetch(`/api/orders/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchOrders();
    } catch (error) {
        alert("Failed to update status");
    }
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    try {
        await fetch(`/api/orders/${editingOrder.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingOrder),
        });
        setIsEditModalOpen(false);
        fetchOrders();
    } catch (error) {
        alert("Failed to save changes");
    }
  };

  const handleDeleteOrder = async (id: string) => {
      if (!confirm("Are you sure you want to delete this order?")) return;
      try {
          await fetch(`/api/orders/${id}`, { method: "DELETE" });
          fetchOrders();
      } catch (error) {
          alert("Delete failed");
      }
  };

  const handleSendToCourier = async (orderId: string) => {
      try {
          setCourierLoading(orderId);
          const res = await fetch("/api/admin/courier/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          alert("Sent to Steadfast Courier!");
          fetchOrders();
      } catch (error: any) {
          alert(error.message);
      } finally {
          setCourierLoading(null);
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">ORDER CONTROL</h1>
          <p className="text-brand-muted font-medium">Enterprise Fulfillment & Logistics Command</p>
        </div>
        <div className="flex gap-4">
            <button onClick={fetchOrders} className="bg-brand-paper border border-brand-card px-6 py-2.5 rounded-xl text-white font-bold hover:border-brand-neon transition-all">
                Refresh Stream
            </button>
        </div>
      </div>

      <div className="bg-brand-paper rounded-[32px] border border-brand-card overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-card/30 text-brand-muted uppercase text-[10px] font-black tracking-[0.2em] border-b border-brand-card">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Customer / Locale</th>
                <th className="px-8 py-6">Financials</th>
                <th className="px-8 py-6">Workflow Status</th>
                <th className="px-8 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-card/50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-card/10 transition-all group">
                  <td className="px-8 py-6">
                    <div className="font-mono text-brand-neon font-black">#{order.serializedId}</div>
                    <div className="text-[10px] text-brand-muted mt-1 uppercase font-bold">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-white font-bold flex items-center gap-2">
                        {order.customerName}
                        <ArrowRight size={14} className="text-brand-muted opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                    <div className="text-xs text-brand-muted mt-1 truncate max-w-[200px]">{order.customerAddress}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-white font-black text-lg">৳{order.totalAmount}</div>
                    <div className="text-[10px] text-brand-neon font-bold uppercase tracking-wider">{order.paymentMethod}</div>
                  </td>
                  <td className="px-8 py-6">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest outline-none transition-all cursor-pointer border ${
                        order.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        order.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        order.status === 'DELIVERED' ? 'bg-green-500/10 text-brand-neon border-brand-neon/20' :
                        'bg-brand-card text-white border-brand-card'
                      }`}
                    >
                      {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'PENDING' && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                            className="bg-brand-neon/10 text-brand-neon p-2.5 rounded-xl border border-brand-neon/20 hover:bg-brand-neon hover:text-brand-bg transition-all"
                            title="Approve Order"
                          >
                              <CheckCircle2 size={18} />
                          </button>
                      )}
                      {order.status === 'PROCESSING' && (
                          <button 
                            onClick={() => handleSendToCourier(order.id)}
                            disabled={courierLoading === order.id}
                            className={`bg-brand-card text-white p-2.5 rounded-xl border border-brand-card hover:border-brand-neon transition-all ${courierLoading === order.id ? 'animate-pulse' : ''}`}
                            title="Send to Steadfast Courier"
                          >
                              <Truck size={18} />
                          </button>
                      )}
                      <button 
                        onClick={() => { setEditingOrder(order); setIsEditModalOpen(true); }}
                        className="bg-brand-card text-white p-2.5 rounded-xl border border-brand-card hover:border-white transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <Link 
                        href={`/admin/orders/${order.id}/invoice`} 
                        target="_blank"
                        className="bg-brand-card text-white p-2.5 rounded-xl border border-brand-card hover:border-brand-neon hover:text-brand-neon transition-all"
                      >
                        <Download size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="bg-red-500/10 text-red-400 p-2.5 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingOrder && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-bg/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-brand-paper border border-brand-card rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-brand-card flex justify-between items-center bg-brand-card/20 text-white">
                <h2 className="text-2xl font-black tracking-tighter">EDIT ORDER #{editingOrder.serializedId}</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="hover:text-brand-neon transition-colors"><X size={24} /></button>
              </div>
              <div className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-brand-muted tracking-widest flex items-center gap-2"><User size={12} /> Customer Name</label>
                    <input 
                      type="text" value={editingOrder.customerName} 
                      onChange={(e) => setEditingOrder({...editingOrder, customerName: e.target.value})}
                      className="w-full bg-brand-bg border border-brand-card rounded-2xl px-6 py-4 text-white focus:border-brand-neon outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-brand-muted tracking-widest flex items-center gap-2"><Phone size={12} /> Phone Number</label>
                    <input 
                      type="text" value={editingOrder.customerPhone} 
                      onChange={(e) => setEditingOrder({...editingOrder, customerPhone: e.target.value})}
                      className="w-full bg-brand-bg border border-brand-card rounded-2xl px-6 py-4 text-white focus:border-brand-neon outline-none transition-all font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-brand-muted tracking-widest flex items-center gap-2"><MapPin size={12} /> Delivery Address</label>
                  <textarea 
                    rows={3} value={editingOrder.customerAddress} 
                    onChange={(e) => setEditingOrder({...editingOrder, customerAddress: e.target.value})}
                    className="w-full bg-brand-bg border border-brand-card rounded-2xl px-6 py-4 text-white focus:border-brand-neon outline-none transition-all"
                  />
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button onClick={handleUpdateOrder} className="flex-1 bg-brand-neon text-brand-bg font-black py-5 rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(57,255,20,0.3)]">
                    SAVE CHANGES
                  </button>
                  <button onClick={() => setIsEditModalOpen(false)} className="px-10 bg-brand-card text-white font-bold rounded-3xl hover:bg-white hover:text-brand-bg transition-all">
                    CANCEL
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArrowRight({ size, className }: any) {
    return <ChevronRight size={size} className={className} />;
}
