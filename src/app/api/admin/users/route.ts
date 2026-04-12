import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Aggregate unique customers based on phone number
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: true
            }
        });

        // Synthesize customer profiles from order data
        const customerMap = new Map();

        orders.forEach(order => {
            const phone = order.customerPhone;
            if (!customerMap.has(phone)) {
                customerMap.set(phone, {
                    name: order.customerName,
                    phone: order.customerPhone,
                    address: order.customerAddress,
                    totalOrders: 0,
                    totalSpent: 0,
                    lastOrder: order.createdAt,
                    status: "ACTIVE"
                });
            }

            const customer = customerMap.get(phone);
            customer.totalOrders += 1;
            customer.totalSpent += order.totalAmount;
            if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
                customer.lastOrder = order.createdAt;
            }
        });

        const users = Array.from(customerMap.values());

        return NextResponse.json({ users });
    } catch (error) {
        console.error("User Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}
