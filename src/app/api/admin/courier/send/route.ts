import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // 1. Fetch Order Details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.courierTrackingId) {
      return NextResponse.json({ error: "Order already sent to courier", trackingId: order.courierTrackingId }, { status: 400 });
    }

    // 2. Courier Integration Logic (Using Steadfast as default)
    const STEADFAST_API_KEY = process.env.STEADFAST_API_KEY;
    const STEADFAST_SECRET_KEY = process.env.STEADFAST_SECRET_KEY;

    let trackingId = "";
    let courierOrderId = "";

    if (!STEADFAST_API_KEY || !STEADFAST_SECRET_KEY) {
      // MOCK MODE: Use this if actual API keys are missing for testing
      console.log("⚠️ STEADFAST_API_KEY missing. Running in MOCK mode.");
      trackingId = `SF-MOCK-${Math.floor(Math.random() * 1000000)}`;
      courierOrderId = `C-${Math.floor(Math.random() * 1000000)}`;
    } else {
      // ACTUAL INTEGRATION
      try {
        const courierRes = await fetch("https://portal.steadfast.com.bd/api/v1/create_order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Key": STEADFAST_API_KEY,
            "Secret-Key": STEADFAST_SECRET_KEY,
          },
          body: JSON.stringify({
            invoice: order.serializedId,
            recipient_name: order.customerName,
            recipient_phone: order.customerPhone,
            recipient_address: order.customerAddress,
            cod_amount: order.paymentMethod === "CASH_ON_DELIVERY" ? order.totalAmount : 0,
            note: "DevVibe Fabric - Please handle with care",
          }),
        });

        const courierData = await courierRes.json();
        
        if (courierData.status === 200) {
          trackingId = courierData.consignment.tracking_code;
          courierOrderId = courierData.consignment.consignment_id;
        } else {
          console.error("Steadfast API Error:", courierData);
          return NextResponse.json({ error: courierData.message || "Courier API rejected the request" }, { status: 500 });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        return NextResponse.json({ error: "Connection to Courier API failed" }, { status: 500 });
      }
    }

    // 3. Update Order with Courier Info
    await prisma.order.update({
      where: { id: orderId },
      data: {
        courierTrackingId: trackingId,
        courierOrderId: courierOrderId,
        status: "SHIPPED", // Automatically move workflow forward
        trackingUrl: `https://steadfast.com.bd/t/${trackingId}`,
      },
    });

    return NextResponse.json({ 
      success: true, 
      trackingId, 
      courierOrderId,
      message: "Order successfully dispatched to courier" 
    });

  } catch (error) {
    console.error("Courier Request Error:", error);
    return NextResponse.json({ error: "Internal server error during courier request" }, { status: 500 });
  }
}
