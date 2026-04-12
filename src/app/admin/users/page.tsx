"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Search, ExternalLink, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phone.includes(searchTerm) ||
    u.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-paper/50 p-6 rounded-2xl border border-brand-card">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">User Intelligence</h1>
          <p className="text-brand-muted text-sm mt-1 font-mono uppercase tracking-widest">Customer Lifecycle Management</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, phone or geo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-bg border border-brand-card rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-brand-neon transition-all"
          />
        </div>
      </div>

      <div className="bg-brand-paper border border-brand-card rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/50 border-b border-brand-card">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-brand-muted">Customer Identity</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-brand-muted">Activity Path</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-brand-muted">LTV (Revenue)</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-brand-muted text-right">Fulfillment Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-card">
              {loading ? (
                <tr>
                   <td colSpan={4} className="p-20 text-center font-black animate-pulse text-brand-neon uppercase tracking-widest">
                      Decrypting User Database...
                   </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                   <td colSpan={4} className="p-20 text-center text-brand-muted font-mono uppercase">
                      No customer records found in current segment.
                   </td>
                </tr>
              ) : filteredUsers.map((user, idx) => (
                <motion.tr 
                  key={user.phone}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-brand-neon/5 transition-colors"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-bg rounded-xl border border-brand-card flex items-center justify-center text-brand-neon group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{user.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                           <span className="text-xs text-brand-muted flex items-center gap-1"><Phone size={10} /> {user.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                       <p className="text-xs text-white flex items-center gap-2"><MapPin size={12} className="text-brand-neon" /> {user.address}</p>
                       <p className="text-[10px] text-brand-muted flex items-center gap-2 uppercase tracking-tighter"><Calendar size={12} /> Last Order: {new Date(user.lastOrder).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                       <span className="text-xl font-black text-brand-neon leading-none italic flex items-center gap-1">
                         <DollarSign size={16} />{user.totalSpent}
                       </span>
                       <span className="text-[10px] text-brand-muted uppercase tracking-widest mt-1 font-mono">Lifetime Value</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex flex-col items-end">
                       <span className="bg-brand-bg border border-brand-card text-white px-3 py-1 rounded-lg text-xs font-bold font-mono">
                         {user.totalOrders} ORDERS
                       </span>
                       <span className="text-[10px] text-green-500 font-black uppercase mt-2 tracking-widest">Active Lead</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
