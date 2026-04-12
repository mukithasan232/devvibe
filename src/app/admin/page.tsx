"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight,
  Target,
  BarChart3,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStats {
  summary: {
    totalRevenue: number;
    totalCost: number;
    netProfit: number;
    profitMargin: string;
    totalOrders: number;
    pendingOrders: number;
  };
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Dashboard Stats Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-brand-muted animate-pulse">Initializing SaaS Financial Engine...</div>;

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Command Center</h1>
          <p className="text-brand-muted text-sm font-medium">Real-time Financial & Operational Intelligence</p>
        </div>
        <div className="flex items-center gap-3 bg-brand-paper border border-brand-card p-2 rounded-xl">
          <Calendar size={16} className="text-brand-neon" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">Live: April 2026</span>
        </div>
      </div>

      {/* Financial Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Gross Revenue" 
          value={`৳${stats?.summary.totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="text-brand-neon" 
          trend="+12.5%" 
        />
        <StatCard 
          title="Net Profit" 
          value={`৳${stats?.summary.netProfit.toLocaleString()}`} 
          icon={TrendingUp} 
          color="text-[#00F0FF]" 
          trend={stats?.summary.profitMargin + "%"} 
          isTrendPositive={Number(stats?.summary.profitMargin) > 0}
        />
        <StatCard 
          title="Inventory Assets" 
          value={`৳${stats?.summary.totalCost.toLocaleString()}`} 
          icon={Target} 
          color="text-yellow-400" 
        />
        <StatCard 
          title="Active Orders" 
          value={stats?.summary.totalOrders.toString() || "0"} 
          icon={ShoppingBag} 
          color="text-brand-neon" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Projection & Generator */}
        <div className="lg:col-span-8 bg-brand-paper rounded-3xl border border-brand-card overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-brand-card flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-brand-neon" />
              <h2 className="text-xl font-bold text-white tracking-tight">Revenue Generator</h2>
            </div>
            <span className="text-[10px] font-black bg-brand-neon/10 text-brand-neon px-2 py-1 rounded-full uppercase">Real-Time Payload</span>
          </div>
          <div className="p-8">
            <div className="h-[250px] flex items-end justify-between gap-4">
              {/* Simulated Data Points */}
              {[40, 65, 45, 90, 60, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="w-full bg-gradient-to-t from-brand-neon/5 to-brand-neon group-hover:to-white transition-all rounded-t-lg relative"
                    >
                      <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-bold text-brand-neon">
                        ৳{Math.round(h * 1500)}
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-brand-muted">Day {i+1}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-between items-center bg-brand-bg/50 p-6 rounded-2xl border border-brand-card">
              <div>
                <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Growth Forecast</p>
                <h3 className="text-white font-bold text-xl">High Probability (+24%)</h3>
              </div>
              <button className="bg-brand-neon text-brand-bg font-black text-xs px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                VIEW ANALYTICS PIPE
              </button>
            </div>
          </div>
        </div>

        {/* Top Product Stack */}
        <div className="lg:col-span-4 bg-brand-paper rounded-3xl border border-brand-card shadow-2xl h-full">
          <div className="p-8 border-b border-brand-card">
            <h2 className="text-xl font-bold text-white tracking-tight">Asset Yield (Top Items)</h2>
          </div>
          <div className="p-8 space-y-6">
            {stats?.topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-card flex items-center justify-center text-xs font-black text-brand-muted group-hover:text-brand-neon group-hover:border-brand-neon border border-transparent transition-all">
                    0{i+1}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm truncate max-w-[120px]">{p.name}</h4>
                    <p className="text-[10px] text-brand-muted font-bold uppercase">{p.quantity} Units Sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-brand-neon font-black text-xs">৳{p.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend, isTrendPositive = true }: any) {
  return (
    <div className="bg-brand-paper p-8 rounded-3xl border border-brand-card hover:border-brand-neon/30 transition-all group overflow-hidden relative shadow-xl">
      <div className="absolute top-[-20px] right-[-20px] w-16 h-16 bg-brand-neon/5 rounded-full blur-2xl group-hover:bg-brand-neon/20 transition-all"></div>
      <div className="flex justify-between items-start relative z-10 mb-6">
        <div className={`p-4 rounded-2xl bg-brand-bg border border-brand-card ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${isTrendPositive ? 'text-brand-neon' : 'text-red-400'} text-xs font-black`}>
            {isTrendPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-2">{title}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
      </div>
    </div>
  );
}
