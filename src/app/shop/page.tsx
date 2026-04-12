import { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop | DevVibe Clothing",
  description: "Explore our full collection of premium tech apparel. Compiled for comfort, designed for developers.",
};

export default function ShopPage() {
  return <ShopClient />;
}
