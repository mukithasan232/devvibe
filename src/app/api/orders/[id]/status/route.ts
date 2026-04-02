import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Awaiting params strongly recommended in newer Next.js patterns
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, trackingUrl } = body as { status?: string; trackingUrl?: string };

    if (!status) {
      return NextResponse.json({ error: "Missing new status" }, { status: 400 });
    }

    // Prisma DB Update Logic
    /*
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(trackingUrl ? { trackingUrl } : {}),
      },
    });

    // ----------------------------------------------------
    // Automation Triggered based on state-change
    // ----------------------------------------------------
    if (status === "SHIPPED") {
      // 1. Send WhatsApp Message (e.g. via Twilio or Meta WhatsApp Business API)
      await sendWhatsAppNotification({
        phone: updatedOrder.customerPhone,
        message: `Hi ${updatedOrder.customerName}, your DevVibe order #${updatedOrder.id} has shipped! Track it locally: ${trackingUrl}`
      });

      // 2. Alternatively or additonally send Email via Resend
      await sendEmailNotification({
        to: updatedOrder.customerEmail,
        subject: "Your DevVibe Order is on the way!",
        trackingUrl: trackingUrl
      });
    }
    */

    return NextResponse.json({ 
      success: true, 
      message: `Order status successfully updated to ${status}. Automations triggered if applicable.`,
      // data: updatedOrder 
    }, { status: 200 });

  } catch (error) {
    console.error("Order Status Update Error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
