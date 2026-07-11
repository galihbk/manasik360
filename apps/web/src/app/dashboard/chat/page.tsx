'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { 
  Send, 
  Loader2, 
  User, 
  MessageSquare,
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function ChatPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>('Learner');
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any | null>(null);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('bahrain_user_role') || 'Learner';
    setRole(storedRole);

    const isSuper = storedRole === 'Super Admin' || storedRole === 'SUPER_ADMIN' || storedRole === 'SUPER ADMIN';
    if (isSuper) {
      fetchConversations();
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Periodic polling for new messages (e.g. every 5 seconds) to make the chat feel real-time!
  useEffect(() => {
    const interval = setInterval(() => {
      const isSuper = role === 'Super Admin' || role === 'SUPER_ADMIN' || role === 'SUPER ADMIN';
      if (isSuper) {
        if (activeContact) {
          silentFetchMessages(activeContact.id);
        }
        silentFetchConversations();
      } else {
        silentFetchMessages('super-admin');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [role, activeContact]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const res = await client.getChatConversations();
      if (Array.isArray(res)) {
        setConversations(res);
        if (res.length > 0 && !activeContact) {
          // Select first conversation by default
          setActiveContact(res[0].contact);
          fetchMessages(res[0].contact.id);
        }
      }
    } catch (e) {
      console.error(e);
      showToast('Gagal memuat daftar percakapan.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const silentFetchConversations = async () => {
    try {
      const res = await client.getChatConversations();
      if (Array.isArray(res)) {
        setConversations(res);
      }
    } catch {}
  };

  const fetchMessages = async (contactId: string) => {
    setIsLoading(true);
    try {
      const res = await client.getChatMessages(contactId);
      if (Array.isArray(res)) {
        setMessages(res);
      }
    } catch (e) {
      console.error(e);
      showToast('Gagal memuat pesan.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const silentFetchMessages = async (contactId: string) => {
    try {
      const res = await client.getChatMessages(contactId);
      if (Array.isArray(res)) {
        // Only update if message count changes to prevent unnecessary scroll/render loops
        setMessages(res);
      }
    } catch {}
  };

  const handleSelectContact = (contact: any) => {
    setActiveContact(contact);
    fetchMessages(contact.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const isSuper = role === 'Super Admin' || role === 'SUPER_ADMIN' || role === 'SUPER ADMIN';
    const targetRecipientId = isSuper ? activeContact?.id : 'super-admin';
    if (!targetRecipientId) {
      showToast('Tidak ada penerima pesan yang dipilih.', 'error');
      return;
    }

    setIsSending(true);
    const textToSend = inputText;
    setInputText('');

    try {
      const res = await client.sendChatMessage(targetRecipientId, textToSend);
      if (res && res.success) {
        // Instantly append to show message quickly
        setMessages(prev => [...prev, res.message]);
        if (isSuper) {
          silentFetchConversations();
        }
      } else {
        showToast('Gagal mengirim pesan.', 'error');
        setInputText(textToSend); // Restore input
      }
    } catch (e) {
      showToast('Gagal mengirim pesan, gangguan koneksi.', 'error');
      setInputText(textToSend); // Restore input
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const isSuperAdminUser = role === 'Super Admin' || role === 'SUPER_ADMIN' || role === 'SUPER ADMIN';

  return (
    <div className="p-6 md:p-8 w-full space-y-6 bg-slate-50 min-h-screen">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-55 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-xs font-bold transition-all ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-850 rounded-full">
          Layanan Chat Virtual
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-2">Hub Layanan Pelanggan</h1>
        <p className="text-xs text-slate-400 mt-1">
          {isSuperAdminUser 
            ? 'Kelola keluhan, voucher, dan konsultasi dari seluruh tenant biro perjalanan atau jemaah.' 
            : 'Punya pertanyaan atau keluhan? Chat langsung dengan Super Administrator kami.'}
        </p>
      </div>

      {/* Chat Dashboard Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex h-[65vh] min-h-[500px]">
        
        {/* Left Sidebar: Conversations (Only visible for Super Admin) */}
        {isSuperAdminUser && (
          <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-slate-200 bg-white">
              <h2 className="text-xs font-extrabold text-slate-450 uppercase tracking-wider">Percakapan Masuk</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 font-bold uppercase tracking-wider mt-10">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  Belum ada chat masuk.
                </div>
              ) : (
                conversations.map((conv) => {
                  const isSelected = activeContact?.id === conv.contact.id;
                  const isOrg = conv.contact.role === 'ORG_ADMIN' || conv.contact.role === 'ORG ADMIN';
                  return (
                    <button
                      key={conv.contact.id}
                      onClick={() => handleSelectContact(conv.contact)}
                      className={`w-full text-left p-4 flex gap-3 transition-all ${
                        isSelected ? 'bg-white border-l-4 border-blue-600' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0 uppercase">
                        {conv.contact.name.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 truncate">{conv.contact.name}</p>
                          <span className="text-[9px] text-slate-400 font-semibold">{formatTime(conv.lastMessage.createdAt)}</span>
                        </div>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase mt-1 ${
                          isOrg ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {isOrg ? 'Biro' : 'Jemaah'}
                        </span>
                        <p className="text-[11px] text-slate-500 truncate mt-1.5">{conv.lastMessage.message}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Right Chat Box */}
        <div className="flex-1 flex flex-col bg-slate-50/30">
          
          {/* Chat Box Header */}
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600/10 flex items-center justify-center font-bold text-blue-700 text-xs shrink-0 uppercase">
                {isSuperAdminUser ? (activeContact ? activeContact.name.slice(0, 2) : '?') : 'SA'}
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-900">
                  {isSuperAdminUser ? (activeContact ? activeContact.name : 'Pilih Percakapan') : 'Customer Support Super Admin'}
                </h3>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Memuat pesan...</p>
              </div>
            ) : !isSuperAdminUser && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center max-w-sm mx-auto">
                <MessageSquare className="w-8 h-8 text-blue-600 bg-blue-50 p-2 rounded-xl" />
                <h4 className="text-xs font-bold text-slate-800">Mulai Obrolan Baru</h4>
                <p className="text-[11px] text-slate-450 leading-relaxed">
                  Tulis pesan Anda di bawah ini untuk mengirim konsultasi, pertanyaan tentang voucher, atau masukan sistem kepada Super Admin.
                </p>
              </div>
            ) : isSuperAdminUser && !activeContact ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center max-w-sm mx-auto">
                <MessageSquare className="w-8 h-8 text-slate-400 bg-slate-100 p-2 rounded-xl" />
                <h4 className="text-xs font-bold text-slate-800">Belum Ada Percakapan Terpilih</h4>
                <p className="text-[11px] text-slate-450 leading-relaxed">
                  Silakan pilih salah satu user dari panel sebelah kiri untuk mulai berbalas pesan.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                // Sender determination (super admin matches Super Admin role or specific sender ID)
                const isMyMessage = isSuperAdminUser 
                  ? msg.sender.role === 'SUPER_ADMIN' || msg.sender.role === 'SUPER ADMIN'
                  : msg.senderId !== 'super-admin' && msg.sender.role !== 'SUPER_ADMIN' && msg.sender.role !== 'SUPER ADMIN';
                
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[70%] ${isMyMessage ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <span className="text-[9px] text-slate-400 font-semibold mb-1 px-1">
                      {msg.sender.name}
                    </span>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      isMyMessage 
                        ? 'bg-[#1e40af] text-white rounded-tr-none shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
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

          {/* Chat Input Bar */}
          {(!isSuperAdminUser || activeContact) && (
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2 items-center shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tulis pesan layanan pelanggan..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="w-8.5 h-8.5 rounded-full bg-[#1e40af] hover:bg-blue-800 text-white flex items-center justify-center shadow transition-all disabled:opacity-40 shrink-0"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
