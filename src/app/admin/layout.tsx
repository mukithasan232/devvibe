"use client";

import { Package, ShoppingBag, LayoutDashboard, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("devvibe-admin") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("devvibe-admin", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid secret token.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("devvibe-admin");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-brand-bg items-center justify-center p-4">
        <div className="bg-brand-paper border border-brand-card rounded-2xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/5 rounded-full blur-[50px]"></div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-brand-card rounded-full flex items-center justify-center text-brand-neon border border-brand-neon/30">
              <Lock size={28} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">Store Manager</h2>
          <p className="text-brand-muted text-sm text-center mb-8">Enter your access token to continue.</p>
          
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-bg border border-brand-card rounded-lg px-4 py-3 text-white outline-none focus:border-brand-neon text-center tracking-widest font-mono" 
                placeholder="********" 
                required 
              />
              {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
            </div>
            <button type="submit" className="w-full bg-brand-neon text-brand-bg font-bold py-3 rounded-lg hover:bg-[#4ddbb6] transition-colors flex justify-center items-center gap-2">
              Authenticate <ArrowRight size={18} />
            </button>
            <p className="text-center text-xs text-brand-muted mt-4">Hint: The default Dev token is <code className="bg-brand-bg px-1 rounded">admin123</code></p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text">
      <aside className="w-64 bg-brand-paper border-r border-brand-card flex flex-col pt-6">
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold text-brand-neon tracking-tight text-center">DevVibe Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-card transition-colors">
            <LayoutDashboard size={18} className="text-brand-neon" /> Overview
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-card transition-colors">
            <Package size={18} className="text-brand-neon" /> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-card transition-colors">
            <ShoppingBag size={18} className="text-brand-neon" /> Orders
          </Link>
        </nav>
        <div className="p-4 border-t border-brand-card space-y-2">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-sm font-medium">
            <Lock size={16} /> Lock Terminal
          </button>
          <Link href="/" className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-brand-card transition-colors text-brand-muted hover:text-white text-sm">
            <span className="text-lg">←</span> Back to Store
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8 relative">
        {/* Animated Background Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-neon/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
