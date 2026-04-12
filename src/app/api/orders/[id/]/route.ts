import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { customerName, customerPhone, customerAddress, status } = await req.json();

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        customerName,
        customerPhone,
        customerAddress,
        status,
      },
      include: {
          items: {
              include: {
                  product: true
              }
          }
      }
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order Update Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.order.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
}
