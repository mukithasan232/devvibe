import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (
      !process.env.CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY === "your_api_key"
    ) {
      return NextResponse.json(
        { error: "Cloudinary API keys are missing in .env file" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      return new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "devvibe_products" },
          (error, result) => {
            if (error) {
                console.error("Cloudinary Error:", error);
                reject(error);
            }
            else resolve(result?.secure_url as string);
          }
        ).end(buffer);
      });
    });

    const secureUrls = await Promise.all(uploadPromises);
    return NextResponse.json({ urls: secureUrls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
