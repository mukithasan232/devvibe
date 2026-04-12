import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration is handled dynamically inside the POST handler to ensure environment variables are available.

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Just-in-time configuration to ensure environment variables are loaded
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json(
        { error: "Cloudinary configuration is incomplete in .env or dashboard" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files detected in payload" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: "devvibe_products",
            resource_type: "auto"
          },
          (error, result) => {
            if (error) {
                console.error("Cloudinary Handshake Failed:", error);
                reject(error);
            }
            else resolve(result?.secure_url as string);
          }
        );
        uploadStream.end(buffer);
      });
    });

    const secureUrls = await Promise.all(uploadPromises);
    return NextResponse.json({ urls: secureUrls });
  } catch (error: any) {
    console.error("CRITICAL_UPLOAD_FAILURE:", error);
    return NextResponse.json({ 
      error: error.message || "Media deployment failed",
      details: error.toString()
    }, { status: 500 });
  }
}
