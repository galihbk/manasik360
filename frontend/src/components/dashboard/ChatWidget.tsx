"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Assalamu'alaikum! Ada yang bisa kami bantu mengenai persiapan ibadah Anda?", sender: 'bot', time: '14:00' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulated Bot Response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: "Terima kasih atas pesannya. Tim CS kami akan segera menghubungi Anda kembali dalam beberapa menit.",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[500] flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-[400px] h-[500px] bg-white rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
           {/* Header */}
           <div className="bg-[#064e3b] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                 </div>
                 <div>
                    <h4 className="font-bold text-sm">CS Manasik360</h4>
                    <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">Online Sekarang</p>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform p-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
           </div>

           {/* Messages Area */}
           <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                     m.sender === 'user' 
                     ? 'bg-[var(--color-primary)] text-white rounded-tr-none' 
                     : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                   }`}>
                      {m.text}
                      <p className={`text-[8px] mt-2 font-bold uppercase ${m.sender === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>
                        {m.time}
                      </p>
                   </div>
                </div>
              ))}
           </div>

           {/* Input Area */}
           <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-50 flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tulis pesan..." 
                className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
              />
              <button type="submit" className="w-12 h-12 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              </button>
           </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[2rem] shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative ${
          isOpen ? 'bg-white text-gray-400 border border-gray-100' : 'bg-[var(--color-primary)] text-white shadow-emerald-900/30'
        }`}
      >
        {!isOpen && <span className="absolute inset-0 rounded-[2rem] bg-[var(--color-primary)] animate-ping opacity-20"></span>}
        
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        )}

        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">1</span>
        )}
      </button>
    </div>
  );
}
