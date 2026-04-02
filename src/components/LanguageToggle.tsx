"use client";

import { useLanguage } from "./LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-brand-paper rounded-full p-1 border border-brand-card">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
          language === "en"
            ? "bg-brand-neon text-brand-bg shadow-[0_0_10px_rgba(57,255,20,0.3)]"
            : "text-brand-muted hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("bn")}
        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
          language === "bn"
            ? "bg-brand-neon text-brand-bg shadow-[0_0_10px_rgba(57,255,20,0.3)]"
            : "text-brand-muted hover:text-white"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
