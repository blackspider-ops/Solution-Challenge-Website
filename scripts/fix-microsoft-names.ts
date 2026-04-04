import { db } from "../lib/db";

async function fixMicrosoftNames() {
  console.log("🔍 Finding users with Microsoft name format...\n");

  try {
    // Get all users with @psu.edu emails
    const users = await db.user.findMany({
      where: {
        email: {
          endsWith: "@psu.edu",
        },
        name: {
          contains: ",",
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (users.length === 0) {
      console.log("✅ No users found with Microsoft name format");
      return;
    }

    console.log(`Found ${users.length} users with "Last, First" format\n`);

    let fixedCount = 0;

    for (const user of users) {
      if (!user.name) continue;

      // Split by comma and reverse
      const parts = user.name.split(",").map(p => p.trim());
      if (parts.length === 2) {
        const newName = `${parts[1]} ${parts[0]}`; // "First Last"
        
        console.log(`📝 ${user.email}`);
        console.log(`   Old: "${user.name}"`);
        console.log(`   New: "${newName}"`);
        
        await db.user.update({
          where: { id: user.id },
          data: { name: newName },
        });
        
        fixedCount++;
        console.log(`   ✅ Updated\n`);
      }
    }

    console.log("=".repeat(50));
    console.log(`📊 Summary: Fixed ${fixedCount} user names`);
    console.log("=".repeat(50));
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

fixMicrosoftNames();
