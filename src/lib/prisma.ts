import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Prevent multiple clients in development due to hot reload
declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = global.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
