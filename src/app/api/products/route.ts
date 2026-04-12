import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl, category, stockM, stockL, stockXL, stockXXL } = body;

    if (!name || !price) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description ?? "",
        price: Number(price),
        imageUrl: imageUrl || "https://devvibe.com/default-product.jpg",
        category: category || "Round Neck",
        stockM: Number(stockM ?? 0),
        stockL: Number(stockL ?? 0),
        stockXL: Number(stockXL ?? 0),
        stockXXL: Number(stockXXL ?? 0),
        isPublished: true,
        isLimitedEdition: body.isLimitedEdition || false,
        isPreOrder: body.isPreOrder || false,
        isComingSoon: body.isComingSoon || false,
      },
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
