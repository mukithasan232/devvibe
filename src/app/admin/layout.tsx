"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  // If we are on the login page, we don't want the sidebar layout
  if (isLoginPage) {
    return <div className="min-h-screen bg-brand-bg">{children}</div>;
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Users", href: "/admin/users", icon: UserIcon },
  ];

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text relative overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[195] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Dynamic Responsive */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-brand-paper border-r border-brand-card flex flex-col pt-6 shrink-0 z-[200] transition-transform duration-300 transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} print:hidden`}>
        <div className="px-6 mb-10 flex items-center justify-between">
          <Link href="/admin" className="relative w-32 h-10 block group">
            <Image
              src="/images/logo/DevVibe.png"
              alt="DevVibe Admin"
              fill
              className="object-contain transform group-hover:scale-105 transition-transform duration-300"
              sizes="256px"
            />
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-brand-muted md:hidden">
            <LogOut size={20} className="rotate-180" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                pathname === item.href 
                ? "bg-brand-neon/10 text-brand-neon border border-brand-neon/20 shadow-[0_0_15px_rgba(57,255,20,0.05)]" 
                : "text-brand-muted hover:bg-brand-card hover:text-white"
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-card space-y-2">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-sm font-medium"
          >
            <LogOut size={16} /> Log Out
          </button>
          <Link href="/" className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-brand-card transition-colors text-brand-muted hover:text-white text-sm">
            <span>← Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Mobile Header */}
        <header className="h-16 border-b border-brand-card bg-brand-paper/50 backdrop-blur-md flex items-center justify-between px-4 md:hidden shrink-0 z-[190]">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-brand-neon">
              <LayoutDashboard size={24} />
           </button>
           <div className="text-xs font-black text-brand-muted italic uppercase tracking-widest">Command <span className="text-brand-neon">Center</span></div>
           <div className="w-10"></div> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8 relative custom-scrollbar">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-neon/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="relative z-10 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
