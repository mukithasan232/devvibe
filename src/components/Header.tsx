"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Lock } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import CartHeaderIcon from "@/components/cart/CartHeaderIcon";
import MobileMenu from "@/components/MobileMenu";

export default function Header() {
  const pathname = usePathname();
  
  // High-priority guard to prevent header collision in Admin Workspace
  const isAdminPath = pathname === "/admin" || pathname?.startsWith("/admin/");
  
  if (isAdminPath) {
    return null;
  }

  const navItems = [
    { name: "Store", href: "/shop" },
    { name: "Collections", href: "/#collections" },
    { name: "Track", href: "/track" },
  ];

  return (
    <header className="sticky top-0 z-[60] w-full bg-brand-bg/80 backdrop-blur-md border-b border-brand-paper print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-4">
            <MobileMenu navItems={navItems} />
            <Link href="/" className="flex items-center gap-2 group transition-all duration-300">
              <div className="relative w-28 md:w-32 h-8 md:h-10 overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/images/logo/DevVibe.png"
                  alt="DevVibe Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 112px, 128px"
                  priority
                />
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-brand-text hover:text-brand-neon text-sm font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:block"><LanguageToggle /></div>
              <Link href="/admin/login" className="p-2 text-brand-muted hover:text-brand-neon transition-colors" title="Admin Control">
                <Lock size={18} />
              </Link>
              <Link href="/login" className="p-2 text-brand-text hover:text-brand-neon transition-colors" aria-label="Customer Login">
                <User size={20} />
              </Link>
              <CartHeaderIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
