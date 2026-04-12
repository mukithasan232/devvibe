import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Find the order by serializedId (e.g., DV-2024...)
    const order = await prisma.order.findUnique({
      where: { serializedId: id },
      select: {
        serializedId: true,
        status: true,
        trackingUrl: true,
        courierTrackingId: true,
        createdAt: true,
        customerName: true, // Only for greeting, no sensitive data
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found. Please check your ID and try again." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Tracking API Error:", error);
    return NextResponse.json({ error: "Failed to fetch tracking data" }, { status: 500 });
  }
}
