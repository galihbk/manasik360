"use client";

import { useState, useRef, useEffect } from "react";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", {
        credentials: "include"
      });
      const json = await response.json();
      if (json.status === "success") {
        setNotifications(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PATCH",
        credentials: "include"
      });
      const json = await response.json();
      if (json.status === "success") {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isOpen ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-emerald-900/20' : 'text-gray-500 hover:bg-gray-50'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        {notifications.some(n => n.unread) && (
          <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full border-2 ${isOpen ? 'bg-white border-[var(--color-primary)]' : 'bg-red-500 border-white'}`}></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-[200] overflow-hidden animate-in fade-in zoom-in duration-200">
           <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h4 className="font-bold text-gray-900">Notifikasi</h4>
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest hover:underline"
              >
                Tandai Dibaca
              </button>
           </div>
           
           <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                 <div className="p-10 text-center text-gray-400 text-sm">Tidak ada notifikasi baru</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className={`p-6 border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors cursor-pointer group flex gap-4 ${n.unread ? 'bg-emerald-50/30' : ''}`}>
                     <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${n.unread ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {n.type === 'info' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        ) : n.type === 'success' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        )}
                     </div>
                     <div className="space-y-1">
                        <h5 className="text-sm font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{n.title}</h5>
                        <p className="text-xs text-gray-500 leading-relaxed">{n.desc}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-1">{n.time}</p>
                     </div>
                  </div>
                ))
              )}
           </div>
           
           <button className="w-full py-4 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[var(--color-primary)] hover:bg-gray-100 transition-all">
              Lihat Semua Notifikasi
           </button>
        </div>
      )}
    </div>
  );
}
