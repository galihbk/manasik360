# Bahrain - Immersive VR Training Platform

Bahrain adalah platform pelatihan manasik haji dan umrah berbasis Virtual Reality (VR) 360 derajat. Platform ini dirancang untuk memberikan pengalaman simulasi yang nyata bagi calon jamaah melalui navigasi interaktif dan konten edukasi modular.

## 🚀 Fitur Utama

- **Modular VR Content Management**: Kelola kurikulum manasik berdasarkan modul (Tawaf, Sa'i, Wukuf, dll).
- **Interactive 360° Viewer**: Integrasi Pannellum untuk tampilan panorama yang mulus dan responsif.
- **Visual Hotspot System**: Navigasi antar titik lokasi menggunakan sistem koordinat (Yaw & Pitch) yang interaktif.
- **Admin Dashboard**: Panel kontrol lengkap untuk mengelola modul, mengunggah panorama, dan mengatur jalur navigasi.
- **Premium UI/UX**: Antarmuka modern dengan glassmorphism, animasi mikro, dan skema warna brand Emerald Green.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), TypeScript, Tailwind CSS.
- **Backend**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/).
- **Database**: [Prisma ORM](https://www.prisma.io/) dengan PostgreSQL/MySQL.
- **VR Engine**: [Pannellum](https://pannellum.org/).

## 📦 Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/galihbk/bahrain.git
   cd bahrain
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Sesuaikan file .env dengan database Anda
   npx prisma db push
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📸 Struktur Folder

- `/frontend`: Aplikasi web Next.js untuk jamaah dan admin.
- `/backend`: API server untuk manajemen konten VR dan otentikasi.
- `/uploads`: Direktori penyimpanan aset panorama dan thumbnail.

## 🤝 Kontribusi

Kontribusi selalu terbuka! Silakan fork repository ini dan buat pull request untuk fitur-fitur baru.

---
**Bahrain** - *Bimbingan Ibadah Lebih Nyata, Lebih Berkesan.*
