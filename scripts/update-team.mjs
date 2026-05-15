import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.team.updateMany({
    where: { name: "Roshan and Vedant" },
    data: { name: "OffLearn" }
  });
  
  console.log(`Updated ${updated.count} team(s)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
