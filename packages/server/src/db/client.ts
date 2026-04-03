import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});

export const db = new PrismaClient({ adapter });
export type DbClient = typeof db;
