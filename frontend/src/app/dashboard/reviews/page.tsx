"use client";

import { useState, useEffect } from "react";
import ReviewCard from "@/components/dashboard/reviews/ReviewCard";
import ReviewModal from "@/components/dashboard/reviews/ReviewModal";
import Card from "@/components/ui/Card";

interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/reviews", {
        credentials: "include"
      });
      const json = await response.json();
      if (json.status === "success") {
        setReviews(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="w-full space-y-12 pb-10">
      {/* Review Submission Modal */}
      <ReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchReviews}
      />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Ulasan Pengguna</h1>
        <p className="text-gray-500">Dengarkan pengalaman jamaah lain atau bagikan cerita Anda sendiri.</p>
      </div>

      {/* Summary Stats Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <Card className="p-8 bg-white border-none shadow-sm flex flex-col items-center justify-center text-center space-y-2 rounded-[2.5rem]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating Rata-rata</p>
            <h3 className="text-5xl font-black text-gray-900">4.9</h3>
            <div className="flex gap-1 text-amber-400">
               {[...Array(5)].map((_, i) => (
                 <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
               ))}
            </div>
            <p className="text-xs text-gray-400">Berdasarkan {reviews.length} ulasan</p>
         </Card>

         <Card className="lg:col-span-3 p-8 bg-[#064e3b] text-white border-none shadow-xl rounded-[2.5rem] flex flex-col lg:flex-row items-center gap-10">
            <div className="space-y-4 flex-1 text-center lg:text-left">
               <h3 className="text-2xl font-bold">Bagikan Pengalaman Anda</h3>
               <p className="text-emerald-100 text-sm leading-relaxed">
                  Bantu jamaah lain dengan memberikan ulasan mengenai pengalaman Anda menggunakan simulasi Manasik360.
               </p>
               <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[var(--color-accent)] text-white px-10 py-3 rounded-full font-bold text-xs shadow-lg hover:bg-[#b45309] transition-all uppercase tracking-widest"
               >
                  Tulis Ulasan Sekarang
               </button>
            </div>
            <div className="hidden lg:flex gap-4">
               <div className="w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
               </div>
               <div className="w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
               </div>
            </div>
         </Card>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {loading ? (
            <div className="col-span-full flex justify-center py-20">
               <div className="w-10 h-10 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
            </div>
         ) : (
            reviews.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))
         )}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-8">
         <button className="px-12 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl text-xs font-bold transition-all hover:bg-white hover:border-gray-200">
            Lihat Lebih Banyak Ulasan
         </button>
      </div>
    </div>
  );
}
