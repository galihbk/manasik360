"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/ui/Card";

interface ChatSession {
  sessionId: string;
  senderName: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  sender: 'user' | 'admin';
  createdAt: string;
}

export default function AdminLiveChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch all chat threads/sessions
  const fetchSessions = async (showPulse = false) => {
    try {
      const res = await fetch("/api/chat/sessions", { credentials: "include" });
      const json = await res.json();
      if (json.status === "success") {
        setSessions(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      if (showPulse) setLoading(false);
    }
  };

  // Fetch history for the active session
  const fetchMessages = async () => {
    if (!selectedSession) return;
    try {
      const res = await fetch(`/api/chat?sessionId=${selectedSession.sessionId}`);
      const json = await res.json();
      if (json.status === "success") {
        setMessages(json.data);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  // Initial load and periodic polling for list of sessions
  useEffect(() => {
    fetchSessions(true);
    const interval = setInterval(() => fetchSessions(false), 3000);
    return () => clearInterval(interval);
  }, []);

  // Poll for active messages when a session is open
  useEffect(() => {
    if (selectedSession) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    } else {
      setMessages([]);
    }
  }, [selectedSession]);

  // Smooth scroll to chat bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedSession) return;

    const textToSend = replyText;
    setReplyText("");

    // Optimistically add message
    const tempMsg: Message = {
      id: Date.now().toString(),
      senderId: selectedSession.sessionId,
      senderName: "Admin Bimbingan",
      text: textToSend,
      sender: "admin",
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await fetch("/api/chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sessionId: selectedSession.sessionId,
          text: textToSend
        })
      });
      fetchMessages();
      fetchSessions(false);
    } catch (err) {
      console.error("Failed to reply:", err);
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Baru";
    }
  };

  return (
    <div className="space-y-6 pb-20 text-left h-[calc(100vh-120px)] flex flex-col">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Konsol Live Chat</h1>
          <p className="text-slate-500 text-sm mt-1">Layani pertanyaan jamaah dan bantu mereka mempersiapkan ibadah secara langsung.</p>
        </div>
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 uppercase tracking-widest">
          {sessions.length} Percakapan
        </span>
      </div>

      {/* CHAT INTERFACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        
        {/* Left Side: Threads List (takes 1/3) */}
        <div className="lg:col-span-1 flex flex-col min-h-0">
          <Card className="flex-1 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex flex-col min-h-0 overflow-hidden">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 pl-2">Saluran Aktif</h3>
            
            <div className="flex-grow overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {loading ? (
                <div className="p-4 text-center text-xs text-emerald-600 font-bold animate-pulse">Menghubungkan Helpdesk...</div>
              ) : sessions.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                  Belum ada pesan masuk dari pengunjung web.
                </div>
              ) : (
                sessions.map((sess) => {
                  const isActive = selectedSession?.sessionId === sess.sessionId;
                  return (
                    <button
                      key={sess.sessionId}
                      onClick={() => setSelectedSession(sess)}
                      className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                        isActive 
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/10" 
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isActive ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}>
                        {sess.senderName.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-extrabold text-xs truncate max-w-[120px]">{sess.senderName}</h4>
                          <span className={`text-[8px] font-bold ${isActive ? "text-white/70" : "text-slate-400"}`}>
                            {formatTime(sess.lastMessageTime)}
                          </span>
                        </div>
                        <p className={`text-[10px] truncate ${isActive ? "text-white/80" : "text-slate-500"}`}>
                          {sess.lastMessage}
                        </p>
                      </div>

                      {sess.unread && !isActive && (
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0 border-2 border-white animate-ping"></div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Side: Conversation Area (takes 2/3) */}
        <div className="lg:col-span-2 flex flex-col min-h-0 h-full">
          {selectedSession ? (
            <Card className="flex-1 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col min-h-0 overflow-hidden">
              {/* Active Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-sm">
                    {selectedSession.senderName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{selectedSession.senderName}</h4>
                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                      Terhubung
                    </p>
                  </div>
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest select-none">
                  Session: {selectedSession.sessionId.substring(0, 15)}...
                </span>
              </div>

              {/* Message History list */}
              <div 
                ref={scrollRef} 
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 scrollbar-thin"
              >
                {/* Default welcome message placeholder to match frontend */}
                <div className="flex justify-start">
                  <div className="max-w-[75%] p-4 bg-slate-100 text-slate-700 rounded-2xl rounded-tl-none text-xs leading-relaxed shadow-sm">
                    Assalamu'alaikum! Ada yang bisa kami bantu mengenai persiapan ibadah Anda?
                    <p className="text-[8px] mt-2 font-bold uppercase text-slate-400">14:00</p>
                  </div>
                </div>

                {messages.map((m) => {
                  const isAdmin = m.sender === "admin";
                  return (
                    <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isAdmin 
                          ? "bg-emerald-600 text-white rounded-tr-none shadow-emerald-900/5" 
                          : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                      }`}>
                        {m.text}
                        <p className={`text-[8px] mt-2 font-bold uppercase ${isAdmin ? "text-emerald-100" : "text-slate-400"}`}>
                          {formatTime(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Admin Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-50 bg-white flex gap-2 shrink-0">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Ketik balasan Anda disini..."
                  className="flex-grow px-4 py-3.5 bg-slate-50 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/10 shadow-sm font-semibold text-slate-800"
                />
                <button
                  type="submit"
                  className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                </button>
              </form>
            </Card>
          ) : (
            <Card className="flex-1 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 mb-4 animate-bounce">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Pilih Saluran Percakapan</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 max-w-xs">
                Klik salah satu tamu aktif di panel kiri untuk mulai membalas pesan secara real-time.
              </p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
