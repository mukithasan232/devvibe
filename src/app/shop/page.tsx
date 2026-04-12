import { Metadata } from "next";
import ShopClient from "./ShopClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shop | DevVibe Clothing",
  description: "Explore our full collection of premium tech apparel. Compiled for comfort, designed for developers.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-neon font-black animate-pulse">BOOTING RETAIL CORE...</div>}>
      <ShopClient />
    </Suspense>
  );
}
