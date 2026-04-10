import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding sample rooms...");

  const rooms = [
    {
      name: "Innovation Lab A",
      description: "Spacious room with whiteboards and power outlets",
      capacity: 2,
      order: 0,
      active: true,
    },
    {
      name: "Collaboration Hub B",
      description: "Open space with comfortable seating and monitors",
      capacity: 3,
      order: 1,
      active: true,
    },
  ];

  for (const room of rooms) {
    const result = await prisma.room.upsert({
      where: { name: room.name },
      update: room,
      create: room,
    });
    console.log(`✓ ${result.name} (QR Token: ${result.qrToken})`);
  }

  console.log(`\nSuccessfully seeded ${rooms.length} rooms!`);
}

main()
  .catch((e) => {
    console.error("Error seeding rooms:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
