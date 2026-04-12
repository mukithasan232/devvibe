import prisma from '../src/lib/prisma';

const categories = ["Solid", "Graphics", "Drop Shoulder"];
const adjectives = ["Infinite", "Quantum", "Cyber", "Aesthetic", "Minimalist", "Oversized", "Premium", "Core", "Legacy", "Syntax", "Binary", "Stealth"];
const nouns = ["Cotton", "Jersey", "Hoodie", "Vibe", "Drop", "Release", "Element", "Artifact", "Protocol", "Echo", "Void", "Matrix"];

const descriptions = [
  "220 GSM Bio-Washed premium cotton for ultimate comfort.",
  "Breathable 180 GSM cotton with high-fidelity print quality.",
  "Engineered for a relaxed, modern fit. Style meets performance.",
  "Limited batch release featuring the iconic DevVibe tech-minimalism.",
  "Durable, soft-touch fabric designed for the modern developer lifestyle.",
  "Pre-shrunk and silicon-washed for a lasting premium feel."
];

const images = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800",
  "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800",
];

async function main() {
  console.log("Starting massive 120-product seed...");
  
  // Clear existing products to avoid conflicts if needed, or just upsert
  // For 120 items, let's just create them.
  
  const createdProducts = [];

  for (let i = 1; i <= 120; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
    const img = images[Math.floor(Math.random() * images.length)];
    
    const price = cat === "Drop Shoulder" ? 650 : (Math.random() > 0.5 ? 450 : 550);
    const costPrice = price - 250;
    
    const isLimited = Math.random() < 0.15; // 15% chance to be limited edition

    createdProducts.push({
      name: `${adj} ${noun} v${i}`,
      price: price,
      costPrice: costPrice,
      description: desc,
      category: cat,
      imageUrl: img,
      stockM: Math.floor(Math.random() * 50) + 10,
      stockL: Math.floor(Math.random() * 50) + 10,
      stockXL: Math.floor(Math.random() * 50) + 10,
      stockXXL: Math.floor(Math.random() * 50) + 5,
      isPublished: true,
      isLimitedEdition: isLimited
    });
  }

  // Use createMany for performance
  await prisma.product.createMany({
    data: createdProducts
  });

  console.log(`Success! 120 products deployed to the Matrix.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
