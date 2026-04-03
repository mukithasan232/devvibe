"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/cart/CartContext";
import { useLanguage } from "@/components/LanguageContext";
import { ArrowRight, CheckCircle, ShieldCheck, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart, updateQuantity, removeFromCart } = useCart();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("SSLCOMMERZ");

  useEffect(() => {
    setMounted(true);
  }, []);
  const [trxId, setTrxId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderSerial, setOrderSerial] = useState("");
  
  // Automation State
  const [promoCode, setPromoCode] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [address, setAddress] = useState("");
  const [isCampus, setIsCampus] = useState(false);

  // Auto-detect Campus area based on address keywords
  const handleAddressChange = (val: string) => {
    setAddress(val);
    if (val.toLowerCase().includes("campus") || val.toLowerCase().includes("hall") || val.toLowerCase().includes("varsity")) {
      setIsCampus(true);
    } else {
      setIsCampus(false);
    }
  };

  const discount = isStudent || promoCode.toUpperCase() === "STUDENT10" ? 0.1 : 0;
  const shippingCharge = isCampus ? 0 : 60;
  const finalTotal = Math.round((totalAmount * (1 - discount)) + (items.length > 0 ? shippingCharge : 0));

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return alert("Cart is empty");

    if ((paymentMethod === "BKASH_MANUAL" || paymentMethod === "NAGAD_MANUAL") && !trxId.match(/^[A-Z0-9]{6,20}$/)) {
      return alert("Please enter a valid Transaction ID (alphanumeric 6-20 chars).");
    }

    setIsSubmitting(true);

    const payload = {
      customerName: (e.currentTarget.querySelector('input[type="text"]') as HTMLInputElement)?.value || "Guest",
      customerPhone: (e.currentTarget.querySelector('input[type="tel"]') as HTMLInputElement)?.value || "0",
      customerAddress: (e.currentTarget.querySelector('textarea') as HTMLTextAreaElement)?.value || "",
      items: items.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      paymentMethod,
      trxId: paymentMethod === "BKASH_MANUAL" || paymentMethod === "NAGAD_MANUAL" ? trxId : null,
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const err = await response.json();
      return alert(err?.error || "Checkout failed. Please try again.");
    }

    const data = await response.json();

    const generatedId = data?.order?.serializedId || `DV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 10000)}`;
    setOrderSerial(generatedId);

    setIsSuccess(true);
    clearCart();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in">
        <div className="w-24 h-24 bg-brand-neon/20 text-brand-neon rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-neon">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">{t.orderConfirmed}</h1>
        <p className="text-brand-muted text-lg mb-8">
          Your order ID: <span className="text-brand-neon font-mono bg-brand-neon/10 px-2 py-1 rounded">{orderSerial}</span>
        </p>
        
        {/* Post-Purchase Reward QR */}
        <div className="bg-brand-paper p-8 rounded-2xl border border-brand-card mb-12 max-w-sm mx-auto">
          <p className="text-white font-bold mb-4">{t.scanReward}</p>
          <div className="bg-white p-2 rounded-lg inline-block mb-4">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DevVibe-Reward-${orderSerial}`} 
              alt="Reward QR Code"
              className="w-32 h-32"
            />
          </div>
          <p className="text-brand-muted text-xs">Scan this receipt code for a Special Coupon on your next order!</p>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-brand-neon text-brand-bg font-bold px-8 py-4 rounded-lg hover:bg-[#4ddbb6] transition-colors"
        >
          {t.returnToShop} <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="sticky top-0 z-50 w-full bg-brand-bg/80 backdrop-blur-md border-b border-brand-paper mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group transition-all">
              <div className="relative w-32 h-10 overflow-hidden transform group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo/DevVibe.png"
                  alt="DevVibe Logo"
                  fill
                  className="object-contain"
                  sizes="128px"
                  priority
                />
              </div>
            </Link>
            <div className="text-brand-muted text-xs font-mono uppercase tracking-widest hidden sm:block">
              Checkout Process — Step 1/1
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">{t.secureCheckout}</h1>
          <p className="text-brand-muted flex items-center gap-2">
            <ShieldCheck size={18} className="text-brand-neon" /> 256-bit Encrypted Session
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8 animate-fade-in">
            {/* Customer Details */}
            <div className="bg-brand-paper p-8 rounded-2xl border border-brand-card">
              <h2 className="text-xl font-semibold text-white mb-6">Execution Payload (Shipping)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-muted">Full Name</label>
                  <input required type="text" className="w-full bg-brand-bg border border-brand-card rounded-lg px-4 py-3 text-white outline-none focus:border-brand-neon transition-colors" placeholder="Linus Torvalds" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-muted">Phone Number</label>
                  <input required type="tel" className="w-full bg-brand-bg border border-brand-card rounded-lg px-4 py-3 text-white outline-none focus:border-brand-neon transition-colors" placeholder="01XXXXXXXXX" />
                </div>
              </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-muted">Delivery Address Array</label>
                  <textarea 
                    required 
                    rows={3} 
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className="w-full bg-brand-bg border border-brand-card rounded-lg px-4 py-3 text-white outline-none focus:border-brand-neon transition-colors resize-none" 
                    placeholder="House 123, Campus Hall, Varsity Area..." 
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="checkbox" 
                      id="is-campus" 
                      checked={isCampus}
                      onChange={(e) => setIsCampus(e.target.checked)}
                      className="w-4 h-4 rounded border-brand-card bg-brand-bg text-brand-neon focus:ring-brand-neon"
                    />
                    <label htmlFor="is-campus" className="text-xs text-brand-muted cursor-pointer">This is a Campus/University delivery (Free Shipping)</label>
                  </div>
                </div>
              </div>

              {/* Student ID Discount */}
              <div className="bg-brand-paper p-8 rounded-2xl border border-brand-card">
                <h2 className="text-xl font-semibold text-white mb-6">Automation & Discounts</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <input 
                      type="checkbox" 
                      id="is-student" 
                      checked={isStudent}
                      onChange={(e) => setIsStudent(e.target.checked)}
                      className="w-5 h-5 rounded border-brand-card bg-brand-bg text-brand-neon focus:ring-brand-neon"
                    />
                    <label htmlFor="is-student" className="text-sm text-white font-medium cursor-pointer">I have a valid Student ID Card (10% Discount)</label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-muted">Promo Code</label>
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-card rounded-lg px-4 py-3 text-white outline-none focus:border-brand-neon transition-colors uppercase font-mono" 
                      placeholder="e.g. STUDENT10" 
                    />
                  </div>
                </div>
              </div>

            {/* Payment Method */}
            <div className="bg-brand-paper p-8 rounded-2xl border border-brand-card">
              <h2 className="text-xl font-semibold text-white mb-6">Payment Gateway</h2>
              <div className="space-y-4">
                <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === "SSLCOMMERZ" ? "border-brand-neon bg-brand-neon/5" : "border-brand-card bg-brand-bg hover:border-brand-muted"}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="SSLCOMMERZ" checked={paymentMethod === "SSLCOMMERZ"} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-brand-neon" />
                    <div className="flex-1">
                      <span className="block text-white font-medium">SSLCommerz (Auto API)</span>
                      <span className="text-xs text-brand-muted">Cards, Mobile Banking, Net Banking</span>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === "BKASH_MANUAL" ? "border-brand-neon bg-brand-neon/5" : "border-brand-card bg-brand-bg hover:border-brand-muted"}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="BKASH_MANUAL" checked={paymentMethod === "BKASH_MANUAL"} onChange={(e) => { setPaymentMethod(e.target.value); setTrxId(""); }} className="w-4 h-4 text-brand-neon" />
                    <div className="flex-1">
                      <span className="block text-white font-medium">bKash Send Money (Manual)</span>
                      <span className="text-xs text-brand-muted">01XXXXXXXXX (Personal)</span>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === "NAGAD_MANUAL" ? "border-brand-neon bg-brand-neon/5" : "border-brand-card bg-brand-bg hover:border-brand-muted"}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="NAGAD_MANUAL" checked={paymentMethod === "NAGAD_MANUAL"} onChange={(e) => { setPaymentMethod(e.target.value); setTrxId(""); }} className="w-4 h-4 text-brand-neon" />
                    <div className="flex-1">
                      <span className="block text-white font-medium">Nagad Send Money (Manual)</span>
                      <span className="text-xs text-brand-muted">01XXXXXXXXX (Personal)</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* TrxID Input for Manual Methods */}
              {(paymentMethod === "BKASH_MANUAL" || paymentMethod === "NAGAD_MANUAL") && (
                <div className="mt-6 pt-6 border-t border-brand-card animate-fade-in">
                  <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-6">
                    <p className="text-yellow-400 text-sm">
                      Please send <strong>৳{totalAmount + 60}</strong> to our {paymentMethod.split("_")[0]} number and paste the Transaction ID exactly as received.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-muted">Transaction ID (TrxID)</label>
                    <input 
                      required 
                      type="text" 
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      className="w-full bg-brand-bg border border-brand-neon rounded-lg px-4 py-3 text-white outline-none focus:shadow-[0_0_15px_rgba(57,255,20,0.2)] font-mono uppercase transition-shadow" 
                      placeholder="e.g. 9XZ6Q2A4" 
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-5">
          {/* Order Summary Sticky Sidebar */}
          <div className="bg-brand-paper p-8 rounded-2xl border border-brand-card sticky top-24">
            <h2 className="text-xl font-semibold text-white mb-6">{t.orderSummary}</h2>
            
            {!mounted || items.length === 0 ? (
              <p className="text-brand-muted py-4">Your execution payload is empty.</p>
            ) : (
              <div className="space-y-6 mb-6">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex justify-between items-start gap-4 text-sm bg-brand-bg/40 p-3 rounded-lg border border-brand-card/50"
                    >
                      <div className="flex flex-col flex-1">
                        <span className="text-white font-medium mb-1">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-brand-muted font-mono text-[10px]">Size: {item.size}</span>
                          <div className="flex items-center gap-2 bg-brand-bg border border-brand-card rounded-md px-1">
                            <button 
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-brand-muted hover:text-brand-neon transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-white font-mono text-xs min-w-[12px] text-center">{item.quantity}</span>
                            <button 
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-brand-muted hover:text-brand-neon transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-white font-bold">৳{item.price * item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {!mounted ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-brand-card rounded w-3/4"></div>
                <div className="h-4 bg-brand-card rounded w-1/2"></div>
                <div className="h-8 bg-brand-card rounded w-full mt-6"></div>
              </div>
            ) : (
              <>
                <div className="border-t border-brand-card py-4 space-y-3 mb-6">
                  <div className="flex justify-between text-brand-muted text-sm">
                    <span>{t.subtotal}</span>
                    <span>৳{totalAmount}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-brand-neon text-sm font-mono">
                      <span>{t.studentDiscount}</span>
                      <span>-৳{Math.round(totalAmount * discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-muted text-sm">
                    <span>{t.delivery} {isCampus ? "(Campus Free)" : "(Inside BD)"}</span>
                    <span>{isCampus ? <span className="text-brand-neon uppercase text-[10px] font-bold">Free</span> : `৳${shippingCharge}`}</span>
                  </div>
                </div>

                <div className="flex justify-between text-white font-bold text-xl mb-8 border-t border-brand-card pt-4">
                  <span>{t.total}</span>
                  <span className="text-brand-neon">৳{finalTotal}</span>
                </div>
              </>
            )}

            <button 
              type="submit" 
              form="checkout-form"
              disabled={!mounted || isSubmitting || items.length === 0}
              className="w-full bg-brand-neon text-brand-bg font-bold py-4 rounded-lg hover:bg-[#4ddbb6] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="animate-pulse">{t.processing}</span>
              ) : (
                <>{t.placeOrder} <ArrowRight size={18} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
