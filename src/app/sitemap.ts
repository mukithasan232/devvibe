import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    { url: "https://devvibe.com", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://devvibe.com/checkout", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://devvibe.com/profile", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://devvibe.com/admin", lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  try {
    const products = await prisma.product.findMany({ select: { id: true, updatedAt: true } });
    products.forEach((product: { id: string; updatedAt: Date }) => {
      urls.push({
        url: `https://devvibe.com/products/${product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.75,
      });
    });
  } catch (error) {
    console.error("Sitemap generation error", error);
  }

  return urls;
}
