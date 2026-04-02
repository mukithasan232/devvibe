"use client";



import { useEffect, useState } from "react";
import { Download, Edit2 } from "lucide-react";

interface OrderShape {
  id: string;
  serializedId: string;
  customerName: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  trxId?: string | null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load orders");
      setOrders(
        data.orders.map((order: {
          id: string;
          serializedId: string;
          customerName: string;
          totalAmount: number;
          status: string;
          paymentMethod: string;
          trxId?: string | null;
        }) => ({
          id: order.id,
          serializedId: order.serializedId,
          customerName: order.customerName,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentMethod: order.paymentMethod,
          trxId: order.trxId,
        }))
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
    return <p className="text-brand-muted">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Order Management</h1>

      <div className="bg-brand-paper rounded-xl border border-brand-card overflow-hidden">
        <table className="w-full text-left text-sm text-brand-text">
          <thead className="bg-brand-card/50 text-brand-muted uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Method / TrxID</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-brand-card hover:bg-brand-card/30">
                <td className="px-6 py-4 font-mono text-brand-neon">{order.serializedId}</td>
                <td className="px-6 py-4 text-white font-medium">{order.customerName}</td>
                <td className="px-6 py-4">
                  <div className="text-xs text-brand-muted">{order.paymentMethod}</div>
                  {order.trxId && <div className="font-mono text-white text-xs">{order.trxId}</div>}
                </td>
                <td className="px-6 py-4 font-bold">৳{order.totalAmount}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="bg-brand-bg border border-brand-card rounded px-2 py-1 text-xs outline-none focus:border-brand-neon"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button className="text-brand-muted hover:text-brand-neon transition-colors p-1" title="Download Invoice">
                    <Download size={18} />
                  </button>
                  <button className="text-brand-muted hover:text-blue-400 transition-colors p-1" title="Edit Order Details">
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
