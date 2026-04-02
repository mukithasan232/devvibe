import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { User } from "lucide-react";
import CartHeaderIcon from "@/components/cart/CartHeaderIcon";
import { Providers } from "@/components/Providers";
import { LanguageProvider } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import { Analytics } from "@vercel/analytics/next";;

// Optimize Google Font with Inter for tech-aesthetic
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Advanced SEO Metadata Configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://devvibe.com'),
  title: "DevVibe Clothing | Premium Tech Apparel for Developers",
  description:
    "Compiled for Comfort. DevVibe offers 100% organic cotton tech-themed t-shirts in Bangladesh. Designed for developers, tech-enthusiasts, and students.",
  keywords: [
    "Developer T-shirts Bangladesh",
    "Coding Apparel",
    "Premium Cotton Tech T-shirts",
    "DevVibe Clothing",
    "MD Mukit Hasan",
  ],
  openGraph: {
    title: "DevVibe Clothing | Compiled for Comfort",
    description: "Premium tech apparel for developers and tech enthusiasts.",
    url: "https://devvibe.com",
    siteName: "DevVibe Clothing",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevVibe Clothing",
    description: "Compiled for Comfort. Premium tech apparel.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "DevVibe Clothing",
    "founder": {
      "@type": "Person",
      "name": "MD Mukit Hasan"
    },
    "url": "https://devvibe.com",
    "logo": "https://devvibe.com/logo.png",
    "slogan": "Compiled for Comfort",
    "description": "Premium Cotton Tech T-shirts for Developers and Tech Enthusiasts",
    "sameAs": [
      "https://facebook.com/devvibe",
      "https://github.com/devvibe",
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} antialiased scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <LanguageProvider>
          <Providers>
          {/* Navigation / Header */}
          <header className="sticky top-0 z-50 w-full bg-brand-bg/80 backdrop-blur-md border-b border-brand-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Link href="/" className="text-2xl font-bold text-brand-neon hover:text-white transition-colors cursor-pointer tracking-tight">
                  <span className="text-white">&lt;</span>DevVibe
                  <span className="text-white">/&gt;</span>
                </Link>
              </div>
              <nav className="hidden md:flex gap-8">
                {["Collections", "Tech Specs", "About"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-brand-text hover:text-brand-neon text-sm font-medium transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
              <div className="flex items-center gap-4">
                <LanguageToggle />
                <Link href="/profile" className="p-2 text-brand-text hover:text-brand-neon transition-colors" aria-label="Customer Profile">
                  <User size={20} />
                </Link>
                <CartHeaderIcon />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area with page transition animations */}
        <main className="flex-grow relative overflow-hidden">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        {/* Footer section */}
        <footer className="bg-brand-paper border-t border-brand-card py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 relative overflow-hidden">
              <div className="col-span-1 md:col-span-2 space-y-4">
                <div className="text-2xl font-bold text-white">DevVibe</div>
                <p className="text-brand-muted max-w-sm text-sm">
                  Compiled for Comfort. <br />
                  Founded by <span className="text-white font-medium">MD Mukit Hasan</span>.
                </p>
                <form className="flex gap-2 max-w-sm mt-4">
                  <input
                    type="email"
                    placeholder="Enter email to console.log(news)"
                    className="bg-brand-bg border border-brand-card rounded-md px-4 py-2 w-full text-sm text-brand-text placeholder-brand-muted outline-none focus:border-brand-neon transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-brand-neon text-brand-bg font-semibold px-4 py-2 rounded-md hover:bg-[#4ddbb6] transition-colors whitespace-nowrap text-sm"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-brand-muted">
                  <li><Link href="/" className="hover:text-brand-neon transition-colors">Shop</Link></li>
                  <li><Link href="/admin/orders" className="hover:text-brand-neon transition-colors">Track Order</Link></li>
                  <li><Link href="/" className="hover:text-brand-neon transition-colors">Return Policy</Link></li>
                  <li><Link href="/" className="hover:text-brand-neon transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Connect</h4>
                <div className="flex gap-4">
                  <a href="#" aria-label="GitHub" className="text-brand-muted hover:text-brand-neon transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.12-.34 6.2-.34 6.2-7.02 0-1.52-.5-2.82-1.42-3.82.1-.22.64-1.82-.14-3.76 0 0-1.16-.38-3.9 1.48A13.3 13.3 0 0 0 12 5.5c-1.3.02-2.6.2-3.8.54-2.74-1.86-3.9-1.48-3.9-1.48-.78 1.94-.24 3.54-.14 3.76-.92 1-1.42 2.3-1.42 3.82 0 6.66 3.08 6.66 6.2 7.02A4.8 4.8 0 0 0 8 18v4"></path></svg>
                  </a>
                  <a href="#" aria-label="Twitter" className="text-brand-muted hover:text-brand-neon transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </a>
                  <a href="#" aria-label="LinkedIn" className="text-brand-muted hover:text-brand-neon transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-brand-card pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-brand-muted text-sm text-center md:text-left">
                © {new Date().getFullYear()} DevVibe Clothing. All rights reserved.
              </p>
              <div className="text-brand-neon text-sm flex items-center gap-1">
                <span>{`</>`}</span> Made by a Developer for Developers
              </div>
            </div>
          </div>
        </footer>
          </Providers>
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
