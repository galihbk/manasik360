const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting deletion process for Monas 14...');
  
  // Try finding and deleting the scene by name or path
  const scenes = await prisma.vRScene.findMany({
    where: {
      OR: [
        { name: { contains: 'monas 14', mode: 'insensitive' } },
        { name: { contains: 'monas14', mode: 'insensitive' } },
        { panoramaPath: { contains: 'monas14.jpg', mode: 'insensitive' } }
      ]
    }
  });

  if (scenes.length === 0) {
    console.log('No database records found for Monas 14.');
  } else {
    for (const scene of scenes) {
      // First delete associated hotspots
      await prisma.vRHotspot.deleteMany({
        where: {
          OR: [
            { sceneId: scene.id },
            { targetSceneId: scene.id }
          ]
        }
      });
      // Then delete the scene
      await prisma.vRScene.delete({
        where: { id: scene.id }
      });
      console.log(`Deleted VRScene: ${scene.name} (${scene.panoramaPath})`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
