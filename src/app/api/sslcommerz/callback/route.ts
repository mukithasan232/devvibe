import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const SHARED_SECRET = process.env.SSLCOMMERZ_CALLBACK_SECRET || "devvibe-local-secret";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("x-sslcommerz-secret");
    if (!token || token !== SHARED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, status, paymentId } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const maybeOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!maybeOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const update = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status === "VALID" ? "PROCESSING" : "CANCELLED",
        isPaid: status === "VALID",
        trackingUrl: paymentId ? `https://sslcommerz.com/txn/${paymentId}` : undefined,
      },
    });

    return NextResponse.json({ success: true, order: update }, { status: 200 });
  } catch (error) {
    console.error("SSLCommerz callback failure", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
