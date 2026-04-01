/**
 * Creates an admin user directly in the database.
 * Usage: npx tsx scripts/create-admin.ts <email> <name> [password]
 *
 * Example:
 *   npx tsx scripts/create-admin.ts admin@example.com "Admin User" mypassword123
 */
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

const [, , email, name, password] = process.argv;

if (!email || !name) {
  console.error("Usage: npx tsx scripts/create-admin.ts <email> <name> [password]");
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL?.startsWith("file:")
  ? process.env.DATABASE_URL
  : `file:${path.join(process.cwd(), "prisma", "dev.db")}`;

const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // Promote existing user to admin
    await prisma.user.update({
      where: { email },
      data: { role: "admin", ...(hashedPassword ? { password: hashedPassword } : {}) },
    });
    console.log(`✅ Promoted ${email} to admin`);
  } else {
    // Create new admin user
    await prisma.user.create({
      data: {
        email,
        name,
        role: "admin",
        password: hashedPassword,
      },
    });
    console.log(`✅ Created admin user: ${email}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
