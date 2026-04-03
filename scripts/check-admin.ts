import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

async function checkAdmin() {
  const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' });
  const prisma = new PrismaClient({ adapter } as never);

  const u = await prisma.user.findUnique({
    where: { email: 'rva5573@psu.edu' },
    select: { id: true, email: true, role: true, password: true },
  });

  console.log(JSON.stringify({
    ...u,
    password: u?.password ? '[SET]' : '[MISSING]',
  }));

  await prisma.$disconnect();
}

checkAdmin().catch(console.error);
