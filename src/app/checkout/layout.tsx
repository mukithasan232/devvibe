import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | DevVibe Clothing",
  description: "Secure checkout with SSLCommerz and manual bKash/Nagad options.",
  openGraph: {
    title: "Checkout | DevVibe Clothing",
    description: "Secure checkout with SSLCommerz and manual bKash/Nagad options.",
    url: "https://devvibe.com/checkout",
    siteName: "DevVibe Clothing",
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
