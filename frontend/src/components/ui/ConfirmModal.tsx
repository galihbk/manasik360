"use client";

import { ReactNode } from "react";
import Button from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Hapus Data",
  cancelText = "Batal",
  type = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      bg: "bg-red-50",
      icon: "text-red-600",
      btn: "bg-red-600 hover:bg-red-700 shadow-red-900/20",
    },
    warning: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      btn: "bg-amber-600 hover:bg-amber-700 shadow-amber-900/20",
    },
    info: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      btn: "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20",
    },
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 text-center">
          <div className={`w-20 h-20 ${style.bg} ${style.icon} rounded-3xl flex items-center justify-center mx-auto mb-8`}>
             {type === 'danger' && (
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
             )}
             {type === 'warning' && (
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
             )}
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">{message}</p>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onClose}
              className="py-4 px-6 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest text-[10px]"
            >
              {cancelText}
            </button>
            <Button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`py-4 px-6 rounded-2xl font-bold text-white shadow-xl ${style.btn} transition-all uppercase tracking-widest text-[10px]`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
