"use client";

import { useState, useEffect } from "react";
import { Menu, X, Home, ShoppingBag, Layers, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface MobileMenuProps {
  navItems: Array<{ name: string; href: string }>;
}

export default function MobileMenu({ navItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const iconMap: Record<string, any> = {
    "Store": ShoppingBag,
    "Collections": Layers,
    "Track": MapPin,
    "Home": Home
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-brand-text hover:text-brand-neon transition-colors"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm z-[100]"
            />

            {/* Menu Tray */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-brand-paper border-r border-brand-card z-[101] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                 <div className="text-xl font-black text-white italic tracking-tighter">
                   DEV<span className="text-brand-neon">VIBE</span>
                 </div>
                 <button onClick={() => setIsOpen(false)} className="p-2 text-brand-muted hover:text-white">
                   <X size={24} />
                 </button>
              </div>

              <nav className="flex flex-col gap-6">
                <Link 
                  href="/" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-xl font-bold text-brand-muted hover:text-brand-neon transition-all"
                >
                  <Home size={24} />
                  Home
                </Link>
                {navItems.map((item) => {
                  const Icon = iconMap[item.name] || Layers;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 text-xl font-bold text-brand-muted hover:text-brand-neon transition-all"
                    >
                      <Icon size={24} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto pt-12 border-t border-brand-card">
                 <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-4">Official Infrastructure</p>
                 <div className="flex flex-col gap-4">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="text-sm font-bold text-white hover:text-brand-neon transition-colors">Customer Portal</Link>
                    <Link href="/admin/login" onClick={() => setIsOpen(false)} className="text-sm font-bold text-white/50 hover:text-brand-neon transition-colors">Admin Command</Link>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
