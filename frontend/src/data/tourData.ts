export interface TourStep {
  id: string;
  name: string;
  panoramaPath: string;
  title: string;
  description: string;
  audioPath?: string;
}

export const MANASIK_TUTORIAL: TourStep[] = [
  {
    id: "step-1",
    name: "Miqat",
    panoramaPath: "/images/miqat.png",
    title: "Memulai Ihram di Miqat",
    description: "Miqat adalah batas waktu dan tempat yang ditetapkan untuk memulai niat haji atau umrah. Di sini jamaah mengenakan pakaian ihram dan melakukan salat sunah ihram."
  },
  {
    id: "step-2",
    name: "Masjidil Haram",
    panoramaPath: "/images/kaaba.png",
    title: "Memasuki Masjidil Haram",
    description: "Saat memasuki Masjidil Haram, disunahkan mendahulukan kaki kanan dan membaca doa masuk masjid. Anda akan segera melihat Ka'bah di tengah lapangan."
  },
  {
    id: "step-3",
    name: "Tawaf",
    panoramaPath: "/images/kantor_360.jpg", // Menggunakan aset yang tersedia
    title: "Melaksanakan Tawaf",
    description: "Tawaf adalah mengelilingi Ka'bah sebanyak 7 kali putaran, dimulai dari Hajar Aswad dan berakhir di Hajar Aswad pula dengan posisi Ka'bah di sebelah kiri."
  },
  {
    id: "step-4",
    name: "Sa'i",
    panoramaPath: "/images/sai.png",
    title: "Safa dan Marwah (Sa'i)",
    description: "Berjalan kaki antara bukit Safa dan Marwah sebanyak 7 kali. Dimulai dari Safa dan berakhir di Marwah."
  }
];
