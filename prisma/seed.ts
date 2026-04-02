import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    { id: "1", name: "Modern Minimalist (Round)", price: 450, category: "Round Neck", description: "180 GSM premium cotton", stockM: 100 },
    { id: "2", name: "Source Code Black (Round)", price: 450, category: "Round Neck", description: "180 GSM premium cotton", stockM: 100 },
    { id: "3", name: "DevVibe Signature (Round)", price: 450, category: "Round Neck", description: "180 GSM premium cotton", stockM: 100 },
    { id: "4", name: "Premium Comfort (Drop)", price: 650, category: "Drop Shoulder", description: "220 GSM premium cotton", stockM: 100 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
