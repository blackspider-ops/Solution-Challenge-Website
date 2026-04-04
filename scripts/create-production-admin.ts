/**
 * Creates an admin user in the production database.
 * This script works with PostgreSQL (Neon).
 * 
 * Usage: npx tsx scripts/create-production-admin.ts
 */
import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const adminEmail = "rva5573@psu.edu";
  const adminPassword = "RajAwinashe@17";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  console.log("🔧 Creating admin account...");
  console.log(`Email: ${adminEmail}`);

  const existing = await db.user.findUnique({ 
    where: { email: adminEmail } 
  });

  if (existing) {
    // Update existing user to admin
    await db.user.update({
      where: { email: adminEmail },
      data: { 
        role: "admin", 
        password: hashedPassword,
        name: "GDG Admin"
      },
    });
    console.log(`✅ Updated ${adminEmail} to admin with new password`);
  } else {
    // Create new admin user
    await db.user.create({
      data: {
        email: adminEmail,
        name: "GDG Admin",
        role: "admin",
        password: hashedPassword,
      },
    });
    console.log(`✅ Created admin user: ${adminEmail}`);
  }

  console.log("\n📋 Admin Credentials:");
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log("\n⚠️  Please change this password after first login!");
}

main()
  .catch((e) => { 
    console.error("❌ Error:", e); 
    process.exit(1); 
  })
  .finally(() => process.exit(0));
