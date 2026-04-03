"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight, Lock, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AdminLoginPage() {
  const [secret, setSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // The middleware handles the actual security check via cookies.
    // We set the cookie by visiting the admin route with the secret param.
    try {
      const res = await fetch(`/admin?secret=${secret}`, { method: "GET" });
      
      if (res.ok) {
        // Successful "login" via redirect/cookie set in middleware
        router.push("/admin");
      } else {
        setError("Invalid Admin Secret. Check your .env configuration.");
      }
    } catch (err) {
      setError("Connection failed. System offline.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-neon/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-brand-paper border border-brand-card rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-neon to-transparent" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-40 h-12 mb-6">
              <Image 
                src="/images/logo/DevVibe.png" 
                alt="DevVibe Logo" 
                fill 
                className="object-contain"
                sizes="160px"
                priority
              />
            </div>
            <div className="w-16 h-16 bg-brand-bg rounded-xl border border-brand-paper flex items-center justify-center text-brand-neon mb-4 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              <ShieldAlert size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Control</h1>
            <p className="text-brand-muted text-sm mt-1">Provide Admin Authorization Secret</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-brand-muted uppercase tracking-widest flex items-center gap-2">
                <Terminal size={14} /> Authorization Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                <input
                  required
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter secret key..."
                  className="w-full bg-brand-bg border border-brand-card rounded-lg pl-10 pr-4 py-3 text-white outline-none focus:border-brand-neon focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] transition-all font-mono"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded flex items-center gap-2"
              >
                <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                {error}
              </motion.div>
            )}

            <button
              disabled={isLoading || !secret}
              className="w-full bg-brand-neon text-brand-bg font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#4ddbb6] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : "Establish Secure Session"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-brand-muted font-mono uppercase tracking-[0.2em]">
            DevVibe Core — Secured Node
          </p>
        </div>
      </motion.div>
    </div>
  );
}
