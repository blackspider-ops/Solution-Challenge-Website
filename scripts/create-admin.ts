/**
 * Creates an admin user directly in the database.
 * Usage: npx tsx scripts/create-admin.ts <email> <name> [password]
 *
 * Example:
 *   npx tsx scripts/create-admin.ts admin@example.com "Admin User" mypassword123
 */
import { db } from "../lib/db";
import bcrypt from "bcryptjs";

const [, , email, name, password] = process.argv;

if (!email || !name) {
  console.error("Usage: npx tsx scripts/create-admin.ts <email> <name> [password]");
  process.exit(1);
}

async function main() {
  const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

  const existing = await db.user.findUnique({ where: { email } });

  if (existing) {
    // Promote existing user to admin
    await db.user.update({
      where: { email },
      data: { role: "admin", ...(hashedPassword ? { password: hashedPassword } : {}) },
    });
    console.log(`✅ Promoted ${email} to admin`);
  } else {
    // Create new admin user
    await db.user.create({
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
  .finally(() => process.exit(0));
