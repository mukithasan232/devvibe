"use client";

import { Package, ShoppingBag, LayoutDashboard, Lock, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = () => {
    // Clear cookie (actually requires server action or middleware catch-all)
    // For now, we clear the local state hint and redirect
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  // If we are on the login page, we don't want the sidebar layout
  if (isLoginPage) {
    return <div className="min-h-screen bg-brand-bg">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text">
      <aside className="w-64 bg-brand-paper border-r border-brand-card flex flex-col pt-6 shrink-0 z-50 print:hidden">
        <div className="px-6 mb-10">
          <Link href="/admin" className="relative w-full h-12 block group">
            <Image
              src="/images/logo/DevVibe.png"
              alt="DevVibe Admin"
              fill
              className="object-contain transform group-hover:scale-105 transition-transform duration-300"
              sizes="256px"
            />
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            { name: "Overview", href: "/admin", icon: LayoutDashboard },
            { name: "Products", href: "/admin/products", icon: Package },
            { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
            { name: "Users", href: "/admin/users", icon: UserIcon },
          ].map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
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
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-neon/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
