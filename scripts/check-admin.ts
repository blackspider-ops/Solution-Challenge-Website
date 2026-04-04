import { db } from '../lib/db';

async function checkAdmin() {
  const u = await db.user.findUnique({
    where: { email: 'rva5573@psu.edu' },
    select: { id: true, email: true, role: true, password: true },
  });

  console.log(JSON.stringify({
    ...u,
    password: u?.password ? '[SET]' : '[MISSING]',
  }));
}

checkAdmin().catch(console.error);
