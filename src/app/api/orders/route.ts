import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true
          }
        },
      },
    });
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerEmail, customerAddress, items, paymentMethod, trxId } = body;

    if (!customerName || !customerPhone || !customerAddress || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (["BKASH_MANUAL", "NAGAD_MANUAL"].includes(paymentMethod) && !trxId) {
      return NextResponse.json({ error: "Transaction ID required for manual payment methods" }, { status: 400 });
    }

    let totalAmount = 0;
    const itemEntries = (items as Array<{ productId: string; size: string; quantity: number; price: number; name: string }>).map((item) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      totalAmount += price * quantity;

      return {
        productId: item.productId,
        size: item.size,
        quantity,
        price,
      };
    });

    const serialId = `DV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 100000)}`;

    const order = await prisma.order.create({
      data: {
        serializedId: serialId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        customerAddress,
        totalAmount,
        status: "PENDING",
        paymentMethod,
        trxId: trxId || null,
        isPaid: false,
        items: {
          create: itemEntries,
        },
      },
      include: {
        items: true,
      },
    });

    // --- TRIGGER NOTIFICATIONS ---
    import("@/lib/notifications").then(async ({ sendSMS, sendEmail, getEmailTemplate }) => {
        // Customer SMS
        sendSMS(customerPhone, `Order Confirmed! Your DevVibe Order #${serialId} has been received. Track here: https://devvibe-mu.vercel.app/track?id=${order.id}`);
        
        // Admin SMS
        if (process.env.ADMIN_NOTIFICATION_PHONE) {
            sendSMS(process.env.ADMIN_NOTIFICATION_PHONE, `NEW ORDER! #${serialId} by ${customerName} (৳${totalAmount}). View: https://devvibe-mu.vercel.app/admin/orders/${order.id}`);
        }

        // Customer Email
        if (customerEmail) {
            const emailHtml = getEmailTemplate(order, "customer");
            sendEmail(customerEmail, `Order Confirmed: ${serialId}`, emailHtml);
        }

        // Admin Email
        if (process.env.ADMIN_NOTIFICATION_EMAIL) {
            const adminEmailHtml = getEmailTemplate(order, "admin");
            sendEmail(process.env.ADMIN_NOTIFICATION_EMAIL, `🚨 NEW ORDER: ${serialId}`, adminEmailHtml);
        }
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
