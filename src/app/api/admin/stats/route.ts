import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Fetch all orders with items and product details
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    const products = await prisma.product.findMany();

    // 2. Financial Aggregation
    let totalRevenue = 0;
    let totalCost = 0;
    let totalOrders = orders.filter(o => o.status !== 'CANCELLED').length;
    let pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    let productSales: Record<string, { name: string, quantity: number, revenue: number }> = {};

    orders.forEach(order => {
      if (order.status !== 'CANCELLED') {
        totalRevenue += order.totalAmount;
        
        order.items.forEach(item => {
          totalCost += (item.product?.costPrice || 0) * item.quantity;
          
          if (!productSales[item.productId]) {
            productSales[item.productId] = { name: item.product?.name || "Unknown Product", quantity: 0, revenue: 0 };
          }
          productSales[item.productId].quantity += item.quantity;
          productSales[item.productId].revenue += item.price * item.quantity;
        });
      }
    });

    const netProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 3. Last 7 Days Performance (Improved Logic)
    const recentPerformance = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().slice(0, 10);
      
      const dayOrders = orders.filter(o => o.createdAt.toISOString().slice(0, 10) === dateStr && o.status !== 'CANCELLED');
      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

      return { label: dayLabel, revenue: dayRevenue };
    });

    // 4. Sort Top Products
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalCost,
        netProfit,
        profitMargin: profitMargin.toFixed(1),
        totalOrders,
        pendingOrders,
        aov: Math.round(aov),
        totalInventoryValue: products.reduce((sum, p) => sum + (p.costPrice * (p.stockM + p.stockL + p.stockXL + p.stockXXL)), 0)
      },
      topProducts,
      recentPerformance,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
