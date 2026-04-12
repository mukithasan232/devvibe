import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) return { title: "Product Not Found | DevVibe" };

  return {
    title: `${product.name} | DevVibe Premium Apparel`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.imageUrl?.split(",")[0] || "" }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      orderItems: true
    }
  });

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
