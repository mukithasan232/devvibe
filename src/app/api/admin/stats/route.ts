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

    // 2. Financial Aggregation
    let totalRevenue = 0;
    let totalCost = 0;
    let totalOrders = orders.length;
    let pendingOrders = 0;
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

        if (order.status === 'PENDING') pendingOrders++;
      }
    });

    const netProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // 3. Sort Top Products
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalCost,
        netProfit,
        profitMargin: profitMargin.toFixed(2),
        totalOrders,
        pendingOrders,
      },
      topProducts,
      recentPerformance: [] // Placeholder for graph data
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
