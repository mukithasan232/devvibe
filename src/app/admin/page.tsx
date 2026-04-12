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
  Calendar,
  Activity,
  Layers
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
    aov: number;
    totalInventoryValue: number;
  };
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  recentPerformance: Array<{
    label: string;
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

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-brand-neon animate-pulse">
        <Activity size={48} className="mb-4" />
        <p className="font-black uppercase tracking-[0.3em] text-sm italic">Synchronizing Enterprise Ledger...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic uppercase underline decoration-brand-neon/30 decoration-4 underline-offset-8">Command Center</h1>
          <p className="text-brand-muted text-sm font-bold uppercase tracking-widest mt-4">Real-time Financial & Operational Intelligence</p>
        </div>
        <div className="flex items-center gap-3 bg-brand-paper border border-brand-card p-3 rounded-2xl shadow-xl">
          <Calendar size={18} className="text-brand-neon" />
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Active Fiscal Cycle</span>
             <span className="text-sm font-bold text-white uppercase tracking-tighter">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Financial Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Gross Revenue" 
          value={`৳${stats?.summary.totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="text-brand-neon" 
          trend="Real-time" 
        />
        <StatCard 
          title="Net Profit" 
          value={`৳${stats?.summary.netProfit.toLocaleString()}`} 
          icon={TrendingUp} 
          color="text-[#00F0FF]" 
          trend={stats?.summary.profitMargin + "% Margin"} 
          isTrendPositive={Number(stats?.summary.profitMargin) > 0}
        />
        <StatCard 
          title="AOV (Avg Order)" 
          value={`৳${stats?.summary.aov.toLocaleString()}`} 
          icon={Target} 
          color="text-yellow-400" 
          trend="Fulfillment Efficiency"
        />
        <StatCard 
          title="Active Orders" 
          value={stats?.summary.totalOrders.toString() || "0"} 
          icon={ShoppingBag} 
          color="text-brand-neon" 
          trend={`${stats?.summary.pendingOrders} Processing`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Projection & Generator */}
        <div className="lg:col-span-8 bg-brand-paper rounded-3xl border border-brand-card overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <BarChart3 size={120} />
          </div>
          <div className="p-8 border-b border-brand-card flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-bg rounded-lg border border-brand-card text-brand-neon">
                 <BarChart3 size={18} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight uppercase italic">Revenue Generator</h2>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-neon rounded-full animate-pulse shadow-[0_0_10px_#fff]"></span>
               <span className="text-[10px] font-black text-brand-neon uppercase tracking-widest">Live Payload</span>
            </div>
          </div>
          <div className="p-8 relative z-10">
            <div className="h-[280px] flex items-end justify-between gap-4 border-b border-brand-card/30 pb-2">
              {(stats?.recentPerformance && stats.recentPerformance.length > 0 ? stats.recentPerformance : []).map((day, i) => {
                const max = Math.max(...(stats?.recentPerformance?.map((d: any) => d.revenue) || [1000]));
                const pct = (day.revenue / (max || 1)) * 100;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                    <div className="w-full relative flex items-end justify-center h-full">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(4, pct)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-brand-neon/5 via-brand-neon/40 to-brand-neon group-hover:to-white transition-all rounded-t-lg relative shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                      >
                        {day.revenue > 0 && (
                          <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-bold text-brand-neon bg-brand-bg px-2 py-1 rounded border border-brand-card">
                            ৳{day.revenue.toLocaleString()}
                          </div>
                        )}
                      </motion.div>
                    </div>
                    <span className="text-[10px] tracking-tighter uppercase font-black text-brand-muted font-mono">
                        {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-brand-bg/50 p-6 rounded-3xl border border-brand-card gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-brand-paper rounded-xl flex items-center justify-center text-brand-neon border border-brand-card shadow-inner">
                    <Layers size={20} />
                 </div>
                 <div>
                   <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest mb-1">Asset Inventory Value</p>
                   <h3 className="text-white font-black text-2xl tracking-tighter italic">৳{stats?.summary.totalInventoryValue.toLocaleString()}</h3>
                 </div>
              </div>
              <button className="w-full sm:w-auto bg-brand-neon text-brand-bg font-black text-xs px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] uppercase tracking-widest italic">
                Export Global Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Top Product Stack */}
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-brand-paper rounded-3xl border border-brand-card shadow-2xl flex flex-col">
              <div className="p-8 border-b border-brand-card">
                <h2 className="text-xl font-bold text-white tracking-tight uppercase italic flex items-center gap-2">
                   <Target className="text-brand-neon" size={18} /> Asset Yield
                </h2>
              </div>
              <div className="p-8 space-y-6 flex-grow">
                {stats?.topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center text-xs font-black text-brand-muted group-hover:text-brand-neon group-hover:border-brand-neon border border-brand-card transition-all">
                        {i+1}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-white font-bold text-sm truncate max-w-[140px] uppercase tracking-tight">{p.name}</h4>
                        <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest">{p.quantity} Units Sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-brand-neon font-black text-xs tracking-tighter italic">৳{p.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {(!stats?.topProducts || stats.topProducts.length === 0) && (
                    <div className="text-center py-10">
                        <p className="text-brand-muted text-xs uppercase font-mono">No yield detected in current cycle.</p>
                    </div>
                )}
              </div>
            </div>

            {/* Platform Status */}
            <div className="bg-gradient-to-br from-brand-paper to-brand-bg rounded-3xl border border-brand-card p-8 shadow-2xl">
                <h3 className="text-xs font-black text-brand-muted uppercase tracking-[0.2em] mb-6">Platform Stability</h3>
                <div className="space-y-4">
                    <StatusLine label="API Gateway" status="Operational" />
                    <StatusLine label="Database Cluster" status="Stable" />
                    <StatusLine label="Fulfillment Pipe" status="Active" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatusLine({ label, status }: { label: string, status: string }) {
    return (
        <div className="flex justify-between items-center bg-brand-paper/50 p-3 rounded-xl border border-brand-card/30">
            <span className="text-[10px] text-brand-text font-bold uppercase">{label}</span>
            <span className="text-[9px] font-black text-brand-neon uppercase tracking-widest bg-brand-neon/10 px-2 py-0.5 rounded-full">{status}</span>
        </div>
    )
}

function StatCard({ title, value, icon: Icon, color, trend, isTrendPositive = true }: any) {
  return (
    <div className="bg-brand-paper p-8 rounded-3xl border border-brand-card hover:border-brand-neon/30 transition-all group overflow-hidden relative shadow-xl">
      <div className="absolute top-[-20px] right-[-20px] w-16 h-16 bg-brand-neon/5 rounded-full blur-2xl group-hover:bg-brand-neon/20 transition-all"></div>
      <div className="flex justify-between items-start relative z-10 mb-8">
        <div className={`p-4 rounded-xl bg-brand-bg border border-brand-card ${color} group-hover:scale-110 transition-transform shadow-inner`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 ${isTrendPositive ? 'text-brand-neon' : 'text-red-400'} text-[10px] font-black uppercase tracking-widest bg-brand-bg px-2 py-1 rounded-lg border border-brand-card`}>
            {isTrendPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-2 font-mono">{title}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase">{value}</h3>
      </div>
    </div>
  );
}
