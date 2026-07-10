'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ApiClient } from '@bahrain/api-client';
import { MessageSquare, X, Send, Loader2, Minimize2 } from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('bahrain_user_role') || '';
    const storedName = localStorage.getItem('bahrain_user_name') || '';
    setRole(storedRole);
    setUserName(storedName);
  }, []);

  const toggleChat = () => {
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    if (newOpen) {
      fetchMessages();
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await client.getChatMessages('super-admin');
      if (Array.isArray(res)) {
        setMessages(res);
      }
    } catch (e) {
      console.error('Failed to load chat messages:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const silentFetchMessages = async () => {
    try {
      const res = await client.getChatMessages('super-admin');
      if (Array.isArray(res)) {
        setMessages(res);
      }
    } catch {}
  };

  // Poll for messages when chat is open
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      silentFetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Do not show widget for Super Admin role
  const isSuper = role === 'Super Admin' || role === 'SUPER_ADMIN' || role === 'SUPER ADMIN';
  if (isSuper || !role) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsSending(true);
    const textToSend = inputText;
    setInputText('');

    try {
      const res = await client.sendChatMessage('super-admin', textToSend);
      if (res && res.success) {
        setMessages(prev => [...prev, res.message]);
      } else {
        setInputText(textToSend);
      }
    } catch (e) {
      setInputText(textToSend);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Box */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 transform scale-100 origin-bottom-right">
          
          {/* Header */}
          <div className="px-4 py-3 bg-[#1e40af] text-white flex items-center justify-between shadow shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <div>
                <h4 className="text-xs font-extrabold tracking-wide">Customer Service</h4>
                <p className="text-[9px] text-blue-100 font-bold">Respon cepat admin</p>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Wrapper */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {isLoading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-[#1e40af]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Memuat pesan...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 gap-2">
                <MessageSquare className="w-7 h-7 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
                <h5 className="text-xs font-bold text-slate-800">Ada yang bisa dibantu?</h5>
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  Kirim pesan di bawah untuk berkonsultasi mengenai voucher atau materi haji/umrah dengan admin.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMyMessage = msg.senderId !== 'super-admin' && 
                                    msg.sender?.role !== 'SUPER_ADMIN' && 
                                    msg.sender?.role !== 'SUPER ADMIN';
                
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${isMyMessage ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className={`p-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${
                      isMyMessage 
                        ? 'bg-[#1e40af] text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                      {msg.message}
                    </div>
                    <span className="text-[8px] text-slate-400 font-bold mt-1 px-1">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-200 bg-white flex gap-2 items-center shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pesan..."
              className="flex-1 px-3 py-1.5 border border-slate-250 rounded-full text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="w-7.5 h-7.5 rounded-full bg-[#1e40af] hover:bg-blue-800 text-white flex items-center justify-center shadow transition-all disabled:opacity-40 shrink-0"
            >
              {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      )}

      {/* Floating Button Trigger */}
      <button
        onClick={toggleChat}
        className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-[#1e40af]'
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </div>
  );
}
