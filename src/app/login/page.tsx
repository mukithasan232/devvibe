"use client";

import { useState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login logic
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/profile";
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-neon/10 blur-[100px] rounded-full pointer-events-none" />
      
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
          <h1 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h1>
          <p className="text-brand-muted">Authenticate to access your DevVibe workspace.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-brand-text">Password</label>
              <a href="#" className="text-xs text-brand-neon hover:underline">Forgot password?</a>
            </div>
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
            className="w-full bg-brand-neon text-brand-bg font-bold py-3.5 rounded-lg hover:bg-[#4ddbb6] hover:scale-[1.02] transition-all flex justify-center items-center gap-2 group"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">Authenticating...</span>
            ) : (
               <span className="flex items-center gap-2">Login to Workspace <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
            )}
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-paper"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-brand-bg text-brand-muted">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-brand-paper rounded-lg text-white hover:bg-brand-paper hover:text-brand-neon transition-colors font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub
          </button>
          <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-brand-paper rounded-lg text-white hover:bg-brand-paper hover:text-brand-neon transition-colors font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg> Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-brand-muted">
          New to DevVibe? <Link href="/register" className="text-brand-neon hover:underline font-medium">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}
