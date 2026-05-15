const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding Modules...');

  // 1. Create Modules
  const tawaf = await prisma.vRModule.create({
    data: {
      name: 'Modul Tawaf',
      description: 'Simulasi mengelilingi Ka’bah sebanyak 7 kali putaran dengan panduan doa di setiap rukun.',
      thumbnail: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=1000'
    }
  });

  const jumroh = await prisma.vRModule.create({
    data: {
      name: 'Modul Lempar Jumroh',
      description: 'Simulasi melontar batu di Jamarat (Ula, Wustha, Aqabah) sebagai bagian dari wajib haji.',
      thumbnail: 'https://images.unsplash.com/photo-1565552645632-d7c5f76a16be?auto=format&fit=crop&q=80&w=1000'
    }
  });

  const sai = await prisma.vRModule.create({
    data: {
      name: 'Modul Sa’i',
      description: 'Simulasi berjalan kaki dari bukit Safa ke bukit Marwah sebanyak 7 kali perjalanan.',
      thumbnail: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=1000'
    }
  });

  // 2. Add Scenes for Tawaf
  const p1 = await prisma.vRScene.create({
    data: {
      name: 'Hajar Aswad (Start)',
      panoramaPath: '/uploads/panorama/tawaf_start.jpg',
      isFirst: true,
      moduleId: tawaf.id
    }
  });

  const p2 = await prisma.vRScene.create({
    data: {
      name: 'Rukun Yamani',
      panoramaPath: '/uploads/panorama/rukun_yamani.jpg',
      moduleId: tawaf.id
    }
  });

  // 3. Connect them
  await prisma.vRHotspot.create({
    data: {
      sceneId: p1.id,
      targetSceneId: p2.id,
      pitch: -10,
      yaw: 170,
      text: 'Lanjut ke Rukun Yamani'
    }
  });

  console.log('Seeding Complete!');
}

seed().finally(() => prisma.$disconnect());
