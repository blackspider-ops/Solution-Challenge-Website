import { db } from '../lib/db';

async function enableAllTracks() {
  console.log('🔓 Enabling all tracks...\n');

  const result = await db.track.updateMany({
    data: {
      visible: true,
    },
  });

  console.log(`✅ Enabled ${result.count} tracks\n`);

  const tracks = await db.track.findMany({
    select: {
      slug: true,
      name: true,
      visible: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  console.log('📋 Track Status:');
  tracks.forEach((track) => {
    console.log(`  ${track.visible ? '✅' : '❌'} ${track.name} (${track.slug})`);
  });
}

enableAllTracks().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
