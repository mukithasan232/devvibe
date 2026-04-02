import { defineConfig } from "@prisma/config";
import fs from "fs";
import path from "path";

// Prisma 7 requires the connection in the config, and we need to manually 
// parse the .env file because the Prisma CLI might not have it loaded in memory yet.
const loadEnvUrl = () => {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return null;
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/^DATABASE_URL=["']?(.+?)["']?$/m) || 
                  content.match(/^DATABASE_DATABASE_URL=["']?(.+?)["']?$/m) ||
                  content.match(/^POSTGRES_PRISMA_URL=["']?(.+?)["']?$/m);
    return match ? match[1] : null;
  } catch (err) {
    return null;
  }
};

const url = process.env.DATABASE_URL || 
            process.env.POSTGRES_PRISMA_URL || 
            process.env.POSTGRES_URL || 
            loadEnvUrl();

export default defineConfig({
  datasource: {
    url: url || "",
  },
  migrations: {
    seed: 'npx tsx --env-file=.env prisma/seed.ts',
  },
});
