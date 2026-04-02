import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalSalesData = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: { id: true },
      where: { status: { not: "CANCELLED" } },
    });

    const lowStock = await prisma.product.count({
      where: {
        OR: [
          { stockM: { lt: 5 } },
          { stockL: { lt: 5 } },
          { stockXL: { lt: 5 } },
          { stockXXL: { lt: 5 } },
        ],
      },
    });

    const inventory = await prisma.product.findMany({
      select: { id: true, name: true, stockM: true, stockL: true, stockXL: true, stockXXL: true },
    });

    return NextResponse.json({
      totalSales: Number(totalSalesData._sum.totalAmount ?? 0),
      totalOrders: totalSalesData._count.id,
      lowStockItems: lowStock,
      inventory,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to load dashboard stats" }, { status: 500 });
  }
}
