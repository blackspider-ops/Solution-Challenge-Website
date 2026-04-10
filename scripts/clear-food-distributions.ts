import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Clearing all food distributions...");

  const result = await prisma.foodDistribution.deleteMany({});

  console.log(`✓ Deleted ${result.count} food distribution records`);
  console.log("\nFood distribution data cleared successfully!");
}

main()
  .catch((e) => {
    console.error("Error clearing food distributions:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
