import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE() {
  try {
    // Delete all order items first to avoid foreign key constraints
    await prisma.orderItem.deleteMany({});
    // Delete all products
    await prisma.product.deleteMany({});
    
    return NextResponse.json({ success: true, message: "All products and related items cleared" });
  } catch (error) {
    console.error("Purge Products Error:", error);
    return NextResponse.json({ error: "Failed to purge products" }, { status: 500 });
  }
}
