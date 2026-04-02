/* eslint-disable react/no-unescaped-entities */
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "DevVibe Admin Dashboard",
  description: "Admin panel for product and order management at DevVibe Clothing",
};

async function fetchDashboardStats() {
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

  return {
    totalSales: Number(totalSalesData._sum.totalAmount ?? 0),
    totalOrders: totalSalesData._count.id,
    lowStock,
  };
}

export default async function AdminDashboard() {
  const { totalSales, totalOrders, lowStock } = await fetchDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-paper p-6 rounded-xl border border-brand-card flex flex-col">
          <span className="text-brand-muted text-sm uppercase tracking-wider">Today's Sales</span>
          <span className="text-3xl font-bold text-brand-neon mt-2">৳{totalSales.toLocaleString()}</span>
        </div>
        <div className="bg-brand-paper p-6 rounded-xl border border-brand-card flex flex-col">
          <span className="text-brand-muted text-sm uppercase tracking-wider">Total Orders</span>
          <span className="text-3xl font-bold text-white mt-2">{totalOrders}</span>
        </div>
        <div className="bg-brand-paper p-6 rounded-xl border border-brand-card flex flex-col">
          <span className="text-brand-muted text-sm uppercase tracking-wider">Low Stock Alerts</span>
          <span className="text-3xl font-bold text-red-500 mt-2">{lowStock} Items</span>
        </div>
      </div>
    </div>
  );
}
