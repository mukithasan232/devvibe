import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { path } = await req.json();
    const userAgent = req.headers.get("user-agent");

    if (path && !path.startsWith("/admin") && !path.startsWith("/api")) {
      await prisma.pageView.create({
        data: {
          path,
          userAgent,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Fail silently to not disrupt the user experience
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
