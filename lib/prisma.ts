import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { Pool, PoolConfig } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const isProduction = process.env.NODE_ENV === "production";

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: isProduction ? 20 : 5,
  min: isProduction ? 5 : 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: !isProduction,
};

const pool = globalForPrisma.pool ?? new Pool(poolConfig);
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

process.on("beforeExit", async () => {
  await prisma.$disconnect();
  await pool.end();
});
