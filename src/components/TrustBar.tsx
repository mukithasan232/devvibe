"use client";

import { Star, ShieldCheck, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustBar() {
  const items = [
    { icon: Star, text: "FREE DELIVERY IN BANGLADESH", fill: true },
    { icon: ShieldCheck, text: "PREMIUM 220 GSM BIO-WASHED COTTON" },
    { icon: Leaf, text: "100% ORGANIC VERIFIED SOURCE" },
    { icon: Star, text: "PREMIUM QUALITY GUARANTEED", fill: true },
  ];

  const content = (
    <div className="flex items-center gap-12 md:gap-24 px-6 md:px-12 shrink-0">
      {items.map((item, idx) => (
        <span 
          key={idx} 
          className="flex items-center gap-2.5 text-[#0A192F] font-bold uppercase text-[11px] sm:text-[12px] md:text-sm tracking-[0.15em] whitespace-nowrap"
        >
          <item.icon className={`w-4 h-4 shrink-0 ${item.fill ? 'fill-[#0A192F]' : ''}`} />
          {item.text}
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white overflow-hidden h-9 md:h-11 flex items-center border-b border-[#0A192F]/10 select-none relative z-40">
      <motion.div
        className="flex shrink-0 will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration: 35, // Slower, more premium pace
        }}
      >
        <div className="flex shrink-0">
          {content}
          {content}
        </div>
      </motion.div>
    </div>
  );
}
