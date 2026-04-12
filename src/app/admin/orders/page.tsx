"use client";



import { useEffect, useState } from "react";
import { Download, Edit2, Truck, CheckCircle2 } from "lucide-react";

interface OrderShape {
  id: string;
  serializedId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  trxId?: string | null;
  courierTrackingId?: string | null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courierLoading, setCourierLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load orders");
      setOrders(data.orders);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const sendToCourier = async (order: OrderShape) => {
    try {
      setCourierLoading(order.id);
      const res = await fetch("/api/admin/courier/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send to courier");
      
      alert(`Successfully sent to Courier! Tracking ID: ${data.trackingId}`);
      fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error sending to courier");
    } finally {
      setCourierLoading(null);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update status");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Unknown error updating order status");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-brand-muted animate-pulse">Initializing Order Stream...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-400 bg-red-400/10 rounded-xl border border-red-400/20">{error}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Order Console</h1>
        <div className="text-xs text-brand-muted flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse"></span>
          Live Management Mode
        </div>
      </div>

      <div className="bg-brand-paper rounded-2xl border border-brand-card overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-brand-text">
            <thead className="bg-brand-card/50 text-brand-muted uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Customer Profile</th>
                <th className="px-6 py-5">Payment / Trx</th>
                <th className="px-6 py-5">Value</th>
                <th className="px-6 py-5">Workflow Status</th>
                <th className="px-6 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-card">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-card/20 transition-colors group">
                  <td className="px-6 py-4 font-mono text-brand-neon text-xs">
                    {order.serializedId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold truncate max-w-[150px]">{order.customerName}</div>
                    <div className="text-[10px] text-brand-muted flex flex-col mt-0.5">
                      <span>{order.customerPhone}</span>
                      <span className="truncate max-w-[150px]">{order.customerAddress}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">{order.paymentMethod}</div>
                    {order.trxId && <div className="font-mono text-brand-neon text-xs mt-1">{order.trxId}</div>}
                  </td>
                  <td className="px-6 py-4 font-bold text-white">৳{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="bg-brand-bg border border-brand-card rounded-lg px-2 py-1.5 text-[10px] font-bold text-white outline-none focus:border-brand-neon transition-all cursor-pointer"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      {order.status === "PROCESSING" && (
                        <button 
                          onClick={() => sendToCourier(order)}
                          disabled={courierLoading === order.id}
                          className={`p-2 rounded-lg hover:bg-brand-neon/20 hover:text-brand-neon transition-all ${courierLoading === order.id ? 'animate-pulse' : ''}`} 
                          title="Send to Courier (Steadfast/RedX)"
                        >
                          <Truck size={18} />
                        </button>
                      )}
                      {order.courierTrackingId && (
                        <div className="p-2 text-brand-neon" title="Courier Request Success">
                          <CheckCircle2 size={18} />
                        </div>
                      )}
                      <button className="p-2 rounded-lg hover:bg-brand-card hover:text-white transition-all" title="View Detailed Invoice">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}
