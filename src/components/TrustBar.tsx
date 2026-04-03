"use client";

import { Star, ShieldCheck, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustBar() {
  const content = (
    <div className="flex items-center gap-8 md:gap-16 px-4 md:px-8 shrink-0">
      <span className="flex items-center gap-2 text-[#0A192F] font-bold uppercase text-[11px] sm:text-[12px] md:text-sm tracking-widest whitespace-nowrap">
        <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-[#0A192F] shrink-0" /> FREE DELIVERY IN BANGLADESH
      </span>
      <span className="flex items-center gap-2 text-[#0A192F] font-bold uppercase text-[11px] sm:text-[12px] md:text-sm tracking-widest whitespace-nowrap">
        <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /> PREMIUM 220 GSM BIO-WASHED COTTON
      </span>
      <span className="flex items-center gap-2 text-[#0A192F] font-bold uppercase text-[11px] sm:text-[12px] md:text-sm tracking-widest whitespace-nowrap">
        <Leaf className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /> 100% ORGANIC VERIFIED SOURCE
      </span>
    </div>
  );

  return (
    <div className="w-full bg-[#FFFFFF] overflow-hidden h-10 md:h-12 flex items-center border-b border-[#0A192F]/10 select-none">
      <motion.div
        className="flex flex-nowrap w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration: 35, // Slow & smooth rotation
        }}
      >
        {/* Left Half Component */}
        <div className="flex shrink-0">
          {content}
          {content}
          {content}
        </div>
        {/* Exact Duplicate Right Half Component (Ensure 100% Seamless Loop!) */}
        <div className="flex shrink-0">
          {content}
          {content}
          {content}
        </div>
      </motion.div>
    </div>
  );
}
