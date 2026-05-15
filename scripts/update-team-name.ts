import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTeamName() {
  try {
    // Find the team with the old name
    const team = await prisma.team.findFirst({
      where: {
        name: "Roshan and Vedant"
      },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    });

    if (!team) {
      console.log("❌ Team 'Roshan and Vedant' not found");
      return;
    }

    console.log(`✅ Found team: ${team.name}`);
    console.log(`   Members: ${team.members.map(m => m.user.name || m.user.email).join(', ')}`);

    // Update the team name
    const updated = await prisma.team.update({
      where: {
        id: team.id
      },
      data: {
        name: "OffLearn"
      }
    });

    console.log(`✅ Team name updated from "${team.name}" to "${updated.name}"`);
    console.log(`   Team ID: ${updated.id}`);

  } catch (error) {
    console.error("❌ Error updating team name:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTeamName();
