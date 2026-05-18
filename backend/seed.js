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
    comment: "Sangat membantu untuk membayangkan situasi di lapangan sebelum keberangkatan asli. Fitur VR-nya luar biasa jernih!",
    date: "10 Mei 2026"
  },
  {
    name: "Budi Santoso",
    role: "Jamaah Haji 2024",
    avatar: "/images/pilgrim-hero.png",
    rating: 5,
    comment: "Teknologi VR 360° nya luar biasa! Terasa nyata sekali seperti berada langsung di depan Ka'bah dan bukit Safa-Marwah.",
    date: "12 Mei 2026"
  },
  {
    name: "H. Ahmad Fauzi",
    role: "Jamaah Haji 2025",
    avatar: "/images/pilgrim-hero.png",
    rating: 5,
    comment: "Sangat menolong bagi saya yang lanjut usia untuk mempelajari tata cara thawaf secara visual sebelum berangkat.",
    date: "15 Mei 2026"
  },
  {
    name: "Rina Rahmawati",
    role: "Calon Jamaah 2026",
    avatar: "/images/pilgrim-hero.png",
    rating: 5,
    comment: "Belajar doa jadi jauh lebih cepat karena ada audio bimbingan pelafalan arab, latin, dan arti terjemahannya.",
    date: "18 Mei 2026"
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

const blogPosts = [
  {
    title: "Tips Mempersiapkan Fisik Prima Sebelum Berangkat Haji",
    slug: "tips-persiapan-fisik-haji",
    summary: "Ibadah Haji memerlukan ketahanan fisik yang kuat karena melibatkan banyak berjalan kaki. Berikut adalah tips latihan fisik praktis harian untuk calon jamaah.",
    content: "Latihan fisik harian seperti jalan sehat 3-5 km setiap pagi, menjaga pola makan bergizi, dan mengonsumsi vitamin sangat krusial agar stamina Anda tetap prima selama rukun Thawaf dan Sa'i.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600",
    category: "Tips Persiapan",
    date: "18 Mei 2026"
  },
  {
    title: "Memahami Perbedaan Rukun Haji dan Wajib Haji Agar Ibadah Sah",
    slug: "perbedaan-rukun-dan-wajib-haji",
    summary: "Jangan sampai tertukar! Simak penjelasan detail mengenai perbedaan mendasar antara Rukun Haji yang tidak boleh ditinggalkan dan Wajib Haji yang bisa diganti dengan Dam.",
    content: "Rukun Haji seperti Niat Ihram, Wukuf di Arafah, Thawaf Ifadhah, dan Sa'i adalah mutlak dan tidak bisa digantikan. Sedangkan Wajib Haji seperti melontar jumrah jika ditinggalkan wajib membayar denda (Dam) namun hajinya tetap sah.",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600",
    category: "Fikih Haji",
    date: "15 Mei 2026"
  },
  {
    title: "Panduan Praktis Memakai Kain Ihram yang Benar untuk Laki-laki",
    slug: "panduan-memakai-kain-ihram",
    summary: "Cara melilitkan kain ihram seringkali membingungkan bagi pemula. Ikuti 3 langkah praktis ini untuk melilit kain secara kencang tanpa jahitan.",
    content: "Gunakan sabuk ihram elastis untuk mengunci bagian bawah kain agar tidak melorot saat melangkah. Pastikan bahu kanan terbuka (Idhthiba') hanya saat melakukan Thawaf saja.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600",
    category: "Panduan Teknis",
    date: "10 Mei 2026"
  }
];

async function main() {
  console.log('Seeding data...');
  
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.activityHistory.deleteMany();
  await prisma.prayer.deleteMany();
  await prisma.blogPost.deleteMany();

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

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }

  // Seed Super Admin Account
  const bcrypt = require('bcryptjs');
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@manasik360.com' }
  });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    await prisma.user.create({
      data: {
        name: 'Super Admin Manasik360',
        email: 'admin@manasik360.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('Super Admin seeded successfully: admin@manasik360.com / adminpassword');
  } else {
    console.log('Super Admin account already exists, skipping.');
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
