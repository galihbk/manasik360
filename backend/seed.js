const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const prayers = [
  {
    title: "Niat Ihram Haji",
    category: "Persiapan Ihram",
    arabic: "لَبَّيْكَ اللَّهُمَّ حَجًّا",
    latin: "Labbaikallahumma Hajjan",
    translation: "Aku penuhi panggilan-Mu, ya Allah, untuk berhaji."
  }
];

const activities = [
  {
    title: "Menonton Video: Persiapan Miqat",
    type: "Belajar",
    time: "14:20 WIB",
    date: "Hari Ini",
    color: "bg-blue-50 text-blue-600",
    icon: "video"
  }
];

const reviews = [
  {
    name: "Hj. Siti Aminah",
    role: "Jamaah Haji 2023",
    avatar: "/images/pilgrim-hero.png",
    rating: 5,
    comment: "Sangat membantu untuk membayangkan situasi di lapangan.",
    date: "10 Mei 2024"
  }
];

const notifications = [
  { 
    title: "Modul Baru Tersedia", 
    desc: "Simulasi VR Sa'i Safa-Marwah kini sudah bisa Anda akses.", 
    time: "2 menit yang lalu", 
    unread: true, 
    type: "info" 
  },
  { 
    title: "Pencapaian Baru!", 
    desc: "Selamat! Anda mendapatkan lencana 'Pioneer Ihram'.", 
    time: "1 jam yang lalu", 
    unread: true, 
    type: "success" 
  },
  { 
    title: "Pengingat Ibadah", 
    desc: "Jangan lupa untuk meninjau kembali doa Thawaf hari ini.", 
    time: "Kemarin", 
    unread: false, 
    type: "warning" 
  },
];

async function main() {
  console.log('Seeding data...');
  
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.activityHistory.deleteMany();
  await prisma.prayer.deleteMany();

  for (const prayer of prayers) {
    await prisma.prayer.create({ data: prayer });
  }

  for (const activity of activities) {
    await prisma.activityHistory.create({ data: activity });
  }

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }

  for (const notification of notifications) {
    await prisma.notification.create({ data: notification });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
