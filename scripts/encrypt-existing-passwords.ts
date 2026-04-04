import bcrypt from "bcryptjs";
import { db } from "../lib/db";

async function encryptExistingPasswords() {
  console.log("🔍 Checking for users with unencrypted passwords...\n");

  try {
    // Get all users with passwords
    const users = await db.user.findMany({
      where: {
        password: {
          not: null,
        },
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (users.length === 0) {
      console.log("✅ No users found in database");
      return;
    }

    console.log(`Found ${users.length} users with passwords\n`);

    let encryptedCount = 0;
    let alreadyEncryptedCount = 0;

    for (const user of users) {
      if (!user.password) continue;

      // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(user.password);

      if (isBcryptHash) {
        console.log(`✓ ${user.email} - Already encrypted`);
        alreadyEncryptedCount++;
      } else {
        console.log(`🔒 ${user.email} - Encrypting...`);
        
        // Hash the plain text password
        const hashedPassword = await bcrypt.hash(user.password, 12);
        
        // Update the user with hashed password
        await db.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
        
        console.log(`   ✅ Encrypted successfully`);
        encryptedCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("📊 Summary:");
    console.log(`   Total users: ${users.length}`);
    console.log(`   Already encrypted: ${alreadyEncryptedCount}`);
    console.log(`   Newly encrypted: ${encryptedCount}`);
    console.log("=".repeat(50));

    if (encryptedCount > 0) {
      console.log("\n✅ All passwords are now encrypted!");
    } else {
      console.log("\n✅ All passwords were already encrypted!");
    }
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

encryptExistingPasswords();
