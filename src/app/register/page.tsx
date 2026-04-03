"use client";

import { useState } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CustomerRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock registration logic
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/profile";
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-neon/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-brand-card/30 backdrop-blur-xl border border-brand-paper rounded-2xl p-8 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="relative w-40 h-12 mx-auto mb-6">
            <Image 
              src="/images/logo/DevVibe.png" 
              alt="DevVibe Logo" 
              fill 
              className="object-contain"
              sizes="160px"
              priority
            />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Create Account</h1>
          <p className="text-brand-muted">Join the DevVibe community.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
                <User size={18} />
              </div>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-brand-bg border border-brand-paper rounded-lg pl-10 pr-4 py-3 text-white focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all" 
                placeholder="Linus Torvalds" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-bg border border-brand-paper rounded-lg pl-10 pr-4 py-3 text-white focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all" 
                placeholder="dev@example.com" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-bg border border-brand-paper rounded-lg pl-10 pr-4 py-3 text-white focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-neon text-brand-bg font-bold py-3.5 rounded-lg hover:bg-[#4ddbb6] hover:scale-[1.02] transition-all flex justify-center items-center gap-2 group mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">Creating Workspace...</span>
            ) : (
               <span className="flex items-center gap-2">Register <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-brand-muted">
          Already have an account? <Link href="/login" className="text-brand-neon hover:underline font-medium">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
